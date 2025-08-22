import cn from "classnames";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Editor, Node, Path, Range, Element as SlateElement, Text, Transforms, createEditor } from "slate";
import { withHistory } from "slate-history";
import { Editable, ReactEditor, Slate, useSlate, withReact } from "slate-react";

import { Maybe, Modal, ModalWrapper, Tooltip } from "@/ui";
import {
	IconAdd,
	IconClearFormatting,
	IconFontBold,
	IconItalic,
	IconLink,
	IconQuote,
	IconSpoiler,
	IconStrikethrough,
	IconUnderline
} from "@/ui/Icons";

import { Button, FieldErrorSpan, Input } from "@/uiForm";

import styles from "../../Chat.module.scss";
import { normalizeUrl } from "@/helpers";

const SlateEditorContext = createContext(null);

const DEFAULT_INITIAL_VALUE = [
	{
		type: "paragraph",
		align: "left",
		children: [{ text: "" }]
	}
];

export const insertTextSafe = (editor, text) => {
	if (!text) return;
	if (editor.children.length === 0) {
		Transforms.insertNodes(editor, {
			type: "paragraph",
			children: [{ text: "" }]
		});
	}

	if (!editor.selection) {
		Transforms.select(editor, Editor.end(editor, []));
	}
	Transforms.insertText(editor, text);
};

export const isEditorEmpty = editor => {
	if (!editor.children || editor.children.length === 0) return true;

	const firstNode = editor.children[0];

	return Editor.isEmpty(editor, firstNode);
};

export const useSlateEditor = options => {
	const renderElement = useCallback(props => <Element {...props} />, []);
	const renderLeaf = useCallback(props => <Leaf {...props} />, []);
	const editor = useMemo(() => withCleanup(withInlines(withHistory(withReact(createEditor())))), []);
	const [isVisibleMenu, setIsVisibleMenu] = useState(false);

	const onSubmitHandler = () => {
		options.send(isEditorEmpty(editor) ? "" : slateToHtml(editor.children));
	};

	return { ...options, editor, renderElement, renderLeaf, onSubmitHandler, isVisibleMenu, setIsVisibleMenu };
};

