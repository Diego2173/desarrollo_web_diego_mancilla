# READ ME
 
## Detalles y decisiones hechas en la tarea:
 
### Overview de los archivos:
 
```
├-flask-app/                                    # Proyecto de tareas anteriores
├-springboot-app/
  ├-- pom.xml
  └-- src/main/
      ├-- java/com/tarea4/tarea4/
      │   ├-- Tarea4Application.java            # Punto de entrada
      │   ├-- controller/
      │   │   └-- AvistamientoController.java   # Endpoints de búsqueda (GET) y de evaluación (POST)
      │   ├-- models/                           # Entidades JPA
      │   │   ├-- Ave.java
      |   |   ├-- Comuna.java
      |   |   ├-- Voluntario.java
      |   |   ├-- Avistamiento.java
      |   |   ├-- Nota.java
      │   │   └-- AvistamientoResultado.java    # Fila que devuelve la búsqueda (record)
      │   └-- repositories/
      │       ├-- AvistamientoRepository.java   # Consulta de búsqueda con promedio
      │       └-- NotaRepository.java           # Guardar una nota y calcular el promedio
      └-- resources/
          ├-- application.properties            # Conexión a MySQL
          └-- static/
              ├-- index.html                    # Página del buscador
              ├-- css/buscador.css
              └-- js/buscador.js                # Código javascript para la búsqueda mientras se escribe y evaluación de nota
```

Se agregó `tabla-nota.sql` a la base de datos tarea2, que no está presente en el overview como en las entregas anteriores

---
### Decisiones de diseño generales
 
Solamente se agregó lo necesario para el funcionamiento de la tarea. Por ejemplo, no se crearon `models` (clases) de Region o Comentario, o también, no se mapearon columnas que no son necesarias para el buscador (como lo es el email del voluntario).

#### Buscador:

- En **`AvistamientoRepository.java`** una sola consulta busca el texto en el nombre del ave, del voluntario o de la comuna con `like`. En el caso particular de la comuna, como se guarda como lugar ~ region, comuna, calle. Por eso se une con la tabla comuna con a.lugar like concat('%, ', c.nombre, ', %'), para obtener SOLO la comuna del avistamiento.

- En **`AvistamientoController.java`** la ruta GET recibe el texto, lo recorta y, si queda vacío, devuelve una lista vacía. Los caracteres `%`, `_` y `!` del texto se escapan para que se busquen como texto y no como comodines del `like`.

- La búsqueda y resaltado ignora mayúsculas o letras con tilde por simplicidad.

#### Nota:

- Bajo la sorpresa de nadie, en **`Nota.java`** y **`NotaRepository.java`** se mapeó la tabla `nota`. Observar que el `id` lo genera MySQL.

- En **`AvistamientoRepository.java`** el promedio se calcula en la base de datos con `avg` y un `left join` con `nota`. De esta forma, un avistamiento sin notas aparece con promedio `null`, que la página muestra como `-`.

- En **`AvistamientoController.java`** la ruta POST valida la nota bajo las reglas del enunciado, guarda una nota nueva y devuelve el promedio actualizado.

- En **`js/buscador.js`** el botón "Evaluar" de cada fila pide la nota con `prompt`, la envía con `fetch` (POST) y cambia solo la celda del promedio, sin recargar la página. Pensé en hacerlo con un formulario para poner un input de texto en cada fila de la tabla de resultados, pero por simplicidad un prompt es más sencillo de implementar y tiene la misma funcionalidad.

**Rutas**
 
| Ruta | Método | Descripción |
|---|---|---|
| `/` | GET | Página del buscador (`index.html`) |
| `/api/avistamientos/search?q=<texto>` | GET | JSON con los avistamientos cuyo ave, voluntario o comuna contiene el texto (lista vacía si no hay texto) |
| `/api/avistamientos/<id>/nota` | POST | Recibe `nota` (entero del 1 al 7); responde el promedio actualizado (400 si la nota no es válida, 404 si no existe el avistamiento) |