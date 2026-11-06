// =====================================================================
// 1. LA CLASE: el molde de cada incidencia (3.5)
// =====================================================================
class Incidencia {
  constructor(autor, equipo, prioridad, descripcion) {
    this.id = Date.now();          // número único: ms desde 1970 (3.2)
    this.fecha = Date.now();       // cuándo se creó
    this.autor = autor;
    this.equipo = equipo;
    this.prioridad = prioridad;    // "alta", "media" o "baja"
    this.descripcion = descripcion;
    this.resuelta = false;
  }

  // Devuelve el HTML de la tarjeta de esta incidencia
  html() {
    let clases = "incidencia " + this.prioridad;
    if (this.resuelta) clases += " resuelta";
    // RETO 5: si es urgente, añadimos la clase CSS urgente
    if (this.esUrgente()) {
      clases += " urgente";
    }
    const hora = new Date(this.fecha).toLocaleTimeString("es-ES");

    let html = "<article class='" + clases + "'>";
    html += "<h3>" + this.equipo + " · prioridad " + this.prioridad + "</h3>";
    html += "<p>" + this.descripcion + "</p>";
    html += "<p class='meta'>" + this.autor + " · " + hora + "</p>";
    // TODO RETO 3: añade "hace X min" con this.minutos()
    html += "<p class='meta'>Hace " + this.minutos() + " min</p>";
    // TODO RETO 1: si NO está resuelta, añade el botón:
    //   "<button type='button' onclick='resolver(" + this.id + ")'>Resolver</button>"
    if (!this.resuelta) {
      html += "<button type='button' onclick='resolver(" + this.id + ")'>Resolver</button>";
    }

    // RETO 4: añadimos un botón para eliminar la incidencia
    // Este botón aparece tanto en incidencias resueltas como pendientes
    html += "<button type='button' onclick='eliminar(" + this.id + ")'>Eliminar</button>";

    html += "</article>";
    return html;
  }

  // TODO RETO 3: devuelve los minutos que han pasado desde this.fecha
  //   (resta Date.now() - this.fecha y divide entre 60000; redondea con Math.floor)
  minutos() {

    // Restamos la fecha de creación a la fecha actual
    let diferencia = Date.now() - this.fecha;

    // Convertimos los milisegundos a minutos y redondeamos hacia abajo
    return Math.floor(diferencia / 60000);
  }
  // RETO 5: comprueba si una incidencia es urgente
  esUrgente() {

    // Debe tener prioridad alta, no estar resuelta
    // y llevar más de 30 minutos creada
    return this.prioridad === "alta" &&
      !this.resuelta &&
      this.minutos() > 30;
  }
}

// =====================================================================
// 2. LOS DATOS: un array que se guarda en localStorage (3.4)
// =====================================================================
let incidencias = [];

function guardar() {
  // localStorage solo guarda texto: JSON.stringify convierte el array en texto
  localStorage.setItem("incidencias", JSON.stringify(incidencias));
}

function cargar() {
  const texto = localStorage.getItem("incidencias");
  if (texto === null) return;              // la primera vez no hay nada
  const datos = JSON.parse(texto);         // texto -> array de objetos SIN métodos
  // Volvemos a crear cada Incidencia para recuperar el método html()
  for (let i = 0; i < datos.length; i++) {
    const inc = new Incidencia(datos[i].autor, datos[i].equipo,
      datos[i].prioridad, datos[i].descripcion);
    inc.id = datos[i].id;
    inc.fecha = datos[i].fecha;
    inc.resuelta = datos[i].resuelta;
    incidencias.push(inc);
  }
}

