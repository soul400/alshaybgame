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

const welcomeSound = new Howl({
  src: ["https://assets.mixkit.co/sfx/preview/mixkit-magic-confirmation-tone-2305.mp3"],
  volume: 0.5,
});

const cardClickSound = new Howl({
  src: ["https://assets.mixkit.co/sfx/preview/mixkit-select-click-1109.mp3"],
  volume: 0.4,
});

const correctAnswerSound = new Howl({
  src: ["https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3"],
  volume: 0.5,
});

export function playTimerEndSound() {
  timerEndSound.play();
}

export function playConfettiSound() {
  confettiSound.play();
}

export function playWelcomeSound() {
  welcomeSound.play();
}

export function playCardClickSound() {
  cardClickSound.play();
}

export function playCorrectAnswerSound() {
  correctAnswerSound.play();
}
