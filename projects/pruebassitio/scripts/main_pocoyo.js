let miImage = document.querySelector('main img');
console.log(miImage);
miImage.onclick = function () {
  let miSrc = miImage.getAttribute('src');
  if (miSrc === 'images/dibujos-de-pocoyo-800x565-259230580.jpeg') {
    miImage.setAttribute(
      'src',
      'images/0993611e8381f2fdb4072b4eb24a0ad2-788633802.png',
    );
  } else {
    miImage.setAttribute(
      'src',
      'images/dibujos-de-pocoyo-800x565-259230580.jpeg',
    );
  }
};

let miBoton = document.querySelector('button');
let miTitulo = document.querySelector('h1');
function estableceNombreUsuario() {
  let miNombre = prompt('Por favor, ingresa tu nombre ahora.');
  if (!miNombre) {
    estableceNombreUsuario();
  } else {
    localStorage.setItem('nombre', miNombre);
    alert('¡Hola ' + miNombre + ', encantado de verte!');
    miTitulo.innerHTML = 'Pocoyo es genial, ' + miNombre;
  }
}

if (!localStorage.getItem('nombre')) {
  estableceNombreUsuario();
} else {
  let nombreAlmacenado = localStorage.getItem('nombre');
  miTitulo.textContent = 'Pocoyo es genial,' + nombreAlmacenado;
}
miBoton.onclick = function () {
  estableceNombreUsuario();
};

const para = document.querySelector('p.myquote');
para.addEventListener('click', updateName);

function updateName() {
  let name = prompt('Enter a new name');
  para.textContent = 'Usuario: ' + name;
}
