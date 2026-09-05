// regex para los campos a validar 
const regexMap = {
    text: /^[\p{L}]+(?:[  "-][\p{L}]+)*$/u,
    mail: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    phone: /^[0-9]+(?:[ -][0-9]+)*$/,
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

const validateForm = () => {
    // Referencia al formulario
    let form = document.getElementById("formRegistroVoluntario");

    // Referencia a los campos del formulario
    let nameInput        = document.getElementById("name");
    let lastnameInput    = document.getElementById("lastname");
    let emailInput       = document.getElementById("email");
    let phoneCodeInput   = document.getElementById("select-phone-code");
    let phoneNumberInput = document.getElementById("phone");
    let regionInput      = document.getElementById("select-region");
    let comunaInput      = document.getElementById("select-comuna");
    let addressInput     = document.getElementById("address");

    // Obtener referencias a los spans de error
    let nameError        =  document.getElementById("name-error");
    let lastnameError    =  document.getElementById("lastname-error");
    let emailError       =  document.getElementById("email-error");
    let phoneCodeError   =  document.getElementById("phone-code-error");
    let phoneNumberError =  document.getElementById("phone-error");
    let regionError      =  document.getElementById("region-error");
    let comunaError      =  document.getElementById("comuna-error");
    let addressError     =  document.getElementById("address-error");

    let nameValid        = validateField(nameInput.value, regexMap.text, 2, 32);
    let lastnameValid    = validateField(lastnameInput.value, regexMap.text, 2, 32);
    let emailValid       = validateField(emailInput.value, regexMap.mail, 10, 64);
    let phoneCodeValid   = validateType(phoneCodeInput.value);
    let phoneNumberValid = validateField(phoneNumberInput.value, regexMap.phone, 8, 15);
    let regionValid      = validateType(regionInput.value);
    let comunaValid      = validateType(comunaInput.value);
    let addressValid     = validateField(addressInput.value, regexMap.address, 0, 100);

    // Hacer visible span de error
    const setInvalidInput = (errorSpan, input, isValid) => {
        if (errorSpan) {
            errorSpan.classList.toggle("visible", !isValid);
        }
        setFieldStyle(input, isValid);
    };

    setInvalidInput(nameError, nameInput, nameValid);
    setInvalidInput(lastnameError, lastnameInput, lastnameValid);
    setInvalidInput(emailError, emailInput, emailValid);
    setInvalidInput(phoneCodeError, phoneCodeInput, phoneCodeValid);
    setInvalidInput(phoneNumberError, phoneNumberInput, phoneNumberValid);
    setInvalidInput(regionError, regionInput, regionValid);
    setInvalidInput(comunaError, comunaInput, comunaValid);
    setInvalidInput(addressError, addressInput, addressValid);

    // Si hay un campo no válido, detener
    const isValid = (nameValid && lastnameValid && emailValid && phoneCodeValid && phoneNumberValid && regionValid && comunaValid && addressValid) 
    if (!isValid) {
        return;
    } else {
        window.location.href = "../pages/registroExitosoVoluntarios.html"   
    };
};

document.getElementById("formRegistroVoluntario").addEventListener("submit", (event) => {
    event.preventDefault();
    validateForm();
});