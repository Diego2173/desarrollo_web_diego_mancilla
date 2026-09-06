/*
Datos estáticos generados con IAG, 
contiene datos artificiales de avistamientos 
y datos artificiales de voluntarios 
*/

// Avistamientos registrados
const sightingData = [
    { id: 1,  birdType: "Passeriformes",  birdName: "Chercán",         region: "Región Metropolitana",     comuna: "Ñuñoa",       date: "2025-08-20", time: "08:15", file: { type: "foto",  name: "chercan_nunoa.jpg" } },
    { id: 2,  birdType: "Passeriformes",  birdName: "Zorzal",          region: "Valparaíso",                comuna: "Viña del Mar", date: "2025-08-15", time: "07:40", file: { type: "foto",  name: "zorzal_vina.jpg" } },
    { id: 3,  birdType: "Pelecaniformes", birdName: "Bandurria",       region: "Región de Los Lagos",       comuna: "Puerto Montt", date: "2025-08-10", time: "09:00", file: { type: "video", name: "bandurria_pto_montt.mp4" } },
    { id: 4,  birdType: "Passeriformes",  birdName: "Tordo",           region: "Región del Biobío",         comuna: "Concepción",   date: "2025-07-28", time: "18:20", file: { type: "foto",  name: "tordo_concepcion.jpg" } },
    { id: 5,  birdType: "Passeriformes",  birdName: "Diucón",          region: "Región de la Araucanía",    comuna: "Temuco",       date: "2025-07-22", time: "10:05", file: { type: "foto",  name: "diucon_temuco.jpg" } },
    { id: 6,  birdType: "Cathartiformes", birdName: "Cóndor Andino",   region: "Región de Magallanes",      comuna: "Punta Arenas", date: "2025-07-15", time: "12:30", file: { type: "video", name: "condor_pta_arenas.mp4" } },
    { id: 7,  birdType: "Passeriformes",  birdName: "Chincol",         region: "Región Metropolitana",     comuna: "Providencia",  date: "2025-07-05", time: "08:50", file: { type: "foto",  name: "chincol_providencia.jpg" } },
    { id: 8,  birdType: "Ciconiiformes",  birdName: "Garza Grande",    region: "Coquimbo",                  comuna: "La Serena",    date: "2025-06-28", time: "17:10", file: { type: "foto",  name: "garza_la_serena.jpg" } },
    { id: 9,  birdType: "Falconiformes",  birdName: "Tiuque",          region: "Valparaíso",                comuna: "Valparaíso",   date: "2025-06-18", time: "09:45", file: { type: "foto",  name: "tiuque_valpo.jpg" } },
    { id: 10, birdType: "Apodiformes",    birdName: "Picaflor Gigante",region: "Arica y Parinacota",        comuna: "Arica",        date: "2025-06-10", time: "11:00", file: { type: "foto",  name: "picaflor_arica.jpg" } },
    { id: 11, birdType: "Passeriformes",  birdName: "Loica",           region: "Región de Ñuble",           comuna: "Chillán",      date: "2025-05-30", time: "08:00", file: { type: "video", name: "loica_chillan.mp4" } },
    { id: 12, birdType: "Suliformes",     birdName: "Yeco",            region: "Región de Los Ríos",        comuna: "Valdivia",     date: "2025-05-20", time: "07:30", file: { type: "foto",  name: "yeco_valdivia.jpg" } },
    { id: 13, birdType: "Passeriformes",  birdName: "Zorzal",          region: "Región Metropolitana",     comuna: "Maipú",        date: "2025-05-12", time: "19:00", file: { type: "foto",  name: "zorzal_maipu.jpg" } },
    { id: 14, birdType: "Passeriformes",  birdName: "Chercán",         region: "Región del Biobío",         comuna: "Talcahuano",   date: "2025-04-25", time: "08:40", file: { type: "foto",  name: "chercan_talcahuano.jpg" } },
    { id: 15, birdType: "Pelecaniformes", birdName: "Bandurria",       region: "Región de O'Higgins",       comuna: "Rancagua",     date: "2025-04-10", time: "09:20", file: { type: "foto",  name: "bandurria_rancagua.jpg" } },
    { id: 16, birdType: "Passeriformes",  birdName: "Diucón",          region: "Valparaíso",                comuna: "Quilpué",      date: "2025-03-30", time: "10:15", file: { type: "video", name: "diucon_quilpue.mp4" } },
];

// Voluntarios registrados
const volunteerData = [
    { id: 1,  region: "Región Metropolitana",  registrationDate: "2025-01-10" },
    { id: 2,  region: "Región Metropolitana",  registrationDate: "2025-02-14" },
    { id: 3,  region: "Valparaíso",            registrationDate: "2025-01-22" },
    { id: 4,  region: "Región del Biobío",     registrationDate: "2025-03-05" },
    { id: 5,  region: "Región de Los Lagos",   registrationDate: "2025-02-18" },
    { id: 6,  region: "Región de la Araucanía",registrationDate: "2025-04-02" },
    { id: 7,  region: "Región Metropolitana",  registrationDate: "2025-05-11" },
    { id: 8,  region: "Coquimbo",              registrationDate: "2025-03-20" },
    { id: 9,  region: "Valparaíso",            registrationDate: "2025-04-15" },
    { id: 10, region: "Región de Magallanes",  registrationDate: "2025-05-30" },
    { id: 11, region: "Región Metropolitana",  registrationDate: "2025-06-08" },
    { id: 12, region: "Región del Biobío",     registrationDate: "2025-06-22" },
];