export type EasingPreset = "easeInOutQuad" | "easeInCubic" | "inOutQuintic";

export interface CustomSnapProps {
	/** ID of the wrapping container */
	containerID: string;

	/** Whether to hide the browser's scrollbar or not */
	hideScrollbar: boolean;

	/** IDs of the sections to which scroll snapping doesn't apply */
	normalScrollElementIDs: string[];

	/** The duration that scroll snapping takes in milliseconds */
	snapDuration: number;

	/** The transition timing function that gets applied to snapping */
	easingPreset: EasingPreset;

	/** A function that gets called after snap scrolling is performed */
	afterSnap: onEventCallback;

	/** A function that gets called just before snap scrolling is performed */
	beforeSnap: onEventCallback;
}

export interface onEventCallback {
	(id?: number, section?: HTMLElement | null): void;
}

export type ScrollDirection = "top-to-bottom" | "bottom-to-top" | "";
