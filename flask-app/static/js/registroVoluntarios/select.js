// Ordena los códigos telefónicos (+56 queda primero por defecto)
codigosTelefonicos.sort((a, b) => {
    const numA = parseFloat(a.replace(/[+\-]/g, ''));
    const numB = parseFloat(b.replace(/[+\-]/g, ''));
    return numA - numB;
});

const populatePhoneCode = () => {
    const selectPhoneCode = document.getElementById("select-phone-code");

    selectPhoneCode.innerHTML = "";
    codigosTelefonicos.forEach(code => {
        const option = document.createElement("option");
        option.value = code;
        option.textContent = code;
        selectPhoneCode.appendChild(option);
    });
    // +56 por defecto, o el código elegido si el formulario volvió con errores
    selectPhoneCode.value = selectPhoneCode.dataset.selected || "+56";
};

document.addEventListener("DOMContentLoaded", populatePhoneCode);