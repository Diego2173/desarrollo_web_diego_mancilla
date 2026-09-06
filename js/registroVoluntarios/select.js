// Función para ordenar códigos telefónicos
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
    selectPhoneCode.value = "+56";
}

const populateRegion = () => {
    let regionSelect = document.getElementById("select-region");
    for (const region in regionesComunas) {
        let option = document.createElement("option");
        option.value = region;
        option.text = region;
        regionSelect.appendChild(option);
    }
}

const updateComuna = () => {
    const regionSelect = document.getElementById("select-region");
    const comunaSelect = document.getElementById("select-comuna");

    const selectedRegion = regionSelect.value;

    comunaSelect.innerHTML = "";
    
    if (regionesComunas[selectedRegion]) {
        regionesComunas[selectedRegion].forEach(comuna => {
            let option = document.createElement("option");
            option.value = comuna;
            option.text = comuna;
            comunaSelect.appendChild(option);
        });
    }
}

document.getElementById("select-region").addEventListener("change", updateComuna);

window.onload = () => {
    populateRegion();
    populatePhoneCode();
};