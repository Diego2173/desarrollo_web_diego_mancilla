const form           = document.getElementById("formComentario");
const lista          = document.getElementById("lista-comentarios");

const nombreInput  = document.getElementById("comentario-nombre");
const textoInput   = document.getElementById("comentario-texto");
const nombreError  = document.getElementById("comentario-nombre-error");
const textoError   = document.getElementById("comentario-texto-error");

// Igual que validate field por el lado del servidor
const validateLength = (value, minLength, maxLength) => {
    const length = value.trim().length;
    return length >= minLength && length <= maxLength;
};

const setError = (span, input, message) => {
    span.textContent = message || "";
    span.classList.toggle("visible", Boolean(message));
    input.classList.toggle("error", Boolean(message));
};

const showErrors = (errores = {}) => {
    setError(nombreError, nombreInput, errores.nombre);
    setError(textoError, textoInput, errores.texto);
};

// --- GET (listar comentario)s ---
const createComentario = (c) => {
    const fecha = document.createElement("span");
    fecha.className = "comentario-fecha";
    fecha.textContent = c.fecha;
 
    const nombre = document.createElement("strong");
    nombre.textContent = c.nombre;
 
    const texto = document.createElement("p");
    texto.className = "comentario-texto";
    texto.textContent = c.texto;
 
    const item = document.createElement("li");
    item.append(fecha, nombre, texto);
    return item;
};
 
const loadComentarios = () => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", form.action);
    xhr.responseType = "json";
    xhr.onload = () => {
        if (xhr.status !== 200) return;
        lista.replaceChildren();
        xhr.response.forEach(c => lista.appendChild(createComentario(c)));
    };
    xhr.send();
};
 
// --- POST (agregar comentario) ---
const postComentario = () => {
    const datos = new URLSearchParams({ nombre: nombreInput.value, texto: textoInput.value });
 
    const xhr = new XMLHttpRequest();
    xhr.open("POST", form.action);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.responseType = "json";
    xhr.onload = () => {
        if (xhr.status === 200) {
            form.reset();
            showErrors();
            loadComentarios();
            return;
        }
        showErrors((xhr.response && xhr.response.errores) || {});
    };
    xhr.send(datos);
};
 
// Validar en el lado del cliente
form.addEventListener("submit", (event) => {
    event.preventDefault();
 
    const errores = {};
    if (!validateLength(nombreInput.value, 3, 50)) {
        errores.nombre = "El nombre debe tener entre 3 y 50 caracteres.";
    }
    if (!validateLength(textoInput.value, 5, 300)) {
        errores.texto = "El comentario debe tener entre 5 y 300 caracteres.";
    }
    showErrors(errores);
 
    if (Object.keys(errores).length === 0) {
        postComentario();
    }
});
 
loadComentarios();