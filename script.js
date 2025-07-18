const productosContainer = document.querySelector('.productos-container');
const carritoItems = document.getElementById('carrito-items');
const contador = document.getElementById('contador');
const total = document.getElementById('total');

let carrito = JSON.parse(localStorage.getItem('carrito')) || [];


fetch('https://fakestoreapi.com/products')
  .then(res => res.json())
  .then(data => mostrarProductos(data))
  .catch(err => console.error('Error al cargar productos:', err));

function mostrarProductos(productos) {
  productos.forEach(producto => {
    const card = document.createElement('div');
    card.className = 'product-card';

    card.innerHTML = `
      <img src="${producto.image}" alt="${producto.title}" width="100">
      <h3>${producto.title}</h3>
      <p>$${producto.price}</p>
      <button class="btn-agregar">Agregar</button>
    `;

    const boton = card.querySelector('.btn-agregar');
    boton.addEventListener('click', () => agregarAlCarrito(producto));

    productosContainer.appendChild(card);
  });
  actualizarCarrito();
}


function agregarAlCarrito(producto) {
  const existe = carrito.find(item => item.id === producto.id);
  if (existe) {
    existe.cantidad += 1;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }
  actualizarCarrito();
}

function actualizarCarrito() {
  carritoItems.innerHTML = '';
  let totalCompra = 0;
  let cantidadTotal = 0;

  carrito.forEach(producto => {
    totalCompra += producto.price * producto.cantidad;
    cantidadTotal += producto.cantidad;

    const item = document.createElement('div');
    item.innerHTML = `
      <p><strong>${producto.title}</strong></p>
      <p>
        $${producto.price.toFixed(2)} x 
        <input type="number" min="1" step="1" value="${producto.cantidad}" oninput="cambiarCantidad(${producto.id}, this.value)">
        = $${(producto.price * producto.cantidad).toFixed(2)}
        <button onclick="quitarDelCarrito(${producto.id})">❌</button>
      </p>
    `;
    carritoItems.appendChild(item);
  });

  total.textContent = totalCompra.toFixed(2);
  contador.textContent = cantidadTotal;
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

function cambiarCantidad(id, nuevaCantidad) {
  const producto = carrito.find(p => p.id === id);
  const cantidad = parseInt(nuevaCantidad);

  if (isNaN(cantidad) || cantidad < 1) {
    producto.cantidad = 1;
  } else {
    producto.cantidad = cantidad;
  }

  actualizarCarrito();
}

function quitarDelCarrito(id) {
  carrito = carrito.filter(item => item.id !== id);
  actualizarCarrito();
}

const form = document.querySelector('form');
form?.addEventListener('submit', e => {
  const email = document.getElementById('email').value;
  if (!email.includes('@')) {
    e.preventDefault();
    alert('Por favor ingresa un correo válido.');
  }
});
