'use strict';

import * as gameSound from './gameSound.js';

export const ItemType = Object.freeze({
  carrot: 'carrot',
  bug: 'bug',
  rabbit: 'rabbit',
});

export class Field {
  constructor(carrotCount, bugCount, rabbitCount) {
    this.carrotCount = carrotCount;
    this.bugCount = bugCount;
    this.rabbitCount = rabbitCount;
    this.itemSize = 80;
    this.gameField = document.querySelector('.game__field');
    this.gameFieldRect = this.gameField.getBoundingClientRect();
    // this.onClick = this.onClick.bind(this);
    // this.gameField.addEventListener('click', (event) => this.onClick(event));
    this.gameField.addEventListener('click', this.onClick);
  }

  gameInit() {
    this.gameField.innerHTML = '';
    this._addItem('carrot', this.carrotCount, 'img/carrot.png');
    this._addItem('bug', this.bugCount, 'img/bug.png');
    this._addItem('rabbit', this.rabbitCount, 'img/rabbit.png');
  }

  setClickListner(onItemClick) {
    this.onItemClick = onItemClick;
  }

  _addItem(className, count, imgPath) {
    const x1 = 0;
    const y1 = 0;
    const x2 = this.gameFieldRect.width - this.itemSize;
    const y2 = this.gameFieldRect.height - this.itemSize;
    for (let i = 0; i < count; i++) {
      const item = document.createElement('img');
      item.setAttribute('class', className);
      item.setAttribute('src', imgPath);
      item.style.position = 'absolute';
      const x = randomNumber(x1, x2);
      const y = randomNumber(y1, y2);
      item.style.left = `${x}px`;
      item.style.top = `${y}px`;
      this.gameField.appendChild(item);
    }
  }

  onClick = (event) => {
    const target = event.target;
    if (target.matches('.carrot')) {
      gameSound.playCarrotSound();
      target.remove();
      this.onItemClick && this.onItemClick(ItemType.carrot);
    } else if (target.matches('.bug')) {
      this.onItemClick && this.onItemClick(ItemType.bug);
    } else if (target.matches('.rabbit')) {
      gameSound.playAlertSound();
      this.onItemClick && this.onItemClick(ItemType.rabbit);
    }
  };
}

function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}
