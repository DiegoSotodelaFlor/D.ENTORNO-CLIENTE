
// =====================================================================
// EJERCICIOS · Tienda DAW con carrito
// =====================================================================

// ---------------------------------------------------------------------
// DADO: la clase Producto y el catálogo
// ---------------------------------------------------------------------

class Producto {
  constructor(id, nombre, precio, stock, icono) {
    this.id = id;
    this.nombre = nombre;
    this.precio = precio;
    this.stock = stock;
    this.icono = icono;
  }

  conIVA() {
    return this.precio * 1.21;
  }

  html() {
    return "<div class='producto'>" +
      "<span class='icono'>" + this.icono + "</span>" +
      "<h3>" + this.nombre + "</h3>" +
      "<span class='precio'>" + this.conIVA().toFixed(2) + " €</span>" +
      "<span class='stock'>Quedan " + this.stock + " unidades</span>" +
      "<button onclick='comprar(" + this.id + ")'>Añadir al carrito</button>" +
      "</div>";
  }
}

const productos = [
  new Producto(1, "Ratón inalámbrico", 19.90, 5, "🖱️"),
  new Producto(2, "Teclado mecánico", 49.90, 3, "⌨️"),
  new Producto(3, "Auriculares", 29.90, 4, "🎧"),
  new Producto(4, "Memoria USB 64 GB", 9.90, 10, "💾"),
  new Producto(5, "Webcam HD", 34.90, 2, "📷"),
  new Producto(6, "Alfombrilla XL", 12.50, 6, "🟩")
];

function pintarCatalogo() {
  let html = "";

  for (let i = 0; i < productos.length; i++) {
    html += productos[i].html();
  }

  document.getElementById("catalogo").innerHTML = html;
}

function buscarProducto(id) {
  for (let i = 0; i < productos.length; i++) {
    if (productos[i].id === id) return productos[i];
  }

  return null;
}

// Muestra un aviso que se borra solo a los 3 segundos

function aviso(texto) {
  document.getElementById("aviso").textContent = texto;

  setTimeout(() => {
    document.getElementById("aviso").textContent = "";
  }, 3000);
}

// ---------------------------------------------------------------------
// EJERCICIO 1 · Clase LineaCarrito
// ---------------------------------------------------------------------

class LineaCarrito {
  constructor(producto, cantidad) {
    this.producto = producto;
    this.cantidad = cantidad || 1;
  }

  subtotal() {
    return this.producto.conIVA() * this.cantidad;
  }

  html() {
    return "<div class='linea'>" +
      "<span class='icono'>" + this.producto.icono + "</span>" +
      "<span class='nombre'>" + this.producto.nombre + "</span>" +
      "<span class='cantidad'>x" + this.cantidad + "</span>" +
      "<span class='subtotal'>" + this.subtotal().toFixed(2) + " €</span>" +
      "<button onclick='quitar(" + this.producto.id + ")'>✕</button>" +
      "</div>";
  }
}

// ---------------------------------------------------------------------
// EJERCICIOS 2, 3 Y 4 · Objeto carrito
// ---------------------------------------------------------------------

const carrito = {
  lineas: [],
  descuento: 0,

  // EJERCICIO 2 · Buscar una línea por el id del producto

  buscarLinea(id) {
    for (let i = 0; i < this.lineas.length; i++) {
      if (this.lineas[i].producto.id === id) {
        return this.lineas[i];
      }
    }

    return null;
  },

  // EJERCICIO 2 · Agregar productos al carrito

  agregar(producto) {
    let linea = this.buscarLinea(producto.id);

    if (linea !== null) {
      if (linea.cantidad >= producto.stock) {
        return false;
      }

      linea.cantidad++;
    } else {
      this.lineas.push(new LineaCarrito(producto, 1));
    }

    return true;
  },

  // EJERCICIO 3 · Quitar una línea del carrito

  quitar(id) {
    for (let i = 0; i < this.lineas.length; i++) {
      if (this.lineas[i].producto.id === id) {
        this.lineas.splice(i, 1);
        break;
      }
    }
  },

  // EJERCICIO 3 · Vaciar el carrito

  vaciar() {
    this.lineas = [];
    this.descuento = 0;
  },

  // EJERCICIO 3 · Calcular unidades

  unidades() {
    let total = 0;

    for (let i = 0; i < this.lineas.length; i++) {
      total += this.lineas[i].cantidad;
    }

    return total;
  },

  // EJERCICIO 3 · Calcular total

  total() {
    let total = 0;

    for (let i = 0; i < this.lineas.length; i++) {
      total += this.lineas[i].subtotal();
    }

    return total;
  },

  // EJERCICIO 4 · Aplicar código de descuento

  aplicarCodigo(codigo) {
    if (codigo.trim().toUpperCase() === "DAW10") {
      this.descuento = 0.10;
      return true;
    }

    return false;
  },

  // Calcular rebaja

  rebaja() {
    return Number((Number(this.total().toFixed(2)) * this.descuento).toFixed(2));
  },

  // Calcular total final

  totalFinal() {
    return Number(this.total().toFixed(2)) - this.rebaja();
  }
};

