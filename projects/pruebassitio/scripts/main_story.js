const customName = document.getElementById('customname');
const randomize = document.querySelector('.randomize');
const story = document.querySelector('.story');
const language = document.querySelector('input[name="ukus"]');

let storyText =
  'It was 94 fahrenheit outside, so :insertx: went for a walk. ' +
  'When they got to :inserty:, they stared in horror for a few moments, then :insertz:. ' +
  'Bob saw the whole thing, but was not surprised — :insertx: weighs 300 pounds, and it was a hot day.';
let insertX = ['Willy the Goblin', 'Big Daddy', 'Father Christmas'];
let insertY = ['the soup kitchen', 'Disneyland', 'the White House'];
let insertZ = [
  'spontaneously combusted',
  'melted into a puddle on the sidewalk',
  'turned into a slug and crawled away',
];

function randomValueFromArray(array) {
  const random = Math.floor(Math.random() * array.length);
  return array[random];
}

function createSillyStory() {
  story.setAttribute('style', 'visibility: visible;');
  story.textContent = '';
  let newStoryText = '';
  newStoryText = storyText.replaceAll(
    ':insertx:',
    randomValueFromArray(insertX).toString(),
  );
  newStoryText = newStoryText.replaceAll(
    ':inserty:',
    randomValueFromArray(insertY),
  );
  newStoryText = newStoryText.replaceAll(
    ':insertz:',
    randomValueFromArray(insertZ),
  );
  if (language.checked) {
    let newStoryArray = newStoryText.split(' ');
    var result = '';
    for (var i = 0; i < newStoryArray.length; i++) {
      if (newStoryArray[i] === 'pounds,') {
        var pounds = Number(newStoryArray[i - 1]);
        var stones = Math.round(pounds / 14);
        newStoryArray[i - 1] = stones.toString();
      }
      if (newStoryArray[i] === 'fahrenheit') {
        var fahrenheit = Number(newStoryArray[i - 1]);
        var centigrade = Math.round((fahrenheit - 32) / 1.8);
        newStoryArray[i - 1] = centigrade.toString();
      }
      if (i > 0) result = result + newStoryArray[i - 1] + ' ';
    }
    result = result + newStoryArray[newStoryArray.length - 1];
    newStoryText = result.replaceAll('pounds', 'stones');
    newStoryText = newStoryText.replaceAll('fahrenheit', 'centigrade');
  } else {
    //do nothing
  }
  if (customName.value !== '') {
    newStoryText = newStoryText.replaceAll('Bob', customName.value);
  }

  story.textContent = newStoryText;
}

randomize.onclick = function () {
  createSillyStory();
};
