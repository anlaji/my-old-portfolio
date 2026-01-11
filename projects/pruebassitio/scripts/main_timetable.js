let selectWeather = document.getElementById('weather');
let paraWeather = document.getElementById('weather_hint');
let title = document.querySelector('h1');
let subtitle = document.querySelector('h2');

let selectTheme = document.getElementById('theme');
let html = document.querySelector('html');
let body = document.querySelector('body');
document.body.style.padding = '10px';

function update(bgColor, bodyBgColor, textColor, titleColor) {
  html.style.backgroundColor = bgColor;
  body.style.backgroundColor = bodyBgColor;
  html.style.color = textColor;
  title.style.color = titleColor;
}
/*
theme.onchange = function() {
  ( theme.value === 'dark' ) ? update('black','yellow') : update('#00539F','rgba(0,0,200,0.6)');
}*/

selectTheme.onchange = function () {
  let choice = theme.value;

  switch (choice) {
    case 'dark':
      update('black', '#88390F', '##265C70', '#506B76');
      break;
    case 'light':
      update('#00539F', '#FF9500', 'rgba(0,0,200,0.6)', '#00539F');
      break;
    case 'purple':
      update('purple', '#F5F7D4', '#340933', '#290932');
      break;
    case 'yellow':
      update('#FCCB1A', '#DAD4F7', '#342B09', '#4323CF');
      break;
    case 'psychedelic':
      update('#EA1826', '#3114B2', '#FBC915', '#FDDA18');
      break;
  }
};
var isBirthday = false;
selectWeather.addEventListener('change', setWeather);
function setWeather() {
  let choice = selectWeather.value;

  switch (choice) {
    case 'sunny':
      paraWeather.textContent =
        'It is nice and sunny outside today. Wear shorts! Go to the beach, or the park, and get an ice cream.';
      break;
    case 'rainy':
      paraWeather.textContent =
        "Rain is falling outside; take a rain coat and a brolly, and don't stay out for too long.";
      break;
    case 'snowing':
      paraWeather.textContent =
        'The snow is coming down — it is freezing! Best to stay in with a cup of hot chocolate, or go build a snowman.';
      break;
    case 'overcast':
      paraWeather.textContent =
        "It isn't raining, but the sky is grey and gloomy; it could turn any minute, so take a rain coat just in case.";
      break;
    default:
      paraWeather.textContent = '';
  }
}

let greeting = isBirthday
  ? 'Happy birthday Mrs. Smith — we hope you have a great day!'
  : 'Good morning Mrs. Smith.';

const selectMonth = document.getElementById('calendar');
let paraMonth = document.getElementById('days_month');
let days = 0;
selectMonth.addEventListener('change', setMonth);
function setMonth() {
  let choice = selectMonth.value;
  var month = choice.charAt(0).toUpperCase() + choice.slice(1, 3);
  switch (choice) {
    case 'january':
    case 'march':
    case 'may':
    case 'july':
    case 'august':
    case 'october':
    case 'december':
      paraMonth.textContent = month + '. has 31 days';
      //createCalendar(31,choice);
      break;
    case 'april':
    case 'june':
    case 'september':
    case 'november':
      paraMonth.textContent = month + '. has 30 days';
      //createCalendar(30,choice);
      break;
    case 'february':
      paraMonth.textContent = month + '. has 28/29 days';
      //createCalendar(28,choice);
      break;
    default:
      paraMonth.textContent = '';
  }
}

function createCalendar(days, choice) {
  paraMonth.innerHTML = '';
  for (let i = 1; i <= days; i++) {
    const listItem = document.createElement('li');
    listItem.textContent = i;
    paraMonth.appendChild(listItem);
  }
}

const btnDraw = document.getElementById('drawCanvas');
const btnChangeColor = document.getElementById('changeCanvas');
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

document.addEventListener('DOMContentLoaded', () => {
  canvas.width = body.getBoundingClientRect().width - 30;
  canvas.height = document.documentElement.clientHeight;
});

