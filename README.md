# READ ME
 
## Detalles y decisiones hechas en la tarea:
 
### Overview de los archivos:
 
```
├-- app.py                          # Punto de entrada de la aplicación Flask (rutas)
├-- requirements.txt                # Requerimientos del proyecto
│
├-- database/
│   ├-- db.py                       # Modelos (SQLAlchemy) y funciones que interactúan con la BD
│   ├-- load_tables.py              # Script de carga inicial de datos
│   ├-- tarea2.sql                  # Schema y tablas principales
│   ├-- aves.sql                    # Script con información de aves
│   ├-- region-comuna.sql           # Script de regiones y comunas de Chile
│   └-- tabla-comentario.sql        # Tabla `comentario` (Tarea 3)
│
├-- utils/
│   └-- validation.py               # Validaciones por el lado del servidor
│
├-- static/                         # Archivos estáticos
│   ├-- css/                        # Mismos 5 archivos de la Tarea 1 (index, form, listado, estadisticas, registroExitoso)
│   ├-- js/
│   │   ├-- comunas.js              # Pide las comunas de una región a /api/comunas/<id> y llena el select
│   │   ├-- dataConst.js            # Códigos telefónicos hardcodeados
│   │   ├-- registroVoluntarios/
│   │   │   ├-- select.js           # Puebla el select del código telefónico
│   │   │   └-- validation.js       # Validación del formulario de voluntarios
│   │   ├-- registroAves/
│   │   │   └-- validation.js       # Validación del formulario de avistamiento
│   │   ├-- listadoAves/
│   │   │   ├-- listadoAves.js      # Hace clickable cada fila del listado
│   │   │   └-- comentarios.js      # Valida, envía (XHR) y lista los comentarios de un avistamiento
│   │   └-- estadisticas/
│   │       └-- estadisticas.js     # Pide los datos por XHR y dibuja los gráficos con Flot
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

Se agregó `tabla-comentario.sql` que crea la tabla `comentario` en la misma base `tarea2` y `static/js/listadoAves/comentarios.js` para el manejo de los comentarios.

---
### Decisiones de diseño generales
 
Se refactorizaron las rutas `/voluntarios` y `/avistamientos/nuevo` de `app.py`, que en la Tarea 2 atendían GET y POST en una sola función. Ahora cada método tiene su propia función con la misma URL (`new_voluntario` y `create_voluntario`, `new_avistamiento` y `create_avistamiento`), para separar responsabilidades y hacer el código más legible.
 
Se eliminó `static/js/data.js` porque ya no se utiliza. Similarmente `static/js/dataConst.js` se actualizó para solo contener los códigos telefónicos.

#### Comentarios

- En **`database/db.py`** se agregó el modelo `Comentario` (tabla `comentario`), las funciones `get_comentario(avistamiento_id)` que devuelve los comentarios de un avistamiento y `create_comentario(avistamiento_id, nombre, texto)` que inserta un comentario.

- En **`utils/validation.py`** se agregaron dos expresiones regulares para validar el nombre y el texto de un comentario (`COMMENT_NAME_RE` y `COMMENT_TEXT_RE` respectivamente). Ambas están hechas para usarse con el `validate_field` ya existente.

- En **`app.py`** se agregó `list_comentarios` (GET), que devuelve en JSON los comentarios de un avistamiento, y `create_comentario` (POST), que valida el nombre y el texto con `utils/validation.py` e inserta con `db.create_comentario`.

- En **`detalle.html`**, **`static/js/listadoAves/comentarios.js`** y **`static/css/listado.css`**: en el archivo html se agregó la lista de comentarios y el formulario para agregar uno. En el archivo javascript se implementó mediante XHR la lógica para validar el formulario antes de enviarlo, enviar el comentario por POST y pedir la lista por GET, sin recargar la página. Si el servidor rechaza el comentario (400), se muestran los errores junto a cada campo y el formulario se mantiene con lo escrito. Y finalmente en el archivo css se agregaron los estilos de la lista de comentarios.

Notas:
- `create_comentario` asigna la fecha y hora del momento del `INSERT` con `datetime.now()` (la fecha la pone el servidor).
- Se replican las reglas de validación en el navegador y en el servidor mencionadas en el enunciado.
- Sobre las entradas maliciosas los comentarios se insertan en la página con `textContent` y no `innerHTML`.

**Rutas**
 
| Ruta | Método | Descripción |
|---|---|---|
| `/avistamientos/<id>/comentarios` | GET | JSON con los comentarios del avistamiento |
| `/avistamientos/<id>/comentarios` | POST | Valida e inserta un comentario; responde JSON (400, 404 o 500 si falla) |

#### Estadísticas

- En **`database/db.py`** se agregaron las funciones `count_voluntarios()`, `count_avistamientos_por_dia()`, `count_avistamientos_por_ave()` y `count_voluntarios_por_comuna()`. La primera es para el indicador de la cantidad de voluntarios y las otras usan `func.count` con `group_by` para los datos de los gráficos.

- En **`app.py`** se agregaron las rutas `/api/estadisticas/...`, que llaman a esas funciones y devuelven en JSON los datos de cada gráfico y de los indicadores. La ruta `estadisticas` sigue solo renderizando el template.

- En **`estadisticas.html`**, **`static/js/estadisticas/estadisticas.js`** y **`static/css/estadisticas.css`**: en el archivo html cada gráfico es un `div` que guarda su URL en `data-url`. En el archivo javascript, por cada gráfico se pide el JSON por XHR (GET) y se dibuja con Flot. Y finalmente en el archivo css se reemplazaron los estilos de Chart.js de la Tarea 1 por los de los contenedores de Flot, la leyenda y el enlace.

Notas:
- El gráfico de líneas agrupa por el día (`DATE(avistamiento.fecha_hora)`) que ocurrió el avistamiento y no el día que se registró (que supongo que es lo pedido por el enunciado).

- El gráfico de torta solo muestra las aves con avistamientos y el gráfico de barras solo muestra las comunas con voluntarios.

- Se mantuvieron los dos indicadores de la Tarea 1 (total de voluntarios y total de avistamientos), pero ahora desde la base de datos.

**Rutas**

| Ruta | Método | Descripción |
|---|---|---|
| `/estadisticas` | GET | Página de estadísticas |
| `/api/estadisticas/indicadores` | GET | JSON con el total de voluntarios y de avistamientos |
| `/api/estadisticas/avistamientos-por-dia` | GET | JSON con la cantidad de avistamientos por día |
| `/api/estadisticas/avistamientos-por-ave` | GET | JSON con la cantidad de avistamientos por tipo de ave |
| `/api/estadisticas/voluntarios-por-comuna` | GET | JSON con la cantidad de voluntarios por comuna |


#### Bibliotecas externas
 
Se cargan desde un CDN en `estadisticas.html`. Corresponden a jQuery y Flot, en que Flot es utilizada para el dibujo de gráficos y jQuery como requisito de Flot. Como se cargan desde un CDN, los gráficos necesitan conexión a internet.

| Biblioteca | Versión | Licencia | Uso |
|---|---|---|---|
| [jQuery](https://jquery.com/) | 3.6.0 (`code.jquery.com`) | MIT | Requisito de Flot |
| [Flot](https://www.flotcharts.org/) | 0.8.3 (`cdn.jsdelivr.net/npm/flot@0.8.3`) | MIT | Gráficos |

De Flot se usan el núcleo y tres plugins: `time` para el gráfico de líneas, `pie` para el gráfico de torta y `categories` para el gráfico de barras.