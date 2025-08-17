import cn from "classnames";
import React, { useCallback, useMemo, useState } from "react";
import { Editor, Node, Path, Range, Element as SlateElement, Text, Transforms, createEditor } from "slate";
import { withHistory } from "slate-history";
import { Editable, Slate, useSlate, withReact } from "slate-react";

import { Modal, ModalWrapper } from "@/ui";

import { Button, FieldErrorSpan, Input } from "@/uiForm";

const LIST_TYPES = ["numbered-list", "bulleted-list"];
const WRAPPER_TYPES = new Set(["block-quote"]);

const initialValue = [
	{
		type: "paragraph",
		align: "left",
		children: [{ text: "" }]
	}
];

const withCleanup = editor => {
	const { normalizeNode, deleteBackward, deleteForward, deleteFragment } = editor;

	const removeEmptyWrappersOnce = () => {
		// проходимся по всем обёрткам и распаковываем пустые
		for (const [node, path] of Editor.nodes(editor, {
			at: [],
			match: n => SlateElement.isElement(n) && WRAPPER_TYPES.has(n.type)
		})) {
			// считаем пустым, если в сумме нет текста
			if (Editor.isEmpty(editor, node) || Node.string(node).trim().length === 0) {
				Transforms.unwrapNodes(editor, { at: path });
				return; // по одному изменению за проход, чтобы не ловить рассинхрон путей
			}
		}
	};

	editor.normalizeNode = entry => {
		normalizeNode(entry);
		removeEmptyWrappersOnce();
	};

	editor.deleteBackward = unit => {
		deleteBackward(unit);
		removeEmptyWrappersOnce();
	};

	editor.deleteForward = unit => {
		deleteForward(unit);
		removeEmptyWrappersOnce();
	};

	editor.deleteFragment = direction => {
		deleteFragment(direction);
		removeEmptyWrappersOnce();
	};

	return editor;
};

const SlateEditor = () => {
	const renderElement = useCallback(props => <Element {...props} />, []);
	const renderLeaf = useCallback(props => <Leaf {...props} />, []);
	const editor = useMemo(() => withCleanup(withInlines(withHistory(withReact(createEditor())))), []);

	const [enterCount, setEnterCount] = useState(0);

	const handleKeyDown = event => {
		if (event.key === "Enter") {
			setEnterCount(prev => {
				const newCount = prev + 1;

				if (newCount >= 3) {
					// сбрасываем все marks
					const marks = Editor.marks(editor);
					if (marks) {
						Object.keys(marks).forEach(mark => {
							Editor.removeMark(editor, mark);
						});
					}

					// сбрасываем блоки в параграф
					Transforms.setNodes(
						editor,
						{ type: "paragraph" },
						{
							match: n => SlateElement.isElement(n) && n.type !== "paragraph",
							split: true
						}
					);

					// unwrap всех спец-элементов
					Transforms.unwrapNodes(editor, {
						match: n =>
							SlateElement.isElement(n) &&
							(LIST_TYPES.includes(n.type) || n.type === "block-quote" || n.type === "block-spoiler" || n.type === "link"),
						split: true
					});

					return 0; // сбросили счётчик
				}

				return newCount;
			});
		} else {
			// сброс при любой другой клавише
			if (enterCount !== 0) setEnterCount(0);
		}
	};

	return (
		<div className='flex-grow'>
			<Slate editor={editor} initialValue={initialValue}>
				<div className='flex gap-1 flex-wrap'>
					<SlateButton format='bold' text='Жирный' type='mark' />
					<SlateButton format='italic' text='Курсив' type='mark' />
					<SlateButton format='underline' text='Подчёркнутый' type='mark' />
					<SlateButton format='strikethrough' text='Зачёркнутый' type='mark' />
					<SlateButton format='block-quote' text='Цитата' type='block' />
					<button
						className='bg-primary400 p-1 rounded-lg'
						onMouseDown={e => {
							e.preventDefault();
							insertSpoiler(editor);
						}}>
						Скрытый
					</button>
					<LinkButton />
					<ClearFormattingButton />
					<button
						onClick={() => {
							const html = slateToHtml(editor.children);
							console.log(html);
						}}>
						test
					</button>
				</div>
				<Editable
					renderElement={renderElement}
					renderLeaf={renderLeaf}
					placeholder='Напишите сообщение...'
					spellCheck
					autoFocus
					className='slate-editor'
					onKeyDown={handleKeyDown}
				/>
			</Slate>
		</div>
	);
};

const insertSpoiler = editor => {
	if (!editor.selection) return;

	const spoiler = { type: "block-spoiler", children: [] };

	if (Range.isCollapsed(editor.selection)) {
		Transforms.insertNodes(editor, { ...spoiler, children: [{ text: "" }] });
	} else {
		Transforms.wrapNodes(editor, spoiler, { split: true });
		Transforms.collapse(editor, { edge: "end" });
	}
};

