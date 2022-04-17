import { CustomSnap } from "../../dist/index.js";

const easingButtons = document.querySelectorAll('input[name="easing_preset"]');
const snapDurationRange = document.querySelector('input[name="snap_duration"]');
const snapDurationLabel = document.querySelector(".snap-duration-label");

const scrollInstance = new CustomSnap({
	containerID: "container",
	normalScrollElementIDs: ["c", "e"],
});

scrollInstance.register();

const onEasingChange = (event) => {
	const newEasingPreset = event.target.value;
	scrollInstance.setEasingPreset(newEasingPreset);
};

easingButtons.forEach((button) =>
	button.addEventListener("change", onEasingChange)
);

const onSnapDurationChange = (event) => {
	const newSnapDuration = event.target.value;
	scrollInstance.setSnapDuration(newSnapDuration);
	snapDurationLabel.textContent = `${newSnapDuration}ms`;
};

snapDurationRange.addEventListener("input", onSnapDurationChange);
