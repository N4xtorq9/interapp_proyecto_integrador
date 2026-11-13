# InterApp — Proyecto integrador

Aplicación web demostrativa para publicar productos y registrar intercambios.

## Tecnologías
- HTML5
- CSS3
- JavaScript ES Modules
- Bootstrap 5.3
- SweetAlert2

## Estructura
- `index.html`: página de inicio.
- `pages/login.html`: inicio de sesión.
- `pages/registro.html`: registro.
- `pages/dashboard.html`: panel principal.
- `pages/productos.html`: gestión de publicaciones.
- `pages/intercambios.html`: historial de propuestas.
- `css/styles.css`: estilos.
- `js/auth.js`: autenticación y registro de demostración.
- `js/app.js`: lógica del panel, productos e intercambios.
- `js/alert.js`: funciones reutilizables de SweetAlert2.

## Ejecutar localmente
Abre una terminal en la carpeta del proyecto y ejecuta:

```bash
python -m http.server 8000
```

Luego visita http://localhost:8000.

Es necesario usar un servidor local porque el proyecto utiliza módulos JavaScript.

## Prueba de inicio de sesión
Primero crea una cuenta desde «Crear cuenta». Después inicia sesión con el correo y la contraseña registrados.

## Importante: alcance de la demostración
Esta versión almacena usuarios, contraseñas, productos y sesión en `localStorage`. Es solo para fines académicos y pruebas locales. No debe utilizarse en producción ni almacenar contraseñas reales. Para publicar el sistema se requiere autenticación segura y persistencia en un backend o servicio como Firebase/Supabase.

## Actualizaciones incluidas
- Galería/banner de cuatro imágenes en la página de inicio. Agrega `banner-1.jpg` a `banner-4.jpg` en `assets/`.
- En el formulario de productos se carga una imagen desde el dispositivo (máximo 2 MB) y se muestra una vista previa.
- Cada producto incluye el botón «Proponer intercambio». Abre un modal para indicar el producto que se desea recibir y los detalles de la propuesta.
- Las propuestas quedan registradas en «Mis intercambios».

## Logotipos oficiales
Los dos logotipos proporcionados se incorporaron en `assets/`:
- `interapp-logo.png`: versión a color para fondos claros y navegación.
- `interapp-logo-blanco.png`: versión blanca para el panel lateral de autenticación.

## Catálogo público y visualización de imágenes
- Las imágenes de las tarjetas usan `object-fit: contain` para mostrar el producto completo sin recortarlo.
- Al hacer clic en la fotografía, se abre una ventana ampliada (visor modal).
- El panel incluye «Productos de otros usuarios», con búsqueda y botón «Proponer intercambio».
- Para enviar una propuesta, el usuario selecciona uno de sus productos disponibles y escribe un mensaje para el propietario.
- Las propuestas registran quién envía, quién recibe, el producto solicitado y el producto ofrecido; aparecen en «Mis intercambios».

**Alcance de almacenamiento:** los datos continúan guardándose en `localStorage`. Por ello, las publicaciones de otras cuentas se verán cuando esas cuentas hayan creado sus productos en el mismo navegador y perfil. Para que usuarios de diferentes computadores o celulares compartan el catálogo y reciban propuestas en tiempo real, se debe conectar un backend o base de datos compartida (por ejemplo, Firebase o Supabase).

## Respuesta a propuestas de intercambio
- En «Mis intercambios», el propietario del producto ve los botones «Aceptar» y «Rechazar» para propuestas pendientes que recibió.
- Al responder, se actualiza el estado de la propuesta y se crea una notificación dirigida al usuario que la envió.
- El usuario que envió la propuesta verá un aviso SweetAlert2 la próxima vez que abra InterApp en el mismo navegador.
- Las propuestas enviadas muestran su estado: Pendiente, Aceptada o Rechazada.

**Nota:** esta notificación local funciona en el mismo navegador/perfil porque el prototipo usa `localStorage`. Para notificaciones entre dispositivos o en tiempo real, se requiere backend/base de datos compartida y un canal de notificaciones.

## Cierre del intercambio al aceptar
- Al aceptar una propuesta, ambos productos involucrados pasan al estado `Intercambiado`.
- Los productos intercambiados dejan de aparecer en las publicaciones activas y en el catálogo de productos disponibles.
- Se conserva el registro histórico de la propuesta con estado `Aceptada`.
- El usuario que envió la propuesta recibe una notificación SweetAlert2 la próxima vez que ingrese al sistema en el mismo navegador.
- Las demás propuestas pendientes que involucren alguno de esos dos productos pasan a `No disponible`, evitando que un producto se intercambie más de una vez.
- Si se rechaza, los productos no cambian de estado y continúan disponibles.

## Campana de notificaciones
- Se agregó una campana en la barra superior de Panel, Productos e Intercambios.
- El contador naranja indica cuántas notificaciones están sin leer.
- Al abrir la campana se muestra el listado de notificaciones, incluida la confirmación de aceptación o rechazo de propuestas.
- Al seleccionar una notificación se marca como leída y se actualiza el contador.
- La campana consulta el almacenamiento local y actualiza el contador si otra pestaña del mismo navegador registra una notificación.

## Corrección de botones Guardar producto y Cerrar sesión
Se corrigió el orden de inicialización del centro de notificaciones: la lista podía intentar usar `escapeHtml` antes de que estuviera declarada y detener la ejecución del resto de `app.js`, impidiendo registrar los eventos de Guardar producto y Cerrar sesión. Ahora las notificaciones se renderizan después de inicializar sus dependencias. También se añadió una confirmación alternativa para cerrar sesión si falla SweetAlert2.

## Slider de banners en la página de inicio
- Se incorporó un carrusel automático de cuatro banners en la sección de galería de la página principal.
- Las imágenes cambian cada 5,5 segundos, con transición suave.
- Incluye controles para avanzar/retroceder e indicadores para ir directamente a cada banner.
- El movimiento se pausa al pasar el cursor y permite gestos táctiles en dispositivos móviles.
- Las cuatro imágenes están en `assets/banner-01.webp` a `assets/banner-04.webp`. Para reemplazarlas, conserva esos nombres o actualiza las rutas en `index.html`.
