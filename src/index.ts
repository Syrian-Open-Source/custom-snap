import { EasingPreset, EASINGS } from './easings';
import { CustomSnapProps, onEventCallback, ScrollDirection } from './types';
import { ScrollUtils } from './utils';

export class CustomSnap {
	private container;
	private isRegistered = false;
	private isAnimating = false;
	private lastScrollPosition = 0;
	private currentSectionIndex = 0;

	private snapDuration;
	private easingPreset!: EasingPreset;
	private scrollDirection: ScrollDirection = '';

	private afterSnap: onEventCallback;
	private beforeSnap: onEventCallback;

	private scrollUtils: ScrollUtils;

	constructor({
		containerID,
		hideScrollbar = false,
		normalScrollElementIDs = [],
		snapDuration = 1000,
		easingPreset = 'easeInOutQuad',
		afterSnap = () => {},
		beforeSnap = () => {},
	}: CustomSnapProps) {
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
		let direction: ScrollDirection = '';
		if (window.scrollY >= this.lastScrollPosition) {
			direction = 'top-to-bottom';
		} else if (window.scrollY < this.lastScrollPosition) {
			direction = 'bottom-to-top';
		}

		this.scrollDirection = direction;
	}

	public setEasingPreset(easingPreset: EasingPreset): void {
		if (!EASINGS.hasOwnProperty(easingPreset)) {
			console.error(
				`Custom Snap: Easing preset ${easingPreset} is invalid. Falling back to the default preset.`
			);

			this.easingPreset = 'easeInOutQuad';
		} else {
			this.easingPreset = easingPreset;
		}
	}

	public setSnapDuration(duration: number = 1000) {
		this.snapDuration = duration;
	}

	public getScrollDirection(): ScrollDirection {
		return this.scrollDirection;
	}

	public hideScrollbar(): void {
		this.scrollUtils.hideScrollbar();
	}

	public showScrollbar(): void {
		this.scrollUtils.showScrollbar();
	}

	public onScroll(): void {
		this.calculateScrollDirection();
		this.lastScrollPosition = window.scrollY;

		if (this.isAnimating) return;

		// Normal scrolling
		if (this.scrollUtils.isSectionNormal(this.currentSectionIndex)) {
			const normalSection = this.scrollUtils.getSectionByIndex(
				this.currentSectionIndex
			);

			const isWindowTouchingWithNextSection =
				window.scrollY +
					window.innerHeight -
					(normalSection!.offsetTop + normalSection!.offsetHeight) >
				2;

			const isWindowIntersectingWithPreviousSection =
				window.scrollY - normalSection!.offsetTop < -2;

			if (
				isWindowTouchingWithNextSection &&
				this.scrollDirection == 'top-to-bottom' &&
				this.scrollUtils.canScrollToBottom(this.currentSectionIndex)
			) {
				this.scrollToSectionByIndex(
					this.currentSectionIndex + 1,
					this.snapDuration
				);
			} else if (
				isWindowIntersectingWithPreviousSection &&
				this.scrollDirection == 'bottom-to-top' &&
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
			this.scrollDirection == 'top-to-bottom' &&
			this.scrollUtils.canScrollToBottom(this.currentSectionIndex)
		) {
			this.scrollToSectionByIndex(
				this.currentSectionIndex + 1,
				this.snapDuration
			);
		} else if (
			this.scrollDirection == 'bottom-to-top' &&
			this.scrollUtils.canScrollToTop(this.currentSectionIndex)
		) {
			this.scrollToSectionByIndex(
				this.currentSectionIndex - 1,
				this.snapDuration
			);
		}
	}

	public scrollToSectionByIndex(index: number, duration = 1000) {
		this.beforeSnap(
			this.currentSectionIndex,
			this.scrollUtils.getSectionByIndex(this.currentSectionIndex)
		);

		this.currentSectionIndex = index;
		const section = this.scrollUtils.getSectionByIndex(index);
		const top = section!.offsetTop;

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

	public register(): void {
		if (this.isRegistered) {
			throw new Error(
				'CustomSnap: Scroll event listener is already registered.'
			);
		}

		this.isRegistered = true;
		this.scrollToSectionByIndex(0);
		window.addEventListener('scroll', this.onScroll);
	}

	public unregister(): void {
		if (!this.isRegistered) {
			throw new Error(
				'CustomSnap: Trying to unregister an event listener that is already unregistered.'
			);
		}
		this.isRegistered = false;
		window.removeEventListener('scroll', this.onScroll);
	}
}
