// Paleta de colores (tomada desde root en index.css
const rootStyle       = getComputedStyle(document.documentElement);
const primaryColor    = rootStyle.getPropertyValue("--primary-color").trim();
const secondaryColor  = rootStyle.getPropertyValue("--secondary-color").trim();
const secondaryColor2 = rootStyle.getPropertyValue("--secondary-color-2").trim();
const accentColor1    = rootStyle.getPropertyValue("--accent-color-1").trim();
const accentColor2    = rootStyle.getPropertyValue("--accent-color-2").trim();
const grayDarkColor   = rootStyle.getPropertyValue("--gray-dark-color").trim();
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

// Función para actualizar (y "calcular") los indicadores (contadores)
const uploadCounter = (elementId, value) => {
    const element = document.getElementById(elementId);
    element.textContent = value;
};

// Función para hacer agregación de un valor dada una llave 
const countBy = (list, key, byMonth = true) => {
 
    if (!byMonth) {
        const counts = {};
        list.forEach(item => {
            const value = item[key];
            counts[value] = (counts[value] || 0) + 1;
        });
        return counts;
    } else {
        const counts = new Array(12).fill(0);
        list.forEach(item => {
            const [, month] = item.date.split("-"); // "2025-08-20" -> "08"
            const monthIndex = parseInt(month, 10) - 1;
            counts[monthIndex]++;
        });
        
        const labels = nombresMeses;
        const values = counts;
        
        return {labels, values};
    };
};

window.onload = () => {
    // Actualizar indicadores
    uploadCounter("volunteer-counter", volunteerData.length);
    uploadCounter("sighting-counter", sightingData.length);

    // Dibujar gráficos
    // 1. Avistamientos por mes:
    const {labels: monthLabels, values: monthValues} = countBy(sightingData, "date", true);
    new Chart(document.getElementById("graph-sightings-by-month"), {
        type: "bar",
        data: {
            labels: monthLabels,
            datasets: [{
                label: "Avistamientos",
                data: monthValues,
                backgroundColor: graphPalette[0],
            }],
        },
        options: {
            responsive: true,
            plugins: {
                legend: {display: false},
            },
            scales: {
                y: {beginAtZero: true, ticks: {precision: 0}},
            },
        },
    });

    // 2. Voluntarios por región:
    const volunteersByRegion = countBy(volunteerData, "region", false);
    new Chart(document.getElementById("graph-volunteers-regions"), {
        type: "pie",
        data: {
            labels: Object.keys(volunteersByRegion),
            datasets: [{
                data: Object.values(volunteersByRegion),
                backgroundColor: graphPalette,
            }],
        },
        options: {
            responsive: true,
            plugins: {
                legend: {display: false},
            },
        },
    });
};