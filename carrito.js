// =========================================
// CARRITO DE NATIVA
// =========================================

// Obtener carrito guardado con manejo seguro de errores
let carrito = [];
try {
    carrito = JSON.parse(localStorage.getItem("carrito")) || [];
} catch (error) {
    console.error("Error al cargar el carrito desde localStorage:", error);
    carrito = [];
}

// =========================================
// AGREGAR PRODUCTO
// =========================================

function agregarAlCarrito(nombre, precio, imagen) {
    const productoExistente = carrito.find(
        producto => producto.nombre === nombre
    );

    if (productoExistente) {
        productoExistente.cantidad++;
    } else {
        carrito.push({
            nombre: nombre,
            precio: Number(precio) || 0,
            imagen: imagen,
            cantidad: 1
        });
    }

    guardarCarrito();
    alert(nombre + " fue agregado al carrito 🛒");
}

// =========================================
// GUARDAR CARRITO
// =========================================

function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarContador();
}

// =========================================
// ACTUALIZAR CONTADOR
// =========================================

function actualizarContador() {
    const contador = document.getElementById("cart-count");
    if (!contador) return;

    const cantidadTotal = carrito.reduce(
        (total, producto) => total + producto.cantidad,
        0
    );

    contador.textContent = cantidadTotal;
}

// =========================================
// MOSTRAR CARRITO
// =========================================

function mostrarCarrito() {
    const contenedor = document.getElementById("carrito-items");
    const totalElement = document.getElementById("carrito-total");

    // Si no existen los elementos en el DOM (ej. estamos en otra página), salimos
    if (!contenedor || !totalElement) return;

    // CARRITO VACÍO
    if (carrito.length === 0) {
        contenedor.innerHTML = `
            <div class="carrito-vacio">
                <i class="fas fa-shopping-cart"></i>
                <h3>Tu carrito está vacío</h3>
                <p>Agrega algunos productos de Nativa.</p>
                <a href="index.html" class="btn-carrito">Ver productos</a>
            </div>
        `;
        totalElement.textContent = "$0";
        return;
    }

    // MOSTRAR PRODUCTOS
    let total = 0;
    let htmlProductos = "";

    carrito.forEach((producto, indice) => {
        const subtotal = producto.precio * producto.cantidad;
        total += subtotal;

        htmlProductos += `
            <div class="carrito-producto">
                <img src="${producto.imagen}" alt="${producto.nombre}">
                
                <div class="carrito-info">
                    <h3>${producto.nombre}</h3>
                    <p>Precio: $${producto.precio.toLocaleString("es-CO")}</p>

                    <div class="cantidad">
                        <button onclick="cambiarCantidad(${indice}, -1)" aria-label="Disminuir cantidad">−</button>
                        <span>${producto.cantidad}</span>
                        <button onclick="cambiarCantidad(${indice}, 1)" aria-label="Aumentar cantidad">+</button>
                    </div>

                    <p class="subtotal">
                        Subtotal: $${subtotal.toLocaleString("es-CO")}
                    </p>
                </div>

                <button class="btn-eliminar" onclick="eliminarProducto(${indice})" aria-label="Eliminar producto">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    });

    contenedor.innerHTML = htmlProductos;
    totalElement.textContent = "$" + total.toLocaleString("es-CO");
}

// =========================================
// CAMBIAR CANTIDAD
// =========================================

function cambiarCantidad(indice, cambio) {
    if (!carrito[indice]) return;

    carrito[indice].cantidad += cambio;

    // Si llega a cero o menos, eliminar producto
    if (carrito[indice].cantidad <= 0) {
        carrito.splice(indice, 1);
    }

    guardarCarrito();
    mostrarCarrito();
}

// =========================================
// ELIMINAR PRODUCTO
// =========================================

function eliminarProducto(indice) {
    if (!carrito[indice]) return;

    carrito.splice(indice, 1);
    guardarCarrito();
    mostrarCarrito();
}

// =========================================
// VACIAR CARRITO
// =========================================

function vaciarCarrito() {
    if (carrito.length === 0) return;

    const confirmar = confirm("¿Seguro que quieres vaciar el carrito?");
    if (confirmar) {
        carrito = [];
        guardarCarrito();
        mostrarCarrito();
    }
}

// =========================================
// COMPRAR
// =========================================

function comprar() {
    if (carrito.length === 0) {
        alert("Tu carrito está vacío.");
        return;
    }

    alert(
        "¡Gracias por tu compra en Nativa! 🌿\n\n" +
        "Puedes continuar con el proceso de compra."
    );
}

// =========================================
// INICIALIZACIÓN
// =========================================

document.addEventListener("DOMContentLoaded", () => {
    actualizarContador();
    mostrarCarrito();
});