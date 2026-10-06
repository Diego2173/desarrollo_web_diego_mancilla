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

Se replica la lógica de validación de los formularios de JavaScript en Python, es decir, se replica el código de `validation.js` en `utils/validation.py`. Esto genera una doble validación:

1. En el navegador se mantienen las validaciones de la Tarea 1. Si algún campo es inválido se cancela el envío y se muestran los errores. Si es válido, el formulario se envía por POST a Flask.

2. En el servidor se vuelven a validar todos los campos. Si hay errores, se vuelve a mostrar el formulario con los datos ya ingresados y un mensaje en cada campo con error.

Cabe mencionar que la mayoría de las validaciones se hacen validando el formato y el largo del input. Gran parte de la lógica de la Tarea 1 se mantiene intacta.
 
El archivo `database/db.py` fue hecho basado en el `db.py` del Auxiliar 6: se mantiene el mismo patrón de abrir una sesión de SQLAlchemy por función (`SessionLocal`), usarla y cerrarla en un `finally`. Se puede separar el archivo en cuatro partes:

1. Modelos de la Base de Datos (`Region`, `Comuna`, `Voluntario`, `Ave`, `Avistamiento` y `Registro`).

2. Funciones de get (regiones, comunas, aves y voluntarios, para llenar los selects y verificar que lo que llega por POST exista).

3. Funciones de create (`create_voluntario`, `create_avistamiento` y `create_registro`).

4. Funciones para hacer agregaciones y consultas para mostrar datos.

#### Modelo de datos
Se utilizó el esquema de `tarea2.sql` sin modificarlo, lo que genera que ciertos campos de los formularios no se guarden, como la dirección en el formulario de voluntario. El formulario pide y valida la dirección, pero solo se guarda la comuna (`comuna_id`). Se mantuvo el esquema `tarea2.sql` dado que es el que entrega el enunciado y es el que usan los scripts de carga (`aves.sql` y `region-comuna.sql`), por lo que respetarlo permite recrear la base de datos con los mismos archivos del curso sin tener que modificar nada más.

Por otro lado, `voluntario.telefono` es `VARCHAR(15)` en el esquema, por lo que se valida que código y el número juntos no superen los 15 caracteres y no que los dos estén bien formateados y de un largo correcto.

También, `avistamiento.lugar` se arma como `dirección, comuna, región` y `voluntario.fecha_registro` se asigna con la fecha y hora del momento en que se hace el `INSERT`. Como se menciona en el enunciado, cada archivo subido es una fila de `registro`, por lo que un avistamiento puede tener varios. Por último, pero no menos importante: la tabla `ave` solo tiene el nombre y no el tipo de ave como en la Tarea 1; esto es debido a que se decidió respetar el esquema de `tarea2.sql`. Sin embargo, no sería complejo agregarlo: bastaría una columna `tipo` en `ave` (o una tabla `tipo_ave`) y volver a poner el filtro por tipo de la Tarea 1 junto al filtro por ave. Así que, por ahora, el formulario elige el ave de un select y el filtro del listado es por ave.


#### `app.py`

Es el punto de entrada de la aplicación y concentra todas las rutas. Se puede separar el archivo en ocho partes:

1. Configuración de la aplicación Flask.

2. Sesión del voluntario

3. Portada: la ruta `index`, junto con `last_avistamientos` (los 2 últimos avistamientos agregados) y `ave_del_dia`. Esta última cuenta las aves que tienen al menos un registro (`n`), genera un número entre 1 y `n` con una semilla hecha con el día, mes y año (por ejemplo `20261004`) y toma el ave que ocupa esa posición al ordenarlas por nombre. Así, el ave es la misma durante todo el día y cambia al siguiente sin guardar nada en la BD.

4. API de comunas: `/api/comunas/<id>` devuelve en JSON las comunas de una región y la consume `comunas.js`.

5. Voluntario: `new_voluntario` (con GET muestra el formulario; con POST valida los campos con `utils/validation.py` y, si hay errores, vuelve a mostrar el formulario con estado 400; si no, lo inserta con `db.create_voluntario`, lo guarda en la sesión y redirige a la confirmación) y `voluntario_exito`.

6. Avistamiento: `new_avistamiento`, que además de validar los campos verifica que el voluntario, el ave y la comuna existan (y que la comuna pertenezca a la región elegida). Luego arma el `lugar`, inserta el avistamiento, guarda cada archivo y su fila en `registro`, y redirige a `avistamiento_exito`.

7. Listado: `leer_params_listado`: lee los parámetros `page`, `ave`, `orden` y `dir`; `orden` y `dir` que se comparan contra una lista de valores permitidos, `listado` (paginado, de 5 avistamientos por página) y `detalle` (un avistamiento; si el id no existe responde 404).

8. Estadísticas: `estadisticas` solo renderiza el template.

#### Archivos subidos
Cada archivo se guarda en `static/uploads/` con el nombre `<hash del nombre original>_<uuid>.<extensión real>`. Así no hay colisiones y ni se usa el nombre que escribió el usuario.

Mientras que el nombre original se guarda en `registro.nombre_archivo` sanitizado con `secure_filename`.

#### Sesión del voluntario
Flask guarda en la cookie de sesión solo el `id` del voluntario recién registrado para dejar al voluntario preseleccionado en el formulario de avistamiento.

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

El contenido se mantiene igual que en la Tarea 1 debido a que no forma parte de lo pedido en esta tarea: el enunciado deja las funcionalidades de estadísticas (indicadores y métricas) para la siguiente. El único cambio que cabe mencionar es que `estadisticas.html` hereda `base.html` para reutilizar la cabecera y la barra de navegación (carga sus propios CSS y JS en los bloques `head` y `scripts`), no hay conexión con la BD, las estadísticas se siguen alimentando de `data.js`.
 
---