// ---------------------------------------------------------------------
// EJERCICIO 3 · Pintar carrito
// ---------------------------------------------------------------------

function pintarCarrito() {
  let html = "";

  if (carrito.lineas.length === 0) {
    html = "<p class='vacio'>Tu carrito está vacío</p>";
  } else {
    for (let i = 0; i < carrito.lineas.length; i++) {
      html += carrito.lineas[i].html();
    }
  }

  document.getElementById("carrito-lineas").innerHTML = html;

  let resumen = "";

  resumen += "<p><span>Unidades:</span><strong>" +
    carrito.unidades() + "</strong></p>";

  resumen += "<p><span>Subtotal:</span><strong>" +
    carrito.total().toFixed(2) + " €</strong></p>";

  if (carrito.descuento > 0) {
    resumen += "<p class='descuento'><span>Descuento (10%):</span><strong>-" +
      carrito.rebaja().toFixed(2) + " €</strong></p>";
  }

  resumen += "<p class='total'><span>Total:</span><strong>" +
    carrito.totalFinal().toFixed(2) + " €</strong></p>";

  document.getElementById("carrito-resumen").innerHTML = resumen;

  guardar();
}

// ---------------------------------------------------------------------
// EJERCICIO 4 · Guardar carrito en localStorage
// ---------------------------------------------------------------------

function guardar() {
  let datos = {
    lineas: [],
    descuento: carrito.descuento
  };

  for (let i = 0; i < carrito.lineas.length; i++) {
    datos.lineas.push({
      id: carrito.lineas[i].producto.id,
      cantidad: carrito.lineas[i].cantidad
    });
  }

  localStorage.setItem("carritoDAW", JSON.stringify(datos));
}

// ---------------------------------------------------------------------
// EJERCICIO 4 · Recuperar carrito de localStorage
// ---------------------------------------------------------------------

function cargar() {
  let datos = localStorage.getItem("carritoDAW");

  if (datos !== null) {
    let recuperado = JSON.parse(datos);

    carrito.lineas = [];

    for (let i = 0; i < recuperado.lineas.length; i++) {
      let producto = buscarProducto(recuperado.lineas[i].id);
      let cantidad = recuperado.lineas[i].cantidad;

      if (producto !== null && cantidad > 0 && cantidad <= producto.stock) {
        carrito.lineas.push(new LineaCarrito(producto, cantidad));
      }
    }

    carrito.descuento = recuperado.descuento || 0;
  }
}

// ---------------------------------------------------------------------
// DADO: Eventos
// ---------------------------------------------------------------------

function comprar(id) {
  const producto = buscarProducto(id);

  if (!carrito.agregar(producto)) {
    aviso("No quedan más unidades de " + producto.nombre);
  }

  pintarCarrito();
}

function quitar(id) {
  carrito.quitar(id);
  pintarCarrito();
}

document.getElementById("vaciar").addEventListener("click", () => {
  carrito.vaciar();
  pintarCarrito();
});

document.getElementById("aplicar").addEventListener("click", () => {
  const campo = document.getElementById("codigo");

  if (carrito.descuento > 0) {
    aviso("Ya has aplicado un código de descuento");
  } else if (!carrito.aplicarCodigo(campo.value)) {
    aviso("Código no válido");
  } else {
    campo.value = "";
    pintarCarrito();
  }
});

// ---------------------------------------------------------------------
// AL ABRIR LA PÁGINA
// ---------------------------------------------------------------------

pintarCatalogo();
cargar();
pintarCarrito();
