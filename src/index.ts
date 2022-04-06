import { EASINGS } from "./easings";
import {
	CustomSnapProps,
	EasingPreset,
	onEventCallback,
	ScrollDirection,
} from "./types";
import { ScrollUtils } from "./utils";

export class CustomSnap {
	private container;
	private isRegistered = false;
	private isAnimating = false;
	private lastScrollPosition = 0;
	private currentSectionIndex = 0;

	private snapDuration;
	private easingPreset!: EasingPreset;
	private scrollDirection: ScrollDirection = "";

	private afterSnap: onEventCallback;
	private beforeSnap: onEventCallback;

	private scrollUtils: ScrollUtils;

	constructor(customSnapProps: CustomSnapProps) {
		if (customSnapProps == undefined) {
			throw new Error(
				"custom-snap: Please provide a valid options object."
			);
		}
		const {
			containerID,
			hideScrollbar = false,
			normalScrollElementIDs = [],
			snapDuration = 1000,
			easingPreset = "easeInOutQuad",
			afterSnap = () => {},
			beforeSnap = () => {},
		} = customSnapProps;

		this.container = document.getElementById(containerID) as HTMLElement;
		this.snapDuration = snapDuration;
		this.setEasingPreset(easingPreset);

		this.scrollUtils = new ScrollUtils(
			this.container,
			normalScrollElementIDs
		);
		this.afterSnap = afterSnap;
		this.beforeSnap = beforeSnap;
		this.onScroll = this.onScroll.bind(this);

		if (hideScrollbar) {
			this.hideScrollbar();
		}
	}

	private calculateScrollDirection(): void {
		/**
		 * Why `margin`? Because sometimes the values of the last
		 * scroll position and current one might be too close,
		 * and so even if the user did not scroll, the library
		 * would trigger a snap between sections.
		 *
		 * Unless the gap between the two scroll positions is at
		 * least equal to `margin`, I don't want to trigger snapping.
		 *
		 * Note that `margin` is just an arbitrary value that
		 * should be smaller than 5
		 */
		const margin = 3;

		let direction: ScrollDirection = "";
		if (window.scrollY - this.lastScrollPosition > margin) {
			direction = "top-to-bottom";
		} else if (window.scrollY - this.lastScrollPosition < -margin) {
			direction = "bottom-to-top";
		}

		this.scrollDirection = direction;
	}

	private onScroll(): void {
		if (this.isAnimating) return;
		this.calculateScrollDirection();
		this.lastScrollPosition = window.scrollY;

		// Normal scrolling
		if (this.scrollUtils.isSectionNormal(this.currentSectionIndex)) {
			const normalSection = this.scrollUtils.getSectionByIndex(
				this.currentSectionIndex
			) as HTMLElement;

			const isWindowTouchingWithNextSection =
				window.scrollY +
					window.innerHeight -
					(normalSection.offsetTop + normalSection.offsetHeight) >
				2;

			const isWindowIntersectingWithPreviousSection =
				window.scrollY - normalSection.offsetTop < -2;

			if (
				isWindowTouchingWithNextSection &&
				this.scrollDirection == "top-to-bottom" &&
				this.scrollUtils.canScrollToBottom(this.currentSectionIndex)
			) {
				this.scrollToSectionByIndex(
					this.currentSectionIndex + 1,
					this.snapDuration
				);
			} else if (
				isWindowIntersectingWithPreviousSection &&
				this.scrollDirection == "bottom-to-top" &&
				this.scrollUtils.canScrollToTop(this.currentSectionIndex)
			) {
				this.scrollToSectionByIndex(
					this.currentSectionIndex - 1,
					this.snapDuration
				);
			}
			return;
		}

		// Snap scrolling
		if (
			this.scrollDirection == "top-to-bottom" &&
			this.scrollUtils.canScrollToBottom(this.currentSectionIndex)
		) {
			this.scrollToSectionByIndex(
				this.currentSectionIndex + 1,
				this.snapDuration
			);
		} else if (
			this.scrollDirection == "bottom-to-top" &&
			this.scrollUtils.canScrollToTop(this.currentSectionIndex)
		) {
			this.scrollToSectionByIndex(
				this.currentSectionIndex - 1,
				this.snapDuration
			);
		}
	}

	/**
	 * Sets a new easing preset for snap scrolling
	 */
	public setEasingPreset(easingPreset: EasingPreset): void {
		// https://eslint.org/docs/rules/no-prototype-builtins
		if (Object.prototype.hasOwnProperty.call(EASINGS, easingPreset)) {
			console.error(
				`Custom Snap: Easing preset ${easingPreset} is invalid. Falling back to the default preset.`
			);

			this.easingPreset = "easeInOutQuad";
		} else {
			this.easingPreset = easingPreset;
		}
	}

	/**
	 * Sets a new duration for snap scrolling
	 */
	public setSnapDuration(duration = 1000): void {
		this.snapDuration = duration;
	}

	/**
	 * Returns the scroll's direction
	 */
	public getScrollDirection(): ScrollDirection {
		return this.scrollDirection;
	}

	/**
	 * Hides the browser's scrollbar using CSS
	 */
	public hideScrollbar(): void {
		this.scrollUtils.hideScrollbar();
	}

	/**
	 * Shows the browser's scrollbar
	 */
	public showScrollbar(): void {
		this.scrollUtils.showScrollbar();
	}

	/**
	 * Scrolls to a specific section over a period of time.
	 */
	public scrollToSectionByIndex(index: number, duration = 1000): void {
		this.beforeSnap(
			this.currentSectionIndex,
			this.scrollUtils.getSectionByIndex(this.currentSectionIndex)
		);

		this.currentSectionIndex = index;
		const section = this.scrollUtils.getSectionByIndex(
			index
		) as HTMLElement;
		const top = section.offsetTop;

		this.lastScrollPosition = top;

		this.isAnimating = true;
		this.scrollUtils.disableScroll();
		this.scrollUtils.scrollTo(top, duration, this.easingPreset).then(() => {
			this.isAnimating = false;
			this.scrollUtils.enableScroll();
			this.afterSnap(
				this.currentSectionIndex,
				this.scrollUtils.getSectionByIndex(this.currentSectionIndex)
			);
		});
	}

	/**
	 * Registers the snap scroll event listener.
	 * Note that without invoking this function, all scrolling
	 * would be considered normal.
	 */
	public register(): void {
		if (this.isRegistered) {
			throw new Error(
				"custom-snap: Scroll event listener is already registered."
			);
		}

		this.isRegistered = true;
		this.scrollToSectionByIndex(0);
		window.addEventListener("scroll", this.onScroll);
	}

	/**
	 * Removes the currently bound scroll event listener.
	 * After unregistering, all scrolling would be considered normal.
	 */
	public unregister(): void {
		if (!this.isRegistered) {
			throw new Error(
				"custom-snap: Trying to unregister an event listener that is already unregistered."
			);
		}
		this.isRegistered = false;
		window.removeEventListener("scroll", this.onScroll);
	}
}