const withInlines = editor => {
	const { isInline } = editor;

	editor.isInline = element => ["link", "block-spoiler"].includes(element.type) || isInline(element);

	return editor;
};

const LinkButton = () => {
	const editor = useSlate();
	const [open, setOpen] = useState(false);
	const [url, setUrl] = useState("");

	const active = isLinkActive(editor);
	const [error, setError] = useState("");

	const normalizeUrl = value => {
		let u = value.trim();

		// если нет протокола — добавляем https://
		if (u && !/^https?:\/\//i.test(u)) {
			u = "https://" + u;
		}

		try {
			const parsed = new URL(u);

			// домен должен содержать хотя бы одну точку и нормальный TLD
			const hostname = parsed.hostname;
			if (!/\./.test(hostname)) return null;
			if (!/[a-zA-Z]{2,}$/.test(hostname.split(".").pop())) return null;

			return parsed.href;
		} catch {
			return null;
		}
	};

	const validateUrl = value => {
		if (!value) return "Введите ссылку";
		return normalizeUrl(value) ? "" : "Некорректный URL";
	};

	const handleConfirm = () => {
		const normalized = normalizeUrl(url);
		if (!normalized) {
			setError("Некорректный URL");
			return;
		}

		const linkEntry = getActiveLink(editor);

		if (linkEntry) {
			const [, path] = linkEntry;
			Transforms.setNodes(editor, { url: normalized }, { at: path });
		} else {
			insertLink(editor, normalized);
		}

		setOpen(false);
		setUrl("");
		setError("");
	};

	return (
		<>
			<button
				className={cn("bg-primary400 p-1 rounded-lg", active && "!bg-blue")}
				onMouseDown={e => {
					e.preventDefault();

					if (active) {
						const [link] = Editor.nodes(editor, {
							match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === "link"
						});

						if (link) {
							const [node] = link;
							setUrl(node.url || "");
							setError(validateUrl(node.url || ""));
						}
					}
					setOpen(true);
				}}>
				Ссылка
			</button>

			<ModalWrapper condition={open}>
				<Modal condition={open} set={setOpen}>
					<div className='p-4 flex flex-col gap-2'>
						<Input
							name='url'
							type='text'
							value={url}
							placeholder='Введите ссылку'
							onChange={value => {
								setUrl(value);
								setError(validateUrl(value));
							}}>
							{error && <FieldErrorSpan>{error}</FieldErrorSpan>}
						</Input>
						<div className='flex gap-2 justify-end'>
							<Button onClick={() => setOpen(false)} variant='secondary' className=''>
								Отмена
							</Button>
							<Button onClick={handleConfirm} className=''>
								OK
							</Button>
						</div>
					</div>
				</Modal>
			</ModalWrapper>
		</>
	);
};

const ClearFormattingButton = () => {
	const editor = useSlate();

	const handleClear = e => {
		e.preventDefault();
		if (!editor.selection) return;

		// 1. Убираем все marks (жирный, курсив, подчёркнутый и т.п.)
		const marks = Editor.marks(editor);
		if (marks) {
			Object.keys(marks).forEach(mark => {
				Editor.removeMark(editor, mark);
			});
		}

		// 2. Сбрасываем блоки в параграф
		Transforms.setNodes(
			editor,
			{ type: "paragraph" },
			{
				match: n => SlateElement.isElement(n) && n.type !== "paragraph",
				split: true
			}
		);

		// 3. Убираем все обёртки (цитата, список, спойлер и т.д.)
		Transforms.unwrapNodes(editor, {
			match: n =>
				SlateElement.isElement(n) &&
				(LIST_TYPES.includes(n.type) || n.type === "block-quote" || n.type === "block-spoiler" || n.type === "link"),
			split: true
		});
	};

	return (
		<button className='bg-red text-dark p-1 rounded-lg' onMouseDown={handleClear}>
			Очистить
		</button>
	);
};

const toggleBlock = (editor, format) => {
	const isActive = isBlockActive(editor, format);

	Transforms.unwrapNodes(editor, {
		match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && (isListType(n.type) || n.type === format),
		split: true
	});

	if (isActive) {
		Transforms.setNodes(editor, { type: "paragraph" });
	} else {
		if (format === "block-quote") {
			Transforms.wrapNodes(editor, { type: format, children: [] }, { at: Editor.unhangRange(editor, editor.selection), split: true });
		} else {
			Transforms.setNodes(editor, { type: format });
		}
	}
};

const toggleMark = (editor, format) => {
	const isActive = isMarkActive(editor, format);
	if (isActive) {
		Editor.removeMark(editor, format);
	} else {
		Editor.addMark(editor, format, true);
	}
};

