 // Datos de países y códigos telefónicos extraídos de https://countrycode.org
const codigosTelefonicos = [
    "+56",
    "+93", "+355", "+213", "+1-684", "+376", "+244", "+1-264", "+672",
    "+1-268", "+54", "+374", "+297", "+61", "+43", "+994", "+1-242",
    "+973", "+880", "+1-246", "+375", "+32", "+501", "+229", "+1-441",
    "+975", "+591", "+387", "+267", "+55", "+246", "+1-284", "+673",
    "+359", "+226", "+257", "+855", "+237", "+1", "+238", "+1-345",
    "+236", "+235", "+86", "+57", "+269", "+682", "+506",
    "+385", "+53", "+599", "+357", "+420", "+243", "+45", "+253",
    "+1-767", "+1-809", "+1-829", "+1-849", "+670", "+593", "+20",
    "+503", "+240", "+291", "+372", "+251", "+500", "+298", "+679",
    "+358", "+33", "+689", "+241", "+220", "+995", "+49", "+233",
    "+350", "+30", "+299", "+1-473", "+1-671", "+502", "+44-1481",
    "+224", "+245", "+592", "+509", "+504", "+852", "+36", "+354",
    "+91", "+62", "+98", "+964", "+353", "+44-1624", "+972", "+39",
    "+225", "+1-876", "+81", "+44-1534", "+962", "+7", "+254", "+686",
    "+383", "+965", "+996", "+856", "+371", "+961", "+266", "+231",
    "+218", "+423", "+370", "+352", "+853", "+389", "+261", "+265",
    "+60", "+960", "+223", "+356", "+692", "+222", "+230", "+262",
    "+52", "+691", "+373", "+377", "+976", "+382", "+1-664", "+212",
    "+258", "+95", "+264", "+674", "+977", "+31", "+687", "+64",
    "+505", "+227", "+234", "+683", "+850", "+1-670", "+47", "+968",
    "+92", "+680", "+970", "+507", "+675", "+595", "+51", "+63",
    "+48", "+351", "+1-787", "+1-939", "+974", "+242", "+40", "+250",
    "+590", "+290", "+1-869", "+1-758", "+508", "+1-784", "+685",
    "+378", "+239", "+966", "+221", "+381", "+248", "+232", "+65",
    "+1-721", "+421", "+386", "+677", "+252", "+27", "+82", "+211",
    "+34", "+94", "+249", "+597", "+268", "+46", "+41", "+963",
    "+886", "+992", "+255", "+66", "+228", "+690", "+676", "+1-868",
    "+216", "+90", "+993", "+1-649", "+688", "+1-340", "+256", "+380",
    "+971", "+44", "+598", "+998", "+678", "+379", "+58",
    "+84", "+681", "+967", "+260", "+263"
];

