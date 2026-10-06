# READ ME

## Detalles y decisiones hechas en la tarea:

### Overview de los archivos:

Anteriormente los archivos estaban ordenados así:
```
|-- index.html                          # Página de inicio del sitio
|
|-- pages/
|   |-- registroVoluntarios.html        # Formulario de registro de voluntarios
|   |-- registroAves.html               # Formulario para registrar un avistamiento
|   |-- listadoAves.html                # Listado de avistamientos
|   |-- estadisticas.html               # Indicadores y gráficos
|   |-- registroExitosoVoluntarios.html # Confirmación de registro de voluntario
|   |-- registroExitosoAves.html        # Confirmación de avistamiento informado
|
|-- css/
|   |-- index.css                       # Estilos globales (e.g. :root, header y nav)
|   |-- form.css                        # Estilos de los formularios (registroVoluntarios/registroAves)
|   |-- listado.css                     # Estilos de listadoAves.html (filtros, tabla, paginación)
|   |-- estadisticas.css                # Estilos de estadisticas.html (indicadores, gráficos)
|   |-- registroExitoso.css             # Estilos de las páginas de confirmación
|
|-- js/
|   |-- dataConst.js                    # Constantes hardcodeadas (e.g. tipos de aves y regiones/comunas)
|   |-- data.js                         # Datos de ejemplo (avistamientos y voluntarios, generados con IA)
|   |-- registroVoluntarios/
|       |-- select.js                   # Puebla los selects del formulario de voluntarios
|       |-- validation.js               # Validación del formulario de voluntarios
|   |-- registroAves/
|       |-- select.js                   # Puebla los selects del formulario de avistamiento
|       |-- validation.js               # Validación del formulario de avistamiento
|   |-- listadoAves/
|       |-- listadoAves.js              # Filtro, orden y paginación del listado
|   |-- estadisticas/
|       |-- estadisticas.js             # Cálculo de indicadores y gráficos (Chart.js)
|
|-- images/
|   |-- banner.jpg                      # Imagen del banner de inicio
|   |-- logo.svg                        # Logo del sitio
```

Mientras que ahora, la estructura es:
```
├-- app.py                          # Punto de entrada de la aplicación Flask (rutas)
├-- requirements.txt                # Requerimientos del proyecto
│
├-- database/
│   ├-- db.py                       # Modelos (SQLAlchemy) y funciones que interactúan con la BD
│   ├-- load_tables.py              # Script de carga inicial de datos
│   ├-- tarea2.sql                  # Schema y tablas principales
│   ├-- aves.sql                    # Script con información de aves
│   └-- region-comuna.sql           # Script de regiones y comunas de Chile
│
├-- utils/
│   └-- validation.py               # Validaciones por el lado del servidor
│
├-- static/                         # Archivos estáticos
│   ├-- css/                        # Mismos 5 archivos de la Tarea 1 (index, form, listado, estadisticas, registroExitoso)
│   ├-- js/
│   │   ├-- comunas.js              # Pide las comunas de una región a /api/comunas/<id> y llena el select
│   │   ├-- dataConst.js            # Constantes hardcodeadas; ahora solo se usa para los códigos telefónicos y las estadísticas
│   │   ├-- data.js                 # Datos de ejemplo de la Tarea 1; ahora solo los usan las estadísticas
│   │   ├-- registroVoluntarios/
│   │   │   ├-- select.js           # Puebla el select del código telefónico
│   │   │   └-- validation.js       # Validación del formulario de voluntarios
│   │   ├-- registroAves/
│   │   │   └-- validation.js       # Validación del formulario de avistamiento
│   │   ├-- listadoAves/
│   │   │   └-- listadoAves.js      # Hace clickable cada fila del listado
│   │   └-- estadisticas/
│   │       └-- estadisticas.js     # Cálculo de indicadores y gráficos (Chart.js)
│   ├-- images/                     # banner.jpg y logo.svg
│   └-- uploads/                    # Directorio donde se almacenan las fotos y videos subidos
│
└-- templates/                      # Plantillas de Jinja
    ├-- base.html                   # Estructura común (header, navegación) con bloques para cada página
    ├-- index.html                  # Página principal
    ├-- form/
    │   ├-- form_voluntarios.html   # Formulario de registro de voluntarios
    │   └-- form_aves.html          # Formulario de registro de avistamientos
    ├-- listadoAves/
    │   ├-- listadoAves.html        # Listado de avistamientos (filtro, orden y paginación)
    │   └-- detalle.html            # Información completa de un avistamiento
    ├-- estadisticas/
    │   └-- estadisticas.html       # Sección de estadísticas
    └-- successful/
        ├-- successfulRegistrationVoluntarios.html   # Confirmación de registro de voluntario
        └-- successfulRegistrationAves.html          # Confirmación de avistamiento informado
```

Se refactorizaron los archivos de `pages/` de la Tarea 1 en los archivos de `templates/`, de la siguiente forma:
 
