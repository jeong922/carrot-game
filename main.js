'use stric';

const gameField = document.querySelector('.game__field');
const gameFieldRect = gameField.getBoundingClientRect();
const start = document.querySelector('.start__bg');
const startBtn = document.querySelector('.start__btn');
const gameBtn = document.querySelector('.game__btn');
const gameScore = document.querySelector('.game__score');
const gameTimer = document.querySelector('.game__timer');
const gameInfo = document.querySelector('.game__info');
const popUP = document.querySelector('.pop-up');
const popUpMassage = document.querySelector('.pop-up__massage');
const refresh = document.querySelector('.pop-up__btn');

const ITEM_SIZE = 80;
const CARROT_COUNT = 20;
const BUG_COUNT = 10;
const RABBIT_COUNT = 2;
const GAME_TIME = 10;

const carrotSound = new Audio('./sound/carrot_pull.mp3');
const bugSound = new Audio('./sound/bug_pull.mp3');
const alertSound = new Audio('./sound/alert.wav');
const bgSound = new Audio('./sound/bg.mp3');
const winSound = new Audio('./sound/game_win.mp3');

let timer = undefined;
let score = 0;
let gameState = false;
let timerState = false;

gameField.addEventListener('click', onFieldClick);

startBtn.addEventListener('click', () => {
  onStart();
  gameStart();
});

gameBtn.addEventListener('click', () => {
  if (gameState) {
    gameStop();
  } else {
    gameStart();
  }
});

refresh.addEventListener('click', () => {
  gameStart();
  hidePopUp();
});

function gameStart() {
  gameState = true;
  gameInit();
  showStopBtn();
  startGameTimer();
  showGameInfo();
  playSound(bgSound);
}

function gameStop() {
  gameState = false;
  stopGameTimer();
  hideGameBtn();
  showPopUP('REPALY❓');
  playSound(alertSound);
  stopSound(bgSound);
}

function finishGame(win) {
  gameState = false;
  hideGameBtn();
  win ? playSound(winSound) : playSound(bugSound);
  stopGameTimer();
  stopSound(bgSound);
  showPopUP(win ? 'YOU WON 😊' : 'YOU LOST 😭');
}

function showStopBtn() {
  const icon = gameBtn.querySelector('.fas');
  icon.classList.add('fa-stop');
  icon.classList.remove('fa-play');
  gameBtn.style.visibility = 'visible';
}

function hideGameBtn() {
  gameBtn.style.visibility = 'hidden';
}

// 게임 정보 보여주는 함수
function showGameInfo() {
  gameInfo.style.visibility = 'visible';
  gameBtn.style.visibility = 'visible';
}

// 팝업 보여주는 함수
function showPopUP(text) {
  popUpMassage.innerText = text;
  popUP.classList.remove('pop-up--hide');
}

function hidePopUp() {
  popUP.classList.add('pop-up--hide');
}

// 게임 시작 버튼 누르면 동작하는 게임 초기화 함수
function gameInit() {
  score = 0;
  gameField.innerHTML = '';
  gameScore.innerText = CARROT_COUNT;
  addItem('carrot', CARROT_COUNT, 'img/carrot.png');
  addItem('bug', BUG_COUNT, 'img/bug.png');
  addItem('rabbit', RABBIT_COUNT, 'img/rabbit.png');
}

function onFieldClick(event) {
  if (!gameState) {
    return;
  }
  const target = event.target;
  if (target.matches('.carrot')) {
    target.remove();
    score++;
    playSound(carrotSound);
    updateScore();
    if (score === CARROT_COUNT) {
      finishGame(true);
    }
  } else if (target.matches('.bug')) {
    finishGame(false);
  } else if (target.matches('.rabbit')) {
    const bugCount = Math.floor(BUG_COUNT / 2);
    playSound(alertSound);
    addItem('bug', bugCount, 'img/bug.png');
  }
}

function playSound(sound) {
  sound.currentTime = 0;
  sound.play();
}

function stopSound(sound) {
  sound.pause();
}

function updateScore() {
  gameScore.innerText = CARROT_COUNT - score;
}

// 당근 벌레 추가 하는 함수
function addItem(className, count, imgPath) {
  const x1 = 0;
  const y1 = 0;
  const x2 = gameFieldRect.width - ITEM_SIZE;
  const y2 = gameFieldRect.height - ITEM_SIZE;
  for (let i = 0; i < count; i++) {
    const item = document.createElement('img');
    item.setAttribute('class', className);
    item.setAttribute('src', imgPath);
    item.style.position = 'absolute';
    const x = randomNumber(x1, x2);
    const y = randomNumber(y1, y2);
    item.style.left = `${x}px`;
    item.style.top = `${y}px`;
    gameField.appendChild(item);
  }
}

function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

function onStart() {
  start.style.visibility = 'hidden';
  gameState = true;
}

function startGameTimer() {
  let remainingTime = GAME_TIME;
  updateTimer(GAME_TIME);
  timer = setInterval(() => {
    if (remainingTime <= 0) {
      clearInterval(timer);
      finishGame(CARROT_COUNT === score);
      return;
    } else {
      updateTimer(--remainingTime);
    }
  }, 1000);
}

// 타이머 정지 함수
function stopGameTimer() {
  clearInterval(timer);
  hideGameBtn();
}

// 타이머 업데이트 함수
function updateTimer(time) {
  const min = (Math.floor(time / 60) + '').padStart(2, 0);
  const sec = ((time % 60) + '').padStart(2, 0);
  gameTimer.innerText = `${min}:${sec}`;
}