const withCleanup = editor => {
	const { normalizeNode, deleteBackward, deleteForward, deleteFragment } = editor;

	const removeEmptyWrappersOnce = () => {
		for (const [node, path] of Editor.nodes(editor, {
			at: [],
			match: n => SlateElement.isElement(n) && n.type === "block-quote"
		})) {
			if (Editor.isEmpty(editor, node) || Node.string(node).trim().length === 0) {
				Transforms.unwrapNodes(editor, { at: path });
				return;
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

export const SlateMenu = () => {
	const { isVisibleMenu, linkOpenModal } = useContext(SlateEditorContext);

	return (
		<Tooltip
			mobileDefault
			color='white'
			placement='top-start'
			value={isVisibleMenu || linkOpenModal}
			offset={[0, 8 + 8]}
			classNameTarget='absolute h-[54px] top-0 -left-4'
			classNameContent='p-1.5'
			classNameRoot='!z-[200]'>
			<div className='flex gap-1' data-popper-draft>
				<SlateButton format='bold' label='Жирный' type='mark' />
				<SlateButton format='italic' label='Курсив' type='mark' />
				<SlateButton format='underline' label='Подчёркнутый' type='mark' />
				<SlateButton format='strikethrough' label='Зачёркнутый' type='mark' />
				<SlateButton format='block-quote' label='Цитата' type='block' />

				<SpoilerButton />
				<LinkButton />
				<ClearFormattingButton />
			</div>
		</Tooltip>
	);
};

const SpoilerButton = () => {
	const editor = useSlate();
	const active = isSpoilerActive(editor);

	return (
		<button
			title='Скрытый'
			className={cn("px-1.5 py-1 rounded flex-center-all", active && "!bg-blue")}
			onMouseDown={e => {
				e.preventDefault();
				insertSpoiler(editor);
			}}>
			<IconSpoiler className={cn(active && "!fill-white")} />
		</button>
	);
};

export const setEditorValue = (editor, value) => {
	if (!editor) return;

	const newValue = Array.isArray(value) && value.length ? value : DEFAULT_INITIAL_VALUE;

	Editor.withoutNormalizing(editor, () => {
		editor.children = JSON.parse(JSON.stringify(newValue));
		if (editor.children.length > 0 && editor.children[0].children && editor.children[0].children[0]) {
			editor.selection = {
				anchor: { path: [0, 0], offset: 0 },
				focus: { path: [0, 0], offset: 0 }
			};
		} else {
			editor.selection = null;
		}
	});

	Editor.normalize(editor, { force: true });

	try {
		ReactEditor.focus(editor);
	} catch (e) {}
};

export const SlateEditor = ({ options }) => {
	const { renderElement, renderLeaf, editor, setIsVisibleMenu } = options;
	const [enterCount, setEnterCount] = useState(0);
	const [linkOpenModal, setLinkOpenModal] = useState(false);

	const handleKeyDown = event => {
		if (event.key === "Enter" && !event.shiftKey) {
			event.preventDefault();

			options.onSubmitHandler();
			clearEditor(editor);
			return;
		}

		if (event.key === "Enter" && event.shiftKey) {
			const { selection } = editor;
			if (!selection) return;

			const [blockquoteEntry] = Editor.nodes(editor, {
				match: n => SlateElement.isElement(n) && n.type === "block-quote"
			});

			if (blockquoteEntry) {
				const [blockquoteNode, path] = blockquoteEntry;

				if (Editor.isEmpty(editor, blockquoteNode)) {
					event.preventDefault();

					Transforms.insertNodes(editor, { type: "paragraph", children: [{ text: "" }] }, { at: Path.next(path) });

					Transforms.select(editor, Editor.start(editor, Path.next(path)));
					return;
				}
			}

			setEnterCount(prev => {
				const newCount = prev + 1;

				if (newCount >= 3) {
					const marks = Editor.marks(editor);
					if (marks) {
						Object.keys(marks).forEach(mark => Editor.removeMark(editor, mark));
					}

					if (blockquoteEntry) {
						const [, path] = blockquoteEntry;

						Transforms.insertNodes(editor, { type: "paragraph", children: [{ text: "" }] }, { at: Path.next(path) });

						Transforms.select(editor, Editor.start(editor, Path.next(path)));
					} else {
						Transforms.setNodes(
							editor,
							{ type: "paragraph" },
							{
								match: n => SlateElement.isElement(n) && n.type !== "paragraph",
								split: true
							}
						);

						Transforms.unwrapNodes(editor, {
							match: n => SlateElement.isElement(n) && (n.type === "block-spoiler" || n.type === "link"),
							split: true
						});
					}

					return 0;
				}

				return newCount;
			});
		} else {
			if (enterCount !== 0) setEnterCount(0);
		}
	};

	return (
		<SlateEditorContext.Provider value={{ ...options, linkOpenModal, setLinkOpenModal }}>
			<div className={styles.ChatTextarea}>
				<Slate
					editor={editor}
					initialValue={options.initialValue || DEFAULT_INITIAL_VALUE}
					onChange={value => {
						options.onChange(value);

						const { selection } = editor;
						const hasFocus = ReactEditor.isFocused(editor);
						const hasSelection = !!selection && !Range.isCollapsed(selection);

						setIsVisibleMenu(hasFocus && hasSelection);
					}}>
					<SlateMenu />
					<Editable
						renderElement={renderElement}
						renderLeaf={renderLeaf}
						placeholder='Сообщение...'
						spellCheck
						autoFocus
						className='slate-editor'
						onKeyDown={handleKeyDown}
						onFocus={() => {
							options.handleFocus?.();
							const { selection } = editor;

							if (selection && !Range.isCollapsed(selection) && ReactEditor.isFocused(editor)) {
								setIsVisibleMenu(true);
							}
						}}
						onBlur={() => {
							setIsVisibleMenu(false);
						}}
						onSelect={() => {
							const { selection } = editor;
							const hasFocus = ReactEditor.isFocused(editor);
							const hasSelection = !!selection && !Range.isCollapsed(selection);

							setIsVisibleMenu(hasFocus && hasSelection);
						}}
					/>
				</Slate>
			</div>
		</SlateEditorContext.Provider>
	);
};

export const clearEditor = (editor, initialValue = DEFAULT_INITIAL_VALUE) => {
	if (!editor) return;

	const value = Array.isArray(initialValue) ? initialValue : DEFAULT_INITIAL_VALUE;

	Editor.withoutNormalizing(editor, () => {
		editor.children = JSON.parse(JSON.stringify(value));

		if (editor.children.length > 0 && editor.children[0].children && editor.children[0].children[0]) {
			editor.selection = {
				anchor: { path: [0, 0], offset: 0 },
				focus: { path: [0, 0], offset: 0 }
			};
		} else {
			editor.selection = null;
		}
	});

	Editor.normalize(editor, { force: true });

	try {
		ReactEditor.focus(editor);
	} catch (e) {}
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
	const { linkOpenModal, setLinkOpenModal } = useContext(SlateEditorContext);
	const editor = useSlate();
	const [url, setUrl] = useState("");

	const active = isLinkActive(editor);
	const [error, setError] = useState("");

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

		setLinkOpenModal(false);
		setUrl("");
		setError("");
	};

	return (
		<>
			<button
				title='Добавить ссылку'
				className={cn("px-1.5 py-1 rounded flex-center-all", active && "!bg-blue")}
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
					setLinkOpenModal(true);
				}}>
				<IconLink className={cn(active && "!fill-white")} />
			</button>

			<ModalWrapper condition={linkOpenModal}>
				<Modal
					condition={linkOpenModal}
					set={setLinkOpenModal}
					options={{
						overlayClassNames: "_center-max-content",
						modalClassNames: "!w-[550px]",
						modalContentClassNames: "!px-8 !pb-6"
					}}>
					<div className='flex flex-col gap-2'>
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
							<Button onClick={() => setLinkOpenModal(false)} variant='secondary' size='Small' className=''>
								Отмена
							</Button>
							<Button onClick={handleConfirm} size='Small' className=''>
								Сохранить
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

		const marks = Editor.marks(editor);
		if (marks) {
			Object.keys(marks).forEach(mark => {
				Editor.removeMark(editor, mark);
			});
		}

		Transforms.setNodes(
			editor,
			{ type: "paragraph" },
			{
				match: n => SlateElement.isElement(n) && n.type !== "paragraph",
				split: true
			}
		);

		Transforms.unwrapNodes(editor, {
			match: n => SlateElement.isElement(n) && (n.type === "block-quote" || n.type === "block-spoiler" || n.type === "link"),
			split: true
		});
	};

	return (
		<button className='px-1.5 py-1 rounded flex-center-all' title='Очистить форматирование' onMouseDown={handleClear}>
			<IconClearFormatting />
		</button>
	);
};

const toggleBlock = (editor, format) => {
	const isActive = isBlockActive(editor, format);

	Transforms.unwrapNodes(editor, {
		match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
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
				<span className='draft-spoiler inline-block align-middle' data-draft-spoiler {...attributes}>
					{children}
				</span>
			);

		case "paragraph":
		default:
			return <div {...attributes}>{children}</div>;
	}
};

const Leaf = ({ attributes, children, leaf }) => {
	if (leaf.bold) {
		children = (
			<span data-draft-bold className='font-medium'>
				{children}
			</span>
		);
	}
	if (leaf.italic) {
		children = (
			<span data-draft-italic className='italic'>
				{children}
			</span>
		);
	}
	if (leaf.underline) {
		children = (
			<span data-draft-underline className='underline'>
				{children}
			</span>
		);
	}
	if (leaf.strikethrough) {
		children = (
			<span data-draft-strikethrough className='line-through'>
				{children}
			</span>
		);
	}
	return <span {...attributes}>{children}</span>;
};

const SlateButton = ({ format, label, type }) => {
	const editor = useSlate();
	const isMark = type === "mark";
	const isBlock = type === "block";

	const isActive = isMark ? isMarkActive(editor, format) : isBlock ? isBlockActive(editor, format) : false;

	const iconMap = {
		bold: <IconFontBold className={cn(isActive && "stroke-white")} />,
		italic: <IconItalic className={cn(isActive && "stroke-white")} />,
		underline: <IconUnderline className={cn(isActive && "stroke-white")} />,
		strikethrough: <IconStrikethrough className={cn(isActive && "stroke-white")} />,
		"block-quote": <IconQuote className={cn(isActive && "stroke-white")} />
	};

	return (
		<button
			title={label}
			className={cn("px-1.5 py-1 rounded flex-center-all", isActive && "!bg-blue")}
			onMouseDown={event => {
				event.preventDefault();
				if (isMark) {
					toggleMark(editor, format);
				}
				if (isBlock) {
					toggleBlock(editor, format);
				}
			}}>
			{iconMap[format]}
		</button>
	);
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

const isSpoilerActive = editor => {
	const [spoiler] = Editor.nodes(editor, {
		match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === "block-spoiler"
	});
	return !!spoiler;
};

const getActiveLink = editor => {
	const [linkEntry] = Editor.nodes(editor, {
		match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === "link"
	});
	return linkEntry;
};

const serialize = node => {
	if (Text.isText(node)) {
		let string = node.text;

		if (node.bold) string = `<span data-draft-bold class='font-medium'>${string}</span>`;
		if (node.italic) string = `<span data-draft-italic class='italic'>${string}</span>`;
		if (node.underline) string = `<span data-draft-underline class='underline'>${string}</span>`;
		if (node.strikethrough) string = `<span data-draft-strikethrough class='line-through'>${string}</span>`;

		return string;
	}

	const children = node.children.map(n => serialize(n)).join("");

	switch (node.type) {
		case "block-quote":
			return `<blockquote class='custom-blockquote'>${children}</blockquote>`;
		case "block-spoiler":
			return `<span class='draft-spoiler inline-block align-middle' data-draft-spoiler="true">${children}</span>`;
		case "link":
			return `<a href="${node.url}" class='text-blue' target="_blank" rel="noopener noreferrer">${children}</a>`;
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
			case "A":
				return { type: "link", url: el.getAttribute("href"), children };
			case "BLOCKQUOTE":
				return { type: "block-quote", children };
			case "SPAN":
				if (el.hasAttribute("data-draft-bold")) {
					return children.map(child => ({ ...child, bold: true }));
				}
				if (el.hasAttribute("data-draft-italic")) {
					return children.map(child => ({ ...child, italic: true }));
				}
				if (el.hasAttribute("data-draft-underline")) {
					return children.map(child => ({ ...child, underline: true }));
				}
				if (el.hasAttribute("data-draft-strikethrough")) {
					return children.map(child => ({ ...child, strikethrough: true }));
				}
				if (el.hasAttribute("data-draft-spoiler")) {
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