const isBlockActive = (editor, format) => {
	const { selection } = editor;
	if (!selection) return false;
	const [match] = Array.from(
		Editor.nodes(editor, {
			at: Editor.unhangRange(editor, selection),
			match: n => {
				if (!Editor.isEditor(n) && SlateElement.isElement(n)) {
					return n.type === format;
				}
				return false;
			}
		})
	);
	return !!match;
};

const isMarkActive = (editor, format) => {
	const marks = Editor.marks(editor);
	return marks ? marks[format] === true : false;
};

const Element = ({ attributes, children, element }) => {
	switch (element.type) {
		case "link":
			return (
				<a {...attributes} href={element.url} className='text-blue' target='_blank' rel='noreferrer'>
					{children}
				</a>
			);

		case "block-quote":
			return (
				<blockquote className='custom-blockquote' {...attributes}>
					{children}
				</blockquote>
			);

		case "block-spoiler":
			return (
				<span className='draft-spoiler inline-block' data-draft-spoiler {...attributes}>
					{children}
				</span>
			);

		case "paragraph":
		default:
			return <p {...attributes}>{children}</p>;
	}
};

const Leaf = ({ attributes, children, leaf }) => {
	if (leaf.bold) {
		children = <span className='font-medium'>{children}</span>;
	}
	if (leaf.italic) {
		children = <span className='italic'>{children}</span>;
	}
	if (leaf.underline) {
		children = <span className='underline'>{children}</span>;
	}
	if (leaf.strikethrough) {
		children = <span className='line-through'>{children}</span>;
	}
	return <span {...attributes}>{children}</span>;
};

const SlateButton = ({ format, text, type }) => {
	const editor = useSlate();
	const isMark = type === "mark";
	const isBlock = type === "block";

	const isActive = isMark ? isMarkActive(editor, format) : isBlock ? isBlockActive(editor, format, "type") : false;

	return (
		<button
			className={cn("bg-primary400 p-1 rounded-lg", isActive && "!bg-blue")}
			onMouseDown={event => {
				event.preventDefault();
				if (isMark) {
					toggleMark(editor, format);
				}
				if (isBlock) {
					toggleBlock(editor, format);
				}
			}}>
			{text}
		</button>
	);
};

const isListType = format => {
	return LIST_TYPES.includes(format);
};

const insertLink = (editor, url) => {
	if (!editor.selection) return;

	const link = {
		type: "link",
		url,
		children: []
	};

	if (Range.isCollapsed(editor.selection)) {
		Transforms.insertNodes(editor, {
			...link,
			children: [{ text: url }]
		});
	} else {
		Transforms.wrapNodes(editor, link, { split: true });
		Transforms.collapse(editor, { edge: "end" });
	}
};

const unwrapLink = editor => {
	Transforms.unwrapNodes(editor, {
		match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === "link"
	});
};

const isLinkActive = editor => {
	const [link] = Editor.nodes(editor, {
		match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === "link"
	});
	return !!link;
};

export const getActiveLink = editor => {
	const [linkEntry] = Editor.nodes(editor, {
		match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === "link"
	});
	return linkEntry;
};

const serialize = node => {
	if (Text.isText(node)) {
		let string = node.text;

		if (node.bold) string = `<strong>${string}</strong>`;
		if (node.italic) string = `<em>${string}</em>`;
		if (node.underline) string = `<u>${string}</u>`;

		return string;
	}

	const children = node.children.map(n => serialize(n)).join("");

	switch (node.type) {
		case "block-quote":
			return `<blockquote>${children}</blockquote>`;
		case "block-spoiler":
			return `<span data-spoiler="true">${children}</span>`;
		case "link":
			return `<a href="${node.url}" target="_blank" rel="noopener noreferrer">${children}</a>`;
		default:
			return `<p>${children}</p>`;
	}
};

export const slateToHtml = value => {
	return value.map(n => serialize(n)).join("");
};

export const htmlToSlate = html => {
	const parser = new DOMParser();
	const doc = parser.parseFromString(html, "text/html");

	const deserialize = el => {
		if (el.nodeType === 3) {
			return { text: el.textContent };
		} else if (el.nodeType !== 1) {
			return null;
		}

		const children = Array.from(el.childNodes).map(deserialize).flat().filter(Boolean);

		switch (el.nodeName) {
			case "STRONG":
				return children.map(child => ({ ...child, bold: true }));
			case "EM":
				return children.map(child => ({ ...child, italic: true }));
			case "U":
				return children.map(child => ({ ...child, underline: true }));
			case "A":
				return { type: "link", url: el.getAttribute("href"), children };
			case "BLOCKQUOTE":
				return { type: "block-quote", children };
			case "SPAN":
				if (el.getAttribute("data-spoiler") === "true") {
					return { type: "block-spoiler", children };
				}
				return { type: "paragraph", children };
			case "P":
				return { type: "paragraph", children };
			case "BODY":
				return children;
			default:
				return { type: "paragraph", children };
		}
	};

	return deserialize(doc.body);
};

export default SlateEditor;
