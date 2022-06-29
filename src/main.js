'use strict';

import PopUp from './gamePopup.js';
import * as gameSound from './gameSound.js';
import { GameBuilder, Reason } from './game.js';

const gameFinishBanner = new PopUp();
const game = new GameBuilder()
  .withGameDuration(10)
  .withCarrotCount(15)
  .withBugCount(10)
  .withRabbitCount(3)
  .build();

game.setGameStopListener((reason) => {
  let message;
  switch (reason) {
    case Reason.cancel:
      message = 'REPALY❓';
      gameSound.playAlertSound();
      break;
    case Reason.win:
      message = 'YOU WON😊';
      gameSound.playWinSound();
      break;
    case Reason.lose:
      message = 'YOU LOST😭';
      gameSound.playBugSound();
      break;
    default:
      throw new Error('not valid reason');
  }
  gameFinishBanner.showWithText(message);
});

gameFinishBanner.setClickListener(() => {
  game.gameStart();
});
