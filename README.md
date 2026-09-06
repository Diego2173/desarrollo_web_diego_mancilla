# READ ME

## Detalles y decisiones hechas en la tarea:

### Overview de los archivos:

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

---
### Decisiones de diseño generales
 
- Todas las validaciones de los campos de los formularios (salvo la validación de hora y los selects) se hacen combinando una expresión regular para validar formato, y la extensión mínima/máxima del input para validar el largo. 
- El listado de avistamientos podría mostrarse como algo que no sea sea una tabla, pero considero que una tabla es una representación clara y suficiente. Calza bien con el requerimiento de filtrar, ordenar y paginar.
- Para las estadísticas, usé Chart.js en vez de graficar todoa a mano por practicidad, es la librería más sencilla que encontré para graficar, y cumple el propósito de forma adecuada.

### `index`
Compuesto por `index.html` + `css/index.css`. Está separado en tres secciones:
1. **Banner**: Lo agregué por porque es algo que veo normalmente al entrar a una página web, qué está para captar la atención; sin el banner la página se vería muy  vacía.
2. **Destacados**: El primer artículo hace referencia a `pages/listadoAves.html`, mientras que "Ave del día" es un placeholder vacío que nació de que generalmente páginas de enciclopedias o similares hay secciones así.
3. **Accesos**: acceso rápido a registro de voluntarios, registro de aves y estadísticas.
Con esta separación, se puede acceder a todas las páginas pedidas en la tarea desde el inicio (de una forma que no sea la barra de navegación).

---
### `registroVoluntarios`

El formulario está compuesto por:
1. Nombre y apellido: inputs de texto, con `minlength="2"`, pero se podría cambiar si hay un mejor largo mínimo.
2. Email: input de tipo `email`.
3. Teléfono: agrupado en dos campo; un select con el código de país (por defecto `+56`) y un input de texto para el número.
4. Dirección: agrupada en región y comuna (selects) y un input de texto para la dirección.

Cada campo usa su `id` y tiene su propio `<span>` de error asociado, en que ambos se obtienen con `getElementById` para poder alternar la clase de error del input y mostrar/ocultar su mensaje de error correspondiente en conjunto, dentro de una misma función (`setInvalidInput`).

El JS está separado en 3 archivos:

1. **`js/dataConst.js`**: Que contiene las constantes hardcodeadas de regiones y comunas y códigos telefónicos.
2. **`js/registroVoluntarios/select.js`**: puebla los `<select>` de región/comuna/código telefónico usando las constantes de `dataConst.js`.
2. **`js/registroVoluntarios/validation.js`**: valida las entradas del formulario mediante:
  - `validateField(value, regex, minlength, maxlength)`: valida cualquier campo de texto contra un regex guardado en un mapa, más un largo mínimo/máximo. Se definió así, para reutilizar la misma lógica de validación en todos los campos de texto del formulario (nombre, apellido, email, teléfono, dirección), sin repetir el mismo código de forma independiente para cada uno.
  - `validateType(value)`: valida que un `<select>` no se haya quedado en su opción por defecto.

---
### `registroAves`

El formulario está compuesto por:
1. Tipo de ave: select poblado desde `tiposAves` (en `dataConst.js`).
2. Nombre de ave: input de texto.
3. Dirección de avistamiento: región, comuna y dirección (mismo patrón que en `registroVoluntarios`).
4. Fecha y hora del avistamiento: Con input de fecha e input de hora.
5. Archivo: input de tipo `file`, acepta foto o video y permite seleccionar varios archivos a la vez.
6. Descripción adicional: `<textarea>`, opcional.

El JS también está separado en 3 archivos:

1. **`js/dataConst.js`**: para usar `tiposAves` y `regionesComunas`.
2. **`js/registroAves/select.js`**: puebla los `<select>` de tipo de ave, región y comuna.
3. **`js/registroAves/validation.js`**: reutiliza `validateField`, `validateType` y `setFieldStyle` de la misma forma que en `registroVoluntarios`. También agrega:
  - `validateTime(timeStr)`: valida el formato de la hora con un regex (`HH:MM`), por separado de la fecha.
  - `validateDate(dateStr, timeStr)`: primero valida la hora, y si es válida, la combina con la fecha en un solo `Date`. Se compara contra la fecha/hora actual y contra una fecha mínima (5 años), puesto que la fecha no puede ser futura ni muy antigua. Se definió así, para tener un solo punto de comparación entre fecha y hora en vez de validarlas como campos completamente independientes, ya que un avistamiento sin ambos datos combinados no tiene mucho sentido temporal. Los 5 años son un poco arbitrarios, pero me pareció razonable definir esta límite.
  - `validateFile(files)`: recorre la lista de archivos seleccionados y valida, para cada uno, que su tipo esté en una lista de extensiones permitidas (`jpeg`, `png`, `webp`, `mp4`, `quicktime`) y que no supere los 20 MB. Se definió así, para permitir múltiples archivos por avistamiento sin dejar pasar formatos no soportados ni archivos excesivamente pesados. Algo que quedó en el tintero es definir un máximo de peso permitido, por ejemplo, que los archivos en total no pueden sumar más que 200 MB. 

---
### `listadoAves`

Muestra una tabla con tipo de ave, nombre, lugar, fecha, hora y si el registro adjunto es foto o video. Incluye:
1. Filtro por tipo de ave.
2. Ordenamiento por fecha, lugar, tipo de ave o nombre de ave (cada uno ascendente o descendente).
3. Paginación (5 avistamientos por página).

El JS carga 3 scripts:

1. **`js/dataConst.js`**: para poblar el filtro de tipo de ave con `tiposAves`.
2. **`js/data.js`**: datos de ejemplo de avistamientos y voluntarios, generados con IA generativa, para poder probar el filtro/orden/paginación sin tener un backend real.
3. **`js/listadoAves/listadoAves.js`**:
  - `populateBirdTypeFilter()`: puebla el filtro, igual que los `populate...` de las páginas de registro.
  - `filterSighting()`: aplica el filtro de tipo de ave seleccionado sobre `sightingData`.
  - `orderSighting(list, criteria, asc)`: ordena la lista según el criterio elegido. Se definió así, para poder reutilizar una sola función de orden en vez de escribir un `sort` distinto por cada columna ordenable. Tiene dos casos especiales: si el criterio es `"place"`, concatena comuna + región (porque "lugar" no es un solo campo del dato); si es `"date"`, concatena fecha + hora (para desempatar avistamientos del mismo día por su hora). En cualquier otro caso, usa directamente `item[criteria]`.
  - `createRow(sighting)`: arma una fila de la tabla, celda por celda.
  - `renderList()`: Realiza todo el renderizado de la tabla.

---
### `estadisticas`

Contiene indicadores y gráficos:
1. Indicadores: cantidad de voluntarios registrados y de avistamientos registrados con el largo (`.length`) de cada arreglo de `data.js`.
2. Gráficos, hechos con **Chart.js**: avistamientos por mes (barras) y voluntarios por región (torta). Se eligió Chart.js en vez de graficar a mano por practicidad, es la librería más sencilla que encontré para graficar, y cumple el propósito de forma adecuada.

La función `countBy(list, key, byMonth)`, se definió así para reutilizar una sola función de conteo en vez de escribir una función distinta para cada gráfico (y se quisiera extender a dibujar más gráficos con facilidad si se quisiera).

Al cargar la página se actualizan los indicadores y se dibujan ambos gráficos.