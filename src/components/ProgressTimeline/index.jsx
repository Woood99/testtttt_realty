import React, { useEffect, useRef, useState } from "react";

import styles from "./ProgressTimeline.module.scss";

const ProgressTimeline = ({ stages = [], lastTitle = "", className, onComplete, hideBarOnComplete = true }) => {
	const segments = stages.length;
	const segmentPercent = segments > 0 ? 100 / segments : 100;

	const [currentStage, setCurrentStage] = useState(0);
	const [progress, setProgress] = useState(0);
	const [finished, setFinished] = useState(false);

	const rafRef = useRef(null);
	const stageStartRef = useRef(null);
	const completedCalledRef = useRef(false);

	const currentTitle = currentStage < stages.length ? stages[currentStage]?.title || "" : lastTitle;

	useEffect(() => {
		if (!stages || stages.length === 0) {
			setProgress(0);
			return;
		}
		if (currentStage >= stages.length) {
			setProgress(100);
			return;
		}

		const stageTime = Math.max(0, stages[currentStage].time || 0);
		const startPercent = currentStage * segmentPercent;
		const endPercent = startPercent + segmentPercent;

		if (stageTime === 0) {
			setProgress(endPercent);
			setTimeout(() => setCurrentStage(s => s + 1), 0);
			return;
		}

		stageStartRef.current = performance.now();

		const step = now => {
			const elapsed = now - stageStartRef.current;
			const t = Math.min(elapsed / stageTime, 1);
			const newPercent = startPercent + t * segmentPercent;
			setProgress(newPercent);

			if (t < 1) {
				rafRef.current = requestAnimationFrame(step);
			} else {
				setProgress(endPercent);
				setTimeout(() => setCurrentStage(s => s + 1), 16);
			}
		};

		rafRef.current = requestAnimationFrame(step);

		return () => {
			if (rafRef.current) {
				cancelAnimationFrame(rafRef.current);
				rafRef.current = null;
			}
		};
	}, [currentStage, stages, segmentPercent]);

	useEffect(() => {
		if (!stages) return;
		if (currentStage >= stages.length && !completedCalledRef.current) {
			completedCalledRef.current = true;
			setFinished(true);
			setProgress(100);
			onComplete?.();
		}
	}, [currentStage, stages, onComplete]);

	return (
		<div className={className}>
			<div className={styles.centerTitle} aria-live='polite'>
				{currentTitle}
			</div>

			{!(finished && hideBarOnComplete) && (
				<div className={styles.progressBar} aria-hidden>
					<div className={styles.progress} style={{ width: `${progress}%` }} data-progress={progress.toFixed(1)} />
				</div>
			)}
		</div>
	);
};

export default ProgressTimeline;
