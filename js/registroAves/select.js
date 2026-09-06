const populateBirdType = () => {
    const selectBirdType = document.getElementById("select-bird");
    
    selectBirdType.innerHTML = "";
    tiposAves.forEach(bird => {
        const option = document.createElement("option");
        option.value = bird;
        option.textContent = bird;
        selectBirdType.appendChild(option);
    });
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
    populateBirdType();
    populateRegion();
    populatePhoneCode();
};