// Regiones y comunas extraídas de https://juanbrujo.github.io/chile-regiones-comunas/ y reformateadas como objecto javascript
const regionesComunas = {
    "Arica y Parinacota":     ["Arica", "Camarones", "Putre", "General Lagos"],
    "Tarapacá":               ["Iquique", "Alto Hospicio", "Pozo Almonte", "Camiña", "Colchane", "Huara", "Pica"],
    "Antofagasta":            ["Antofagasta", "Mejillones", "Sierra Gorda", "Taltal", "Calama", "Ollagüe", "San Pedro de Atacama", "Tocopilla", "María Elena"],
    "Atacama":                ["Copiapó", "Caldera", "Tierra Amarilla", "Chañaral", "Diego de Almagro", "Vallenar", "Alto del Carmen", "Freirina", "Huasco"],
    "Coquimbo":               ["La Serena", "Coquimbo", "Andacollo", "La Higuera", "Paiguano", "Vicuña", "Illapel", "Canela", "Los Vilos", "Salamanca", "Ovalle", "Combarbalá", "Monte Patria", "Punitaqui", "Río Hurtado"],
    "Valparaíso":             ["Valparaíso", "Casablanca", "Concón", "Juan Fernández", "Puchuncaví", "Quintero", "Viña del Mar", "Isla de Pascua", "Los Andes", "Calle Larga", "Rinconada", "San Esteban", "La Ligua", "Cabildo", "Papudo", "Petorca", "Zapallar", "Quillota", "Calera", "Hijuelas", "La Cruz", "Nogales", "San Antonio", "Algarrobo", "Cartagena", "El Quisco", "El Tabo", "Santo Domingo", "San Felipe", "Catemu", "Llaillay", "Panquehue", "Putaendo", "Santa María", "Quilpué", "Limache", "Olmué", "Villa Alemana"],
    "Región Metropolitana":   ["Cerrillos", "Cerro Navia", "Conchalí", "El Bosque", "Estación Central", "Huechuraba", "Independencia", "La Cisterna", "La Florida", "La Granja", "La Pintana", "La Reina", "Las Condes", "Lo Barnechea", "Lo Espejo", "Lo Prado", "Macul", "Maipú", "Ñuñoa", "Pedro Aguirre Cerda", "Peñalolén", "Providencia", "Pudahuel", "Quilicura", "Quinta Normal", "Recoleta", "Renca", "San Joaquín", "San Miguel", "San Ramón", "Vitacura", "Puente Alto", "Pirque", "San José de Maipo", "Buin", "Calera de Tango", "Paine", "San Bernardo", "Alhué", "Curacaví", "María Pinto", "Melipilla", "San Pedro", "Talagante", "Colina", "Lampa", "Tiltil", "Santiago"],
    "Región de O'Higgins":    ["Rancagua", "Codegua", "Coinco", "Coltauco", "Doñihue", "Graneros", "Las Cabras", "Machalí", "Malloa", "Mostazal", "Olivar", "Peumo", "Pichidegua", "Quinta de Tilcoco", "Rengo", "Requínoa", "San Vicente", "Pichilemu", "La Estrella", "Litueche", "Marchihue", "Navidad", "Paredones", "San Fernando", "Chépica", "Chimbarongo", "Lolol", "Nancagua", "Palmilla", "Peralillo", "Placilla", "Pumanque", "Santa Cruz"],
    "Región del Maule":       ["Talca", "Constitución", "Curepto", "Empedrado", "Maule", "Pelarco", "Pencahue", "Río Claro", "San Clemente", "San Rafael", "Cauquenes", "Chanco", "Pelluhue", "Curicó", "Hualañé", "Licantén", "Molina", "Rauco", "Romeral", "Sagrada Familia", "Teno", "Vichuquén", "Linares", "Colbún", "Longaví", "Parral", "Retiro", "San Javier", "Villa Alegre", "Yerbas Buenas"],
    "Región de Ñuble":        ["Cobquecura", "Coelemu", "Ninhue", "Portezuelo", "Quirihue", "Ránquil", "Treguaco", "Bulnes", "Chillán Viejo", "Chillán", "El Carmen", "Pemuco", "Pinto", "Quillón", "San Ignacio", "Yungay", "Coihueco", "Ñiquén", "San Carlos", "San Fabián", "San Nicolás"],
    "Región del Biobío":      ["Concepción", "Coronel", "Chiguayante", "Florida", "Hualqui", "Lota", "Penco", "San Pedro de la Paz", "Santa Juana", "Talcahuano", "Tomé", "Hualpén", "Lebu", "Arauco", "Cañete", "Contulmo", "Curanilahue", "Los Álamos", "Tirúa", "Los Ángeles", "Antuco", "Cabrero", "Laja", "Mulchén", "Nacimiento", "Negrete", "Quilaco", "Quilleco", "San Rosendo", "Santa Bárbara", "Tucapel", "Yumbel", "Alto Biobío"],
    "Región de la Araucanía": ["Temuco", "Carahue", "Cunco", "Curarrehue", "Freire", "Galvarino", "Gorbea", "Lautaro", "Loncoche", "Melipeuco", "Nueva Imperial", "Padre las Casas", "Perquenco", "Pitrufquén", "Pucón", "Saavedra", "Teodoro Schmidt", "Toltén", "Vilcún", "Villarrica", "Cholchol", "Angol", "Collipulli", "Curacautín", "Ercilla", "Lonquimay", "Los Sauces", "Lumaco", "Purén", "Renaico", "Traiguén", "Victoria"],
    "Región de Los Ríos":     ["Valdivia", "Corral", "Lanco", "Los Lagos", "Máfil", "Mariquina", "Paillaco", "Panguipulli", "La Unión", "Futrono", "Lago Ranco", "Río Bueno"],
    "Región de Los Lagos":    ["Puerto Montt", "Calbuco", "Cochamó", "Fresia", "Frutillar", "Los Muermos", "Llanquihue", "Maullín", "Puerto Varas", "Castro", "Ancud", "Chonchi", "Curaco de Vélez", "Dalcahue", "Puqueldón", "Queilén", "Quellón", "Quemchi", "Quinchao", "Osorno", "Puerto Octay", "Purranque", "Puyehue", "Río Negro", "San Juan de la Costa", "San Pablo", "Chaitén", "Futaleufú", "Hualaihué", "Palena"],
    "Región de Aisén":        ["Coihaique", "Lago Verde", "Aisén", "Cisnes", "Guaitecas", "Cochrane", "O'Higgins", "Tortel", "Chile Chico", "Río Ibáñez"],
    "Región de Magallanes":   ["Punta Arenas", "Laguna Blanca", "Río Verde", "San Gregorio", "Cabo de Hornos (Ex Navarino)", "Antártica", "Porvenir", "Primavera", "Timaukel", "Natales", "Torres del Paine"],
};

// Función para ordenar códigos telefónicos
codigosTelefonicos.sort((a, b) => {
    const numA = parseFloat(a.replace(/[+\-]/g, ''));
    const numB = parseFloat(b.replace(/[+\-]/g, ''));
    return numA - numB;
});

function populatePhoneCode() {
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