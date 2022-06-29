'use strict';

export default class PopUp {
  constructor() {
    this.popUP = document.querySelector('.pop-up');
    this.popUpMassage = document.querySelector('.pop-up__massage');
    this.refresh = document.querySelector('.pop-up__btn');
    this.refresh.addEventListener('click', () => {
      this.onClick && this.onClick();
      this.hide();
    });
  }

  setClickListener(onClick) {
    this.onClick = onClick;
  }

  showWithText(text) {
    this.popUpMassage.innerText = text;
    this.popUP.classList.remove('pop-up--hide');
  }

  hide() {
    this.popUP.classList.add('pop-up--hide');
  }
}
