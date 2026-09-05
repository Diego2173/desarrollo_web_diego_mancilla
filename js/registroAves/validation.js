// regex para los campos a validar 
const regexMap = {
    text: /^[\p{L}]+(?:[  "-][\p{L}]+)*$/u,
    address: /^[a-zA-Z0-9\s.,\-#°ñÑáéíóúÁÉÍÓÚ]+$/u,
};

// función para validar un campo en el cual se puede escribir mediante una expresión regular y restricciones de longitud
const validateField = (value, re, minLength = 0, maxLength = 100) => {

    if (!value) return false;
    
    let trimmed = value.trim();
    let formatValid = re.test(trimmed);

    let lengthValid = trimmed.length >= minLength && trimmed.length <= maxLength;

    return formatValid && lengthValid;
};

// Función para validar que un campo de tipo select no tenga el valor por defecto (placeholder)
const validateType = (type) => {
    if (!type) return false;
    return true
};

const setFieldStyle = (input, isValid) => {
    if (isValid) {
        input.classList.remove("error");
    } else {
        input.classList.add("error");
    }
};

// Función para validar tiempo
function validateTime(timeStr) {
    if (!timeStr) return false;
    
    let timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(timeStr);
}

// Función para validar fecha
const validateDate = (dateStr, timeStr) => {
    if (!dateStr || !validateTime(timeStr)) return false;

    // Combinar fecha y hora
    let dateTime = new Date(`${dateStr}T${timeStr}`);
    
    // Si la fecha no es válida, retornar false
    if (isNaN(dateTime.getTime())) return false;

    // Fecha y hora actuales
    let now = new Date();
    let dateNow = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes());
    
    // Calcular fecha límite -> hace 5 años (a la misma hora)
    let minDate = new Date(dateNow);
    minDate.setFullYear(minDate.getFullYear() - 5);

    return dateTime <= dateNow && dateTime >= minDate;
}

// Función para validar entrada de archivo/os
const validateFile = (files) => {
    if (!files || files.length === 0) return false;

    // Extensiones válidas de archivos
    let extensionValid = [
        "image/jpeg", "image/png", "image/webp",
        "video/mp4", "video/quicktime"
    ];

    // Límite de 20MB por archivo
    let maxSize = 20 * 1024 * 1024;

    // Recorrer lista de archivos para validar cada uno
    for (let i = 0; i < files.length; i++) {

        let file = files[i]
        if (!extensionValid.includes(file.type)) return false;
        if (file.size > maxSize) return false;
    }

    return true;
}


const validateForm = () => {
    // Referencia al formulario
    let form = document.getElementById("formRegistroVoluntario");

    // Referencia a los campos del formulario
    let birdTypeInput    = document.getElementById("select-bird");
    let birdNameInput    = document.getElementById("bird-name");
    let regionInput      = document.getElementById("select-region");
    let comunaInput      = document.getElementById("select-comuna");
    let addressInput     = document.getElementById("address");
    let dateInput        = document.getElementById("date");
    let timeInput        = document.getElementById("time");
    let fileInput        = document.getElementById("file");

    // Obtener referencias a los spans de error
    let birdTypeError    = document.getElementById("select-bird-error");
    let birdNameError    = document.getElementById("bird-name-error");
    let regionError      = document.getElementById("region-error");
    let comunaError      = document.getElementById("comuna-error");
    let addressError     = document.getElementById("address-error");
    let dateError        = document.getElementById("date-error");
    let timeError        = document.getElementById("time-error");
    let fileError        = document.getElementById("file-error");

    let birdTypeValid    = validateType(birdTypeInput.value);
    let birdNameValid    = validateField(birdNameInput.value, regexMap.text, 3, 50);
    let regionValid      = validateType(regionInput.value);
    let comunaValid      = validateType(comunaInput.value);
    let addressValid     = validateField(addressInput.value, regexMap.address, 0, 100);
    let dateValid        = validateDate(dateInput.value, timeInput.value);
    let fileValid        = validateFile(fileInput.value);

    // Hacer visible span de error
    const setInvalidInput = (errorSpan, input, isValid) => {
        if (errorSpan) {
            errorSpan.classList.toggle("visible", !isValid);
        }
        setFieldStyle(input, isValid);
    };

    setInvalidInput(birdTypeError, birdTypeInput, birdTypeValid);
    setInvalidInput(birdNameError, birdNameInput, birdNameValid);
    setInvalidInput(regionError, regionInput, regionValid);
    setInvalidInput(comunaError, comunaInput, comunaValid);
    setInvalidInput(addressError, addressInput, addressValid);
    setInvalidInput(dateError, dateInput, dateValid);
    setInvalidInput(timeError, timeInput, timeValid);
    setInvalidInput(fileError, fileInput, fileValid);


    // Si hay un campo no válido, detener
    const isValid = (birdTypeValid && birdNameValid && regionValid && comunaValid && addressValid && dateValid && fileValid);
    if (!isValid) {
        return;
    } else {
        window.location.href = "../pages/registroExitosoAves.html"   
    };
};

document.getElementById("formRegistroAves").addEventListener("submit", (event) => {
    event.preventDefault();
    validateForm();
});