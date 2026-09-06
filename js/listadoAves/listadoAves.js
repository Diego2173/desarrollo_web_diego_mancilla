const itemsPerPage = 5;
let currentPage = 1;

// Referencias a elementos de la página
const birdTypeFilter = document.getElementById("bird-type-filter");
const selectOrder    = document.getElementById("order");
const table          = document.getElementById("results-table");
const previousButton = document.getElementById("btn-previous");
const pageNumber     = document.getElementById("page-number");
const nextButton     = document.getElementById("btn-next");

// Función para poblar el filtro
const populateBirdTypeFilter = () => {
    tiposAves.forEach(bird => {
        const option = document.createElement("option");
        option.value = bird;
        option.textContent = bird;
        birdTypeFilter.appendChild(option);
    });
};

// Aplicar el filtro de tipo de aves seleccionado
const filterSighting = () => {
    let selectedType = birdTypeFilter.value;
    if (selectedType === "") {
        return [...sightingData];
    } else {
        return sightingData.filter( a => a.birdType === selectedType);
    }
};

// Ordenar la lista de avistamiento según la opción elegida (asc, y desc);
const orderSighting = (list, criteria = "date", asc = true) => {
    let orderedList = [...list];
 
    const getValue = (item) => {
        if (criteria === "place") {
            return `${item.comuna} ${item.region}`
        } else {
            if (criteria === "date") {
                return `${item.date} ${item.time}`
            } else {
                return item[criteria];
            }
        }
    };
 
    orderedList.sort((a, b) => asc
        ? getValue(a).localeCompare(getValue(b))
        : getValue(b).localeCompare(getValue(a))
    );
 
    return orderedList
}

const createRow = (sighting) => {
    let row               = document.createElement("tr");
 
    let cellType          = document.createElement("td");
    cellType.textContent  = sighting.birdType;
 
    let cellName          = document.createElement("td");
    cellName.textContent  = sighting.birdName;
 
    let cellPlace         = document.createElement("td");
    cellPlace.textContent = `${sighting.comuna}, ${sighting.region}`;
 
    let cellDate          = document.createElement("td");
    cellDate.textContent  = sighting.date;
 
    let cellTime          = document.createElement("td");
    cellTime.textContent  = sighting.time;
 
    let cellRegister = document.createElement("td");
    let fileTag = document.createElement("span");
    fileTag.className = `badge badge-${sighting.file.type}`;
    if (sighting.file.type === "foto") {
        fileTag.textContent = "Foto";
    } else {
        fileTag.textContent = "Video";
    } 
    cellRegister.appendChild(fileTag);
 
    row.append(cellType, cellName, cellPlace, cellDate, cellTime, cellRegister);
    return row;
};

const renderList = () => {

    const [criteria, direction] = selectOrder.value.split("-");
    const asc = direction === "asc";

    // Lista ordenada
    const orderedList = orderSighting(filterSighting(), criteria, asc);
    
    // Total máximo de páginas
    const totalPages = Math.max(1, Math.ceil(orderedList.length / itemsPerPage));

    // Manejar caso borde que sale si se cambia el filtro a veces
    if (currentPage > totalPages) currentPage = totalPages;
    
    // Tomar rebanada del arreglo
    const start = (currentPage - 1) * itemsPerPage;
    const pageItems = orderedList.slice(start, start + itemsPerPage);

    // Crear fila y añadirla a la tabla
    table.innerHTML = "";
    pageItems.forEach(sighting => table.appendChild(createRow(sighting)));
    
    // Escribir número de página
    pageNumber.textContent = `Página ${currentPage} de ${totalPages}`;

    // Desactivar botones en bordes de la lista
    previousButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages;
};
 
// Eventos:
birdTypeFilter.addEventListener("change", () => {
    currentPage = 1;
    renderList();
});
previousButton.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        renderList();
    }
});
selectOrder.addEventListener("change", () => {
    currentPage = 1;
    renderList();
});
nextButton.addEventListener("click", () => {
    currentPage++;
    renderList();
});


window.onload = () => {
    populateBirdTypeFilter();
    renderList();
}