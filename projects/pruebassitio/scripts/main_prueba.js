const miTitulo = document.querySelector('h1');
miTitulo.textContent = '¡Hola mundo!';
let nombreDeLaVariable = 'Pocoyo';
nombreDeLaVariable = 'Pato';

/*
comentarios de varias
lineas
*/

let helado = 'chocolate';
if (helado === 'chocolate') {
  alert('¡Sí, amo el helado de chocolate!');
} else {
  alert('Awwww, pero mi favorito es el de chocolate...');
}

function multiplica(num1, num2) {
  let resultado = num1 * num2;
  return resultado;
}

alert(multiplica(20, 20));
multiplica(0.5, 3);

document.querySelector('html').onclick = function () {
  alert('¡Ouch! ¡Deja de pincharme!');
};
