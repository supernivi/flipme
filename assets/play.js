// let backgroundMusic = new Audio('./assets/sound/background.ogg');
// backgroundMusic.volume = 0.5;
// backgroundMusic.loop = true;

hideMiddle();
$('#end').hide();

let flipSound = new Audio('./assets/sound/flip.ogg');
let matchSound = new Audio('./assets/sound/match.ogg');
let notMatchSound = new Audio('./assets/sound/notmatch.ogg');

const cards = document.querySelectorAll('.cards');

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let cardLeft = cards.length;
let interval = null;
let flip = 0;
let matches = 0;
let final = {
  flip: 0,
  time: 0,
  name: '',
  email: '',
};

function flipCard() {
  flipSound.play();

  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add('flip');
  ++flip;
  document.getElementById('flip').innerHTML = flip;
  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = this;

    return;
  }
  secondCard = this;
  checkForMatch();
  if (cardLeft === 0) isCompleted();
}

function isFinish() {
  clearInterval(interval);
  setInterval(() => {
    hideStart();
    hideMiddle();
    $('#end').show();
    $('#content').html("Congrats, you've got a photographic memory!");
    document.getElementById('flips').innerHTML = flip;
    document.getElementById('time').innerHTML = final.time;
    $('#hd').hide();
  }, 2000);
}

function checkForMatch() {
  let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;

  if (isMatch) {
    if (firstCard.dataset.framework == 1)
      document.getElementById('artName').innerHTML =
        "Amedeo Modigliani, 'Red-headed Girl in Evening Dress', 1918";
    else if (firstCard.dataset.framework == 2)
      document.getElementById('artName').innerHTML = "Edouard Manet, 'In the Conservatory', 1879";
    else if (firstCard.dataset.framework == 3)
      document.getElementById('artName').innerHTML = "Juan Gris, 'Portrait of Pablo Picasso', 1912";
    else if (firstCard.dataset.framework == 4)
      document.getElementById('artName').innerHTML = "Roy Lichtenstein, 'Hopeless', 1963";
    else if (firstCard.dataset.framework == 5)
      document.getElementById('artName').innerHTML = "Johannes Vermeer, 'The Lacemaker', 1669";
    else if (firstCard.dataset.framework == 6)
      document.getElementById('artName').innerHTML = "Man Ray, 'Portrait of Rose Selavy', 1921";
  }

  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
  matchSound.play();

  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);
  cardLeft -= 2;
  ++matches;
  resetBoard();
}

function unflipCards() {
  lockBoard = true;
  notMatchSound.play();

  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');

    resetBoard();
  }, 1500);
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

function shuffleCards() {
  cards.forEach((card) => {
    let randomPos = Math.floor(Math.random() * 12);
    card.style.order = randomPos;
  });
}

function time() {
  let x = 1;
  interval = setInterval(() => {
    document.getElementById('time-remaining').innerHTML = x + 's';
    final.time = x;
    window.localStorage.setItem('currentTime', x);
    x++;
  }, 1000);
}

function startGame() {
  time();
  shuffleCards();
  // add event for each card can clicked
  cards.forEach((card) => card.addEventListener('click', flipCard));
}

startGame();

// -----------------
// Suraj 29 Jan 2021
// -----------------

// When user finishes game
function isCompleted() {
  clearInterval(interval);
  hideStart();
  showMiddle();
}

function hideStart() {
  $('.time').hide();
  $('#board').hide();
  $('#artName').hide();
  $('#inst').hide();
  hideBanner();
}

function showStart() {
  $('.time').show();
  $('#board').show();
  $('#artName').show();
  $('#inst').show();
  showBanner();
}

function hideMiddle() {
  $('#middle').hide();
}

function showMiddle() {
  $('#middle').show();
}

function hideBanner() {
  $('#banner').hide();
}

function showBanner() {
  $('#banner').show();
}

$('#submitform').click(() => {
  $('#submitform').attr('disabled', true);
  final.name = $('#inputname').val();
  final.email = $('#inputemail').val();
  final.flip = flip;
  $('#submitform').text('Submitting...');
  sendData().then(() => isFinish());
});

async function sendData() {
  var formdata = new FormData();
  formdata.append('email', final.email);
  formdata.append('name', final.name);
  formdata.append('time', final.time);
  formdata.append('flips', final.flip);

  var requestOptions = {
    method: 'POST',
    body: formdata,
    redirect: 'follow',
  };

  try {
    const response = await fetch(
      'https://script.google.com/macros/s/AKfycbyxWu6bC13FcZIb2GEdz38jHKzuVyTm1Pm2K53Ha4W4V53c1dfXjbJv_w/exec',
      requestOptions
    );
    const result_1 = await response.text();
    return console.log(result_1);
  } catch (error) {
    $('#submitform').text('Submit');
    $('#submitform').attr('disabled', false);
    return console.log('error', error);
  }
}