// =====================================================================
// 3. PINTAR la lista en la página
// =====================================================================
function pintar() {
  let html = "";
  for (let i = 0; i < incidencias.length; i++) {
    html += incidencias[i].html();
  }
  if (html === "") html = "<p>No hay incidencias.</p>";
  document.getElementById("lista").innerHTML = html;

  document.getElementById("resumen").textContent = "Total: " + incidencias.length;
  // TODO RETO 2: cuenta las que NO están resueltas y muéstralo así:
  //   "Total: 4 · Pendientes: 3"
  let pendientes = 0;

  // Recorremos todas las incidencias
  for (let i = 0; i < incidencias.length; i++) {

    // Si la incidencia no está resuelta, sumamos uno
    if (!incidencias[i].resuelta) {
      pendientes++;
    }
  }
  // RETO 5: contamos las incidencias urgentes
  let urgentes = 0;

  // Recorremos todas las incidencias
  for (let i = 0; i < incidencias.length; i++) {

    // Comprobamos si cada incidencia es urgente
    if (incidencias[i].esUrgente()) {
      urgentes++;
    }
  }

  // Actualizamos el título de la pestaña del navegador
  if (urgentes > 0) {
    document.title = "(" + urgentes + ") Incidencias del aula";
  } else {
    document.title = "Incidencias del aula";
  }

  // Mostramos el total de incidencias y las pendientes
  document.getElementById("resumen").textContent =
    "Total: " + incidencias.length + " · Pendientes: " + pendientes;
}

// Muestra un mensaje que desaparece a los 2 segundos (3.2)
function avisar(texto) {
  document.getElementById("aviso").textContent = texto;
  setTimeout(() => {
    document.getElementById("aviso").textContent = "";
  }, 2000);
}

// =====================================================================
// 4. EVENTOS: qué pasa al pulsar el botón (2.6)
// =====================================================================
document.getElementById("enviar").addEventListener("click", () => {
  const autor = document.getElementById("autor").value.trim();
  const equipo = document.getElementById("equipo").value.trim();
  const prioridad = document.getElementById("prioridad").value;
  const descripcion = document.getElementById("descripcion").value.trim();

  if (autor === "" || equipo === "" || descripcion === "") {
    avisar("Rellena todos los campos.");
    return;
  }

  // Recordamos el nombre 30 días con una cookie (3.3)
  document.cookie = "autor=" + encodeURIComponent(autor) + "; max-age=" + (30 * 24 * 3600);

  incidencias.push(new Incidencia(autor, equipo, prioridad, descripcion));
  guardar();
  pintar();
  avisar("Incidencia guardada ✓");
  document.getElementById("equipo").value = "";
  document.getElementById("descripcion").value = "";
});

// TODO RETO 1: busca con un for la incidencia cuyo id coincide,
//   ponle resuelta = true, y después guardar() y pintar()
function resolver(id) {

  // Recorremos todas las incidencias con un bucle for
  for (let i = 0; i < incidencias.length; i++) {

    // Comprobamos si el id coincide con el de la incidencia
    if (incidencias[i].id === id) {

      // Cambiamos su estado a resuelta
      incidencias[i].resuelta = true;

      // Guardamos los cambios en localStorage
      guardar();

      // Actualizamos la lista de incidencias en pantalla
      pintar();

      // Salimos del bucle porque ya hemos encontrado la incidencia
      return;
    }
  }
}

// RETO 4: elimina una incidencia según su id
function eliminar(id) {

  // Preguntamos al usuario si está seguro de eliminarla
  if (confirm("¿Seguro que quieres eliminar esta incidencia?")) {

    // Recorremos el array buscando la incidencia
    for (let i = 0; i < incidencias.length; i++) {

      // Comprobamos si el id coincide
      if (incidencias[i].id === id) {

        // Eliminamos la incidencia de la posición encontrada
        incidencias.splice(i, 1);

        // Guardamos los cambios en localStorage
        guardar();

        // Actualizamos la lista en pantalla
        pintar();

        // Salimos del bucle
        return;
      }
    }
  }
}

// =====================================================================
// 5. AL ABRIR LA PÁGINA
// =====================================================================
function leerCookie(nombre) {
  const pares = document.cookie.split("; ");
  for (let i = 0; i < pares.length; i++) {
    const partes = pares[i].split("=");
    if (partes[0] === nombre) return decodeURIComponent(partes[1]);
  }
  return null;
}



const autorGuardado = leerCookie("autor");
if (autorGuardado !== null) {
  document.getElementById("autor").value = autorGuardado;
  document.getElementById("saludo").textContent = "Hola de nuevo, " + autorGuardado;
}

// Reloj que se actualiza cada segundo (3.2)
setInterval(() => {
  document.getElementById("reloj").textContent = new Date().toLocaleTimeString("es-ES");
}, 1000);

cargar();
pintar();
// RETO 5: actualizamos las incidencias cada 60 segundos
// Así se comprueba automáticamente si alguna se ha vuelto urgente
setInterval(pintar, 60000);
