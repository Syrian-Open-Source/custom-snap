export const EASINGS = {
	easeInOutQuad(t: number, b: number, c: number, d: number): number {
		t /= d / 2;
		if (t < 1) {
			return (c / 2) * t * t + b;
		}
		t--;
		return (-c / 2) * (t * (t - 2) - 1) + b;
	},

	easeInCubic(t: number, b: number, c: number, d: number): number {
		const tc = (t /= d) * t * t;
		return b + c * tc;
	},

	inOutQuintic(t: number, b: number, c: number, d: number): number {
		const ts = (t /= d) * t,
			tc = ts * t;
		return b + c * (6 * tc * ts + -15 * ts * ts + 10 * tc);
	},
};

export type EasingPreset = "easeInOutQuad" | "easeInCubic" | "inOutQuintic"