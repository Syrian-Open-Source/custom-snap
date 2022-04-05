import { EasingPreset, EASINGS } from "./easings";

export class ScrollUtils {
	private container;
	private normalScrollElementIDs;
	private sections: string[];

	constructor(container: HTMLElement, normalScrollElementIDs: string[]) {
		this.container = container;
		this.normalScrollElementIDs = normalScrollElementIDs;
		this.sections = this.getContainerChildrenIDs();

		this.appendScrollbarStyles();
	}

	private appendScrollbarStyles() {
		const style = document.createElement("style");
		style.innerHTML = `
			.custom-snap--no-scrollbar {
				-ms-overflow-style: none;
				scrollbar-width: none;  
			}

			.custom-snap--no-scrollbar::webkit-scrollbar {
				display: none;
			}
		`;

		document.head.appendChild(style);
	}

	private getContainerChildrenIDs(): string[] {
		return Array.from(this.container.children).map((child) => child.id);
	}

	private preventDefault(e: any) {
		e = e || window.event;
		if (e.preventDefault) {
			e.preventDefault();
		}
		return (e.returnValue = false);
	}

	public showScrollbar(): void {
		document.documentElement.classList.remove("custom-snap--no-scrollbar");
		document.body.classList.remove("custom-snap--no-scrollbar");
	}

	public hideScrollbar(): void {
		document.documentElement.classList.add("custom-snap--no-scrollbar");
		document.body.classList.add("custom-snap--no-scrollbar");
	}

	public isSectionNormal(index: number): boolean {
		return this.normalScrollElementIDs.includes(this.sections[index]);
	}

	public canScrollToBottom(currentSectionIndex: number): boolean {
		return currentSectionIndex < this.sections.length - 1;
	}

	public canScrollToTop(currentSectionIndex: number): boolean {
		return currentSectionIndex >= 1;
	}

	public getSectionByIndex(index: number): HTMLElement | null {
		return document.getElementById(this.sections[index]);
	}

	public disableScroll() {
		window.addEventListener("DOMMouseScroll", this.preventDefault, false);
		window.onwheel = this.preventDefault;
		window.ontouchmove = this.preventDefault;
	}

	public enableScroll() {
		window.removeEventListener(
			"DOMMouseScroll",
			this.preventDefault,
			false
		);
		window.onwheel = null;
		window.ontouchmove = null;
		return (document.onkeydown = null);
	}

	public scrollTo(to: number, duration = 1000, easing: EasingPreset) {
		const startingPosition = window.scrollY;
		const destinationPosition = to - startingPosition;

		const startTime = performance.now();

		return new Promise((resolve) => {
			const animateScroll = (timestamp: DOMHighResTimeStamp) => {
				const elapsedTime = timestamp - startTime;
				const animationProgress = EASINGS[easing](
					elapsedTime,
					startingPosition,
					destinationPosition,
					duration
				);

				document.documentElement.scrollTop = animationProgress;
				document.body.scrollTop = animationProgress;

				if (elapsedTime < duration) {
					requestAnimationFrame(animateScroll);
				} else if (window.scrollY < to) {
					/**
					 * Sometimes, window.scrollY is not exactly equal to the value
					 * of the `to` parameter -- there are off by 1 pixel errors that cause
					 * infinite bouncing between sections.
					 *
					 * I guess it's caused by the easing functions or the
					 * `elapsedTime < duration` branch.
					 *
					 * It's important for the window.scrollY to be equal to `to` in
					 * order to prevent errors in determining the scrollDirection
					 *
					 */
					window.scrollBy(0, to - window.scrollY);
					resolve(undefined);
				} else {
					resolve(undefined);
				}
			};

			requestAnimationFrame(animateScroll);
		});
	}
}
