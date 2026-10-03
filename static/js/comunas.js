const regionSelect = document.getElementById("select-region");
const comunaSelect = document.getElementById("select-comuna");

const loadComunas = async (selectedId = "") => {
    comunaSelect.innerHTML = "";
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Comuna";
    comunaSelect.appendChild(placeholder);

    if (!regionSelect.value) return;

    try {
        const response = await fetch(`/api/comunas/${encodeURIComponent(regionSelect.value)}`);
        const comunas = await response.json();
        comunas.forEach(c => {
            const option = document.createElement("option");
            option.value = c.id;
            option.textContent = c.nombre;
            comunaSelect.appendChild(option);
        });
        // Si el formulario volvió con errores, se restaura la comuna elegida
        comunaSelect.value = selectedId;
    } catch (error) {
        console.error("No se pudieron cargar las comunas", error);
    }
};

regionSelect.addEventListener("change", () => loadComunas());
document.addEventListener("DOMContentLoaded", () => loadComunas(comunaSelect.dataset.selected || ""));