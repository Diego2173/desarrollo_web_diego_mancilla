// regex para los campos a validar 
const regexMap = {
    text: /^[\p{L}]+(?:[  "-][\p{L}]+)*$/u,
    mail: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    phone: /^[0-9]+(?:[ -][0-9]+)*$/,
};


// función para validar un campo en el cual se puede escribir mediante una expresión regular y restricciones de longitud
const validateField = (value, re, minLength = 0, maxLength = 100) => {

    if (!value) return false;
    
    let trimmed = value.trim();
    let formatValid = re.test(trimmed);

    let lengthValid = trimmed.length >= minLength && trimmed.length <= maxLength;

    return formatValid && lengthValid;
}

// Función para validar que un campo de tipo select no tenga el valor por defecto (placeholder)
const validateType = (type) => {
    if (!type) return false;
    return true
}

const validateForm = () => {
    // Referencia al formulario
    let form = document.getElementById("formRegistroVoluntario");

    // Referencias a los campos del formulario
    let name        = document.getElementById("name").value;
    let lastname    =  document.getElementById("lastname").value;
    let email       =  document.getElementById("email").value;
    let phoneCode   =  document.getElementById("select-phone-code").value
    let phoneNumber =  document.getElementById("phone").value;
    let region      =  document.getElementById("select-region").value;
    let comuna      =  document.getElementById("select-comuna").value;
    let address     =  document.getElementById("address").value;

    // Obtener referencias a los spans de error
    let nameError        =  document.getElementById("name-error");
    let lastnameError    =  document.getElementById("lastname-error");
    let emailError       =  document.getElementById("email-error");
    let phoneCodeError   =  document.getElementById("phone-code-error");
    let phoneNumberError =  document.getElementById("phone-error");
    let regionError      =  document.getElementById("region-error");
    let comunaError      =  document.getElementById("comuna-error");
    let addressError     =  document.getElementById("address-error");

    let nameValid        = validateField(name, regexMap.text, 2, 32);
    let lastnameValid    = validateField(lastname, regexMap.text, 2, 32);
    let emailValid       = validateField(email, regexMap.mail, 10, 64);
    let phoneCodeValid   = validateType(phoneCode);
    let phoneNumberValid = validateField(phoneNumber, regexMap.phone, 8, 15);
    let regionValid      = validateType(region);
    let comunaValid      = validateType(comuna);
    let addressValid     = validateField(address, regexMap.text, 0, 100);

    // Hacer visible span de error
    const setInvalidInput = (errorSpan, isValid) => {
        if (errorSpan) {
            errorSpan.classList.toggle("visible", !isValid)
        }
    };

    setInvalidInput(nameError, nameValid);
    setInvalidInput(lastnameError, lastnameValid);
    setInvalidInput(emailError, emailValid);
    setInvalidInput(phoneCodeError, phoneCodeValid);
    setInvalidInput(phoneNumberError, phoneNumberValid);
    setInvalidInput(regionError, regionValid);
    setInvalidInput(comunaError, comunaValid);
    setInvalidInput(addressError, addressValid);

    // Si hay un campo no válido, se queda hasta aquí el programa
    const isValid = (nameValid && lastnameValid && emailValid && phoneCodeValid && phoneNumberValid && regionValid && comunaValid && addressValid) 
    if (!isValid) {
        // lógica para señalar cuales son los campos inválidos

        return false
    } else {

        // Limpiar formulario y los errores
        form.reset();
        setInvalidInput(nameError, true);
        setInvalidInput(lastnameError, true);
        setInvalidInput(emailError, true);
        setInvalidInput(phoneCodeError, true);
        setInvalidInput(phoneNumberError, true);
        setInvalidInput(regionError, true);
        setInvalidInput(comunaError, true);
        setInvalidInput(addressError, true);

        // llevar a página de éxito externa tal vez /pages/registroExitoso y de ahí redigir a index.html
        // y guardar datos del usuario en local storage---
    };
}

document.getElementById("formRegistroVoluntario").addEventListener("submit", (event) => {
    event.preventDefault();
    validateForm();
});