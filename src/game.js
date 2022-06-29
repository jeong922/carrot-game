'use strict';

import { Field, ItemType } from './gameField.js';
import * as gameSound from './gameSound.js';

export const Reason = Object.freeze({
  win: 'win',
  lose: 'lose',
  cancel: 'cancel',
});

//Builder Pattern
export class GameBuilder {
  withGameDuration(duration) {
    this.gameDuration = duration;
    return this;
  }

  withCarrotCount(num) {
    this.carrotCount = num;
    return this;
  }
  withBugCount(num) {
    this.bugCount = num;
    return this;
  }
  withRabbitCount(num) {
    this.rabbitCount = num;
    return this;
  }
  build() {
    return new Game(
      this.gameDuration, //
      this.carrotCount,
      this.bugCount,
      this.rabbitCount
    );
  }
}

class Game {
  constructor(gameDuration, carrotCount, bugCount, rabbitCount) {
    this.gameDuration = gameDuration;
    this.carrotCount = carrotCount;
    this.bugCount = bugCount;
    this.rabbitCount = rabbitCount;

    this.start = document.querySelector('.start__bg');
    this.startBtn = document.querySelector('.start__btn');
    this.gameBtn = document.querySelector('.game__btn');
    this.gameScore = document.querySelector('.game__score');
    this.gameTimer = document.querySelector('.game__timer');
    this.gameInfo = document.querySelector('.game__info');

    this.timer = undefined;
    this.score = 0;
    this.gameState = false;
    this.timerState = false;

    this.startBtn.addEventListener('click', () => {
      this.onStart();
      this.gameStart();
    });

    this.gameBtn.addEventListener('click', () => {
      if (this.gameState) {
        this.gameStop(Reason.cancel);
      } else {
        this.gameStart();
      }
    });

    this.gameField = new Field(carrotCount, bugCount, rabbitCount);
    this.gameField.setClickListner(this.onItemClick);
  }

  setGameStopListener(onGameStop) {
    this.onGameStop = onGameStop;
  }

  carrotStart() {
    this.carrotStartBg.style.visibility = 'hidden';
    this.gameState = true;
  }

  gameStart() {
    this.gameState = true;
    this.gameInit();
    this.showStopBtn();
    this.startGameTimer();
    this.showGameInfo();
    gameSound.playBgSound();
  }

  gameStop(reason) {
    this.gameState = false;
    this.stopGameTimer();
    this.hideGameBtn();
    gameSound.stopBGSound();
    this.onGameStop && this.onGameStop(reason);
  }

  onItemClick = (item) => {
    if (!this.gameState) {
      return;
    }
    if (item === ItemType.carrot) {
      this.score++;
      this.updateScore();
      if (this.score === this.carrotCount) {
        this.gameStop(Reason.win);
      }
    } else if (item === ItemType.bug) {
      this.gameStop(Reason.lose);
    } else if (item === ItemType.rabbit) {
      const rabbit = Math.floor(this.bugCount / 2);
      this.gameField._addItem('bug', rabbit, 'img/bug.png');
    }
  };

  showStopBtn() {
    const icon = this.gameBtn.querySelector('.fas');
    icon.classList.add('fa-stop');
    icon.classList.remove('fa-play');
    this.gameBtn.style.visibility = 'visible';
  }

  hideGameBtn() {
    this.gameBtn.style.visibility = 'hidden';
  }

  showGameInfo() {
    this.gameInfo.style.visibility = 'visible';
    this.gameBtn.style.visibility = 'visible';
  }

  gameInit() {
    this.score = 0;
    this.gameScore.innerText = this.carrotCount;
    this.gameField.gameInit();
  }

  updateScore() {
    this.gameScore.innerText = this.carrotCount - this.score;
  }

  onStart() {
    this.start.style.visibility = 'hidden';
    this.gameState = true;
  }

  startGameTimer() {
    let remainingTime = this.gameDuration;
    this.updateTimer(remainingTime);
    this.timer = setInterval(() => {
      if (remainingTime <= 0) {
        clearInterval(this.timer);
        this.gameStop(
          this.carrotCount === this.score ? Reason.win : Reason.lose
        );
        return;
      } else {
        this.updateTimer(--remainingTime);
      }
    }, 1000);
  }

  stopGameTimer() {
    clearInterval(this.timer);
    this.hideGameBtn();
  }

  updateTimer(time) {
    const min = (Math.floor(time / 60) + '').padStart(2, 0);
    const sec = ((time % 60) + '').padStart(2, 0);
    this.gameTimer.innerText = `${min}:${sec}`;
  }
}
