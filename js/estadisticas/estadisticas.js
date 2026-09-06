// Paleta de colores (tomada desde root en index.css
const rootStyle      = getComputedStyle(document.documentElement);
const primaryColor   = rootStyle.getPropertyValue("--primary-color").trim();
const secondaryColor = rootStyle.getPropertyValue("--secondary-color").trim();
const secondaryColor2 = rootStyle.getPropertyValue("--secondary-color").trim();
const accentColor1   = rootStyle.getPropertyValue("--accent-color-1").trim();
const accentColor2   = rootStyle.getPropertyValue("--accent-color-2").trim();
const grayDarkColor  = rootStyle.getPropertyValue("--gray-dark-color").trim();
const grayLightColor  = rootStyle.getPropertyValue("--gray-light-color").trim();

const graphPalette = [
    primaryColor, 
    accentColor1, 
    secondaryColor, 
    accentColor2, 
    secondaryColor2, 
    grayDarkColor, 
    grayLightColor
];

const uploadCounter = (elementId, value) => {
    const element = document.getElementById(elementId);
    element.textContent = value;
}


window.onload = () => {
    // Actualizar indicadores
    uploadCounter("volunteer-counter", volunteerData.length);
    uploadCounter("sighting-counter", sightingData.length);

    // Dibujar gráficos
    // 1. Avistamientos por mes:

    // 2. Voluntarios por región

};