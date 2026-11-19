const form    = document.getElementById("buscador");
const input   = document.getElementById("input");
const message = document.getElementById("message");
const table   = document.getElementById("results");
const body    = document.getElementById("results-body");

let timer = null;
let controller = null;

const normalize = (text) =>
    Array.from(text,
        (c) => Array.from(c.normalize("NFD"))[0].toLowerCase()).join("");

const formatDate = (datetime) => String(datetime).slice(0, 10).split("-").reverse().join("-");

const highlight = (element, text, query) => {

    const normalizedText= normalize(text);
    const normalizedQuery = normalize(query);
    let ini = 0;
    let pos = normalizedText.indexOf(normalizedQuery);
    while (pos !== -1) {
        element.append(text.slice(ini, pos));
        const mark = document.createElement("mark");
        mark.textContent = text.slice(pos, pos + normalizedQuery.length);
        element.append(mark);
        ini = pos + normalizedQuery.length;
        pos = normalizedText.indexOf(normalizedQuery, ini);
    }
    element.append(text.slice(ini));
};

const createCell = (text, query) => {
    const cell = document.createElement("td");
    highlight(cell, text, query);
    return cell;
};

const formatAverage = (average) => average === null ? "-" : average.toFixed(1);

const evaluate = async (id, noteCell) => {
    const value = prompt("Ingresa una nota del 1 al 7");
    if (value === null) {
        return;
    }
    try {
        const response = await fetch(`/api/avistamientos/${id}/nota`, {
            method: "POST",
            body: new URLSearchParams({ nota: value })
        });
        if (response.status === 400) {
            alert("La nota debe ser un número entero entre 1 y 7.");
            return;
        }
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        noteCell.textContent = formatAverage(await response.json());
    } catch (error) {
        alert("No se pudo guardar la nota. Intenta de nuevo.");
    }
};

const createRow = (avistamiento, query) => {

    const row = document.createElement("tr");
    row.append(createCell(avistamiento.voluntario, query));

    const day = document.createElement("td");
    day.textContent = formatDate(avistamiento.fechaHora);
    row.append(day);
    row.append(createCell(avistamiento.ave, query));
    row.append(createCell(avistamiento.comuna, query));

    const note = document.createElement("td");
    note.textContent = formatAverage(avistamiento.promedio);
    row.append(note);

    const action = document.createElement("td");
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "Evaluar";
    button.addEventListener("click", () => evaluate(avistamiento.id, note));
    action.append(button);
    row.append(action);
    return row;
};

const clean = () => {
    body.replaceChildren();
    table.hidden = true;
    message.textContent = "";
};

const show = (avistamientos, query) => {
    body.replaceChildren();
    if (avistamientos.length === 0) {
        table.hidden = true;
        message.textContent = `No se encontraron avistamientos para "${query}".`;
        return;
    }
    message.textContent = "";
    avistamientos.forEach((a) => body.append(createRow(a, query)));
    table.hidden = false;
};

const search = async (query) => {
    controller = new AbortController();
    try {
        const response = await fetch(`/api/avistamientos/search?q=${encodeURIComponent(query)}`, {
            signal: controller.signal
        });
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        show(await response.json(), query);
    } catch (error) {
        if (error.name === "AbortError") {
            return;
        }
        table.hidden = true;
        message.textContent = "No se pudo realizar la búsqueda. Intenta de nuevo.";
    }
};

input.addEventListener("input", () => {
    clearTimeout(timer);
    if (controller) {
        controller.abort();
    }
    const query = input.value.trim();
    if (query === "") {
        clean();
        return;
    }
    timer = setTimeout(() => search(query), 300);
});

form.addEventListener("submit", (event) => event.preventDefault());