| Tarea 1 | Tarea 2 |
|---|---|
| `index.html` | `templates/index.html` |
| `pages/registroVoluntarios.html` | `templates/form/form_voluntarios.html` |
| `pages/registroAves.html` | `templates/form/form_aves.html` |
| `pages/listadoAves.html` | `templates/listadoAves/listadoAves.html` (más el nuevo `detalle.html`) |
| `pages/estadisticas.html` | `templates/estadisticas/estadisticas.html` |
| `pages/registroExitosoVoluntarios.html` | `templates/successful/successfulRegistrationVoluntarios.html` |
| `pages/registroExitosoAves.html` | `templates/successful/successfulRegistrationAves.html` |

En que `base.html` contiene el código html repetitivo de la tarea1 (e.g. código de `navbar`). Notar también que los CSS e imágenes pasaron a `static/`.

En cuanto a javascript, los cambios fueron:
1. Las regiones ya no salen de `dataConst.js`, ahora las entrega Flask desde la BD. Como ambos formularios contemplaban región y comuna, estas se piden por `fetch` a `/api/comunas/<id>` (`comunas.js`).

2. Los selects de ave y voluntario del formulario de avistamiento los renderiza Jinja, por lo que `registroAves/select.js` ya no existe.

3. `listadoAves.js` que contenía la lógica de paginación ahora los hace el servidor.

---
### Decisiones de diseño generales

Se replica la lógica de validación de los formularios de Javascript en Python, es decir, se replica el código de `validation.js` en `utils/validation.py`. Esto genera una doble validación;
1. En el navegador se mantienen las validaciones de la Tarea 1. Si algún campo es inválido se cancela el envío y se muestran los errores. Si es válido, el formulario se envía por POST a Flask.

2. En el servidor se vuelven a validar todos los campos. Si hay errores, se vuelve a mostrar el formulario con los datos ya ingresados y un mensaje en cada campo con error.

La mayoría de las validaciones se hacen validando el formato y el largo del input. Gran parte de la lógica de la tarea 1 se mantiene intacta.

El archivo `database/db.py` fue hecho basado #### en los auxiliares #####. Se puede separar el archivo en cuatro partes:
1. Modelos de la Base de Datos
2. Funciones de get
3. Funciones de create
4. Funciones para hacer agregaciones y ####

#### Modelo de datos
Se utilizó el esquema de `tarea2.sql` sin modificarlo, lo que genera que ciertos campos de los formularios no se guarden, como la dirección en el formulario de voluntario. El formulario pide y valida la dirección, pero solo se guarda la comuna (`comuna_id`). Se mantuvo el esquema `tarea2.sql` dado que #####.

Por otro lado, `voluntario.telefono` es `VARCHAR(15)` en el esquema, por lo que se valida que código y el número juntos no superen los 15 caracteres y no que los dos estén bien formateados y de un largo correcto.

También, `avistamiento.lugar` se arma como `dirección, comuna, región`, `voluntario.fecha_registro` se asigna con la fecha y hora del momento en que se hace el `INSERT`, como se menciona en el enunciado cada archivo subido es una fila de `registro`, por lo que un avistamiento puede tener varios, y por último, pero no menos importante:La tabla `ave` solo tiene el nombre y no el tipo de ave como en la Tarea1, esto es debido a que se decidió respetar el esquema de `tarea2.sql`, sin embargo, no sería complejo ####. Así que el formulario elige el ave de un select y el filtro del listado es por ave.

#### `app.py`
describir archivo con el mismo estilo

#### Archivos subidos
Cada archivo se guarda en `static/uploads/` con el nombre `<hash del nombre original>_<uuid>.<extensión real>`. Así no hay colisiones y ni se usa el nombre que escribió el usuario.

Mientras que el nombre original se guarda en `registro.nombre_archivo` sanitizado con `secure_filename`.

#### Rutas
 
| Ruta | Método | Descripción |
|---|---|---|
| `/` | GET | Portada |
| `/voluntarios` | GET, POST | Formulario de registro de voluntarios |
| `/voluntarios/<id>/exito` | GET | Confirmación del registro de un voluntario |
| `/avistamientos/nuevo` | GET, POST | Formulario de registro de avistamientos |
| `/avistamiento/<id>/exito` | GET | Confirmación del registro de un avistamiento |
| `/avistamientos` | GET | Listado (parámetros `page`, `ave`, `orden`, `dir`) |
| `/avistamientos/<id>` | GET | Detalle de un avistamiento |
| `/api/comunas/<region_id>` | GET | JSON con las comunas de una región |
| `/estadisticas` | GET | Estadísticas |
| `/olvidar` | GET | Borra la sesión del voluntario |

---
#### `estadisticas` y `static/js/data.js` 

El contenido se mantiene igual que en la Tarea1 debido a que no #######. El único cambio que cabe mencionar es que `estadisticas.html` hereda `base.html` ######, no hay conexión con la BD, las estádisticas se siguen alimentando de `data.js`
 
---