function random(number) {
  return Math.floor(Math.random() * number);
}
let colorId = 'rgba(255,0,0,0.5)';
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < 100; i++) {
    ctx.beginPath();
    ctx.fillStyle = colorId;
    ctx.arc(
      random(canvas.width),
      random(canvas.height),
      random(50),
      0,
      2 * Math.PI,
    );
    ctx.fill();
  }
}
function random(number) {
  return Math.floor(Math.random() * (number + 1));
}

function changeCircleColor() {
  const rndCol = `rgb(${random(255)}, ${random(255)}, ${random(255)})`;
  colorId = rndCol;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < 100; i++) {
    ctx.beginPath();
    ctx.fillStyle = rndCol;
    ctx.arc(
      random(canvas.width),
      random(canvas.height),
      random(50),
      0,
      2 * Math.PI,
    );
    ctx.fill();
  }
}

btnDraw.addEventListener('click', draw);
btnChangeColor.addEventListener('click', changeCircleColor);

/*
const ctx = document.querySelector('canvas');
for (var i = 0; i < 100; i++) {
  ctx.beginPath();
  ctx.fillStyle = 'rgba(255,0,0,0.5)';
  ctx.arc(random(WIDTH), random(HEIGHT), random(50), 0, 2 * Math.PI);
  ctx.fill();
}*/

var contacts = [
  'Chris:2232322',
  'Sarah:3453456',
  'Bill:7654322',
  'Mary:9998769',
  'Dianne:9384975',
];

let paraContact = document.getElementById('selected_contact');
var inputContact = document.getElementById('search');
var btnSearchContact = document.getElementById('searchContact');

btnSearchContact.addEventListener('click', function () {
  alert('hello');
  var searchName = inputContact.value;
  inputContact.value = '';
  inputContact.focus();
  for (var i = 0; i < contacts.length; i++) {
    var splitContact = contacts[i].split(':');
    if (splitContact[0] === searchName) {
      paraContact.textContent =
        splitContact[0] + "'s number is " + splitContact[1] + '.';
      break;
    } else {
      paraContact.textContent = 'Contact not found.';
    }
  }
});

inputContact.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    btnSearchContact.click();
  }
  //console.log(`You pressed "${event.key}".`);
});
//inputContact.addEventListener('keydown', event => console.log(`You pressed "${event.key}".`));

const closeBtn2 = document.getElementById('closeMsg');
const divMsgBox = document.querySelector('.msgBox');
function displayMessage(msgText, msgType) {
  const body = document.body;
  //panel is the outer container of our message box.
  const panel = document.createElement('div');
  panel.setAttribute('class', 'msgBox');
  body.appendChild(panel);

  const msg = document.createElement('p');
  msg.textContent = msgText;
  panel.appendChild(msg);

  const closeBtn = document.createElement('button');
  closeBtn.textContent = 'x';
  panel.appendChild(closeBtn);

  if (msgType === 'warning') {
    msg.style.backgroundImage = 'url(icons/warning.png)';
    panel.style.backgroundColor = 'red';
  } else if (msgType === 'chat') {
    msg.style.backgroundImage = 'url(icons/chat.png)';
    panel.style.backgroundColor = 'aqua';
  } else {
    msg.style.paddingLeft = '20px';
  }
  closeBtn.addEventListener('click', () => panel.parentNode.removeChild(panel));
}
//closeBtn2.addEventListener('click', displayMessage());
closeBtn2.addEventListener('click', () => divMsgBox.remove());

displayMessage('Woo, this is a different message!');
displayMessage('Your inbox is almost full — delete some mails', 'warning');
displayMessage('Brian: Hi there, how are you today?', 'chat');

function mySandwich(param1, param2, callback) {
  console.log(
    'Started eating my sandwich.\n\nIt has: ' + param1 + ', ' + param2,
  );

  $('#sandwich').animate(
    {
      opacity: 0,
    },
    5000,
    function () {
      console.log('Animation complete!');
    },
  );
}

mySandwich('ham', 'cheese', function () {
  console.log('Finished eating my sandwich.');
});
