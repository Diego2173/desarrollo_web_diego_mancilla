// Paleta de colores (tomada desde root en index.css)
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
    grayLightColor
];

const getJSON = (url, callback) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.responseType = "json";
    xhr.onload = () => {
        if (xhr.status === 200) {
            callback(xhr.response);
        }
    };
    xhr.send();
};

const indicators = document.querySelector(".indicators");
getJSON(
    indicators.dataset.url,
    (data) => {
        document.getElementById("volunteer-counter").textContent = data.voluntarios;
        document.getElementById("sighting-counter").textContent = data.avistamientos;
    }
);

const loadChart = (element, draw) => {
    getJSON(
        element.dataset.url,
        (data) => {
            if (data.length === 0) {
                element.classList.add("-");
                element.textContent = "-";
                return;
            }
            draw(data);
        }
    );
};

// 1. Avistamientos por día (líneas)
const drawSightingsByDay = (data) => {
    const points = data.map(d => [Date.parse(d.fecha), d.total]);
 
    $.plot("#graph-sightings-by-day", [{ data: points, color: primaryColor }], {
        series: { lines: { show: true }, points: { show: true } },
        xaxis:  { mode: "time", timeformat: "%d-%m-%Y", minTickSize: [1, "day"], tickLength: 0 },
        yaxis:  { min: 0, minTickSize: 1, tickDecimals: 0 },
        grid:   { borderWidth: 1, borderColor: grayLightColor }
    });
};

 
// 2. Avistamientos por tipo de ave (torta)
const drawSightingsByBird = (data) => {
    const series = data.map(d => ({ label: d.ave, data: d.total }));
 
    $.plot("#graph-sightings-by-bird", series, {
        colors: graphPalette,
        series: {
            pie: {
                show: true,
                radius: 1,
                label: {
                    show: true,
                    radius: 3 / 4,
                    threshold: 0.05,
                    formatter: (label, slice) => Math.round(slice.percent) + "%"
                }
            }
        },  
        legend: {
            show: true,
            container: "#legend-sightings-by-bird",
            labelFormatter: (label, slice) => label + " (" + slice.data[0][1] + ")"
        }
    });
};
  
// 3. Voluntarios por comuna (barras)
const drawVolunteersByCommune = (data) => {
    const points = data.map(d => [d.comuna, d.total]);
 
    $.plot("#graph-volunteers-by-commune", [{ data: points, color: primaryColor }], {
        series: { bars: { show: true, barWidth: 0.6, align: "center", fill: 1 } },
        xaxis:  { mode: "categories", tickLength: 0 },
        yaxis:  { min: 0, minTickSize: 1, tickDecimals: 0 },
        grid:   { borderWidth: 1, borderColor: grayLightColor }
    });
};
 
const sightingsByDay = document.getElementById("graph-sightings-by-day");
const sightingsByBird = document.getElementById("graph-sightings-by-bird");
const volunteersByCommune = document.getElementById("graph-volunteers-by-commune");

loadChart(sightingsByDay, drawSightingsByDay);
loadChart(sightingsByBird, drawSightingsByBird);
loadChart(volunteersByCommune, drawVolunteersByCommune);