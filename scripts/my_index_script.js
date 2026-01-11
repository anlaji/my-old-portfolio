let selectTheme = document.getElementById('theme');
let html = document.querySelector('html');
let body = document.querySelector('body');
let title = document.querySelector('title');

function update(bgColor, bodyBgColor, textColor, titleColor) {
  html.style.backgroundColor = bgColor;
  body.style.backgroundColor = bgColor;
  document.querySelector('main').style.backgroundColor = bodyBgColor;
  document.querySelector('header').style.backgroundColor = bodyBgColor;
  document.querySelector('nav').style.backgroundColor = bodyBgColor;
  document.querySelector('article').style.backgroundColor = bodyBgColor;
  document.querySelector('aside').style.backgroundColor = bodyBgColor;
  // document.querySelector('footer').style.backgroundColor = bodyBgColor;
  //document.querySelector('section').style.backgroundColor = bodyBgColor;
  html.style.color = textColor;
  title.style.color = titleColor;
}
/*
theme.onchange = function() {
  ( theme.value === 'dark' ) ? update('black','yellow') : update('#00539F','rgba(0,0,200,0.6)');
}*/
/*
selectTheme.onchange = function(){
  let choice = selectTheme.value;

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
      update('#FCCB1A', '#DAD4F7','#342B09', '#4323CF');
      break;
    case 'psychedelic':
      update('lightgreen', 'pink', '#FBC915', '#FDDA18');
      break;
  }

}*/
