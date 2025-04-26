import { Howl } from "howler";

// Load sounds
const timerEndSound = new Howl({
  src: ["https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3"],
  volume: 0.7,
});

const confettiSound = new Howl({
  src: ["https://assets.mixkit.co/sfx/preview/mixkit-quick-win-video-game-notification-269.mp3"],
  volume: 0.7,
});

export function playTimerEndSound() {
  timerEndSound.play();
}

export function playConfettiSound() {
  confettiSound.play();
}
