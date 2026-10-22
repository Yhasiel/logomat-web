# Web oficial de LOGOMAT

Sitio estático preparado para publicarse en GitHub Pages. No requiere ChatGPT, inicio de sesión, servidor, base de datos ni instalación de dependencias.

## Contenido

- `index.html`: estructura completa de la web.
- `styles.css`: identidad visual, animaciones y adaptación a celular.
- `script.js`: navegación, calidades, portafolio, cotizador y formularios.
- `assets/`: logotipo oficial y fotografías optimizadas.

## Antes de publicar

Abre `script.js` y reemplaza esta línea con el número oficial de LOGOMAT:

```js
const WHATSAPP_NUMBER = "";
```

Debe quedar en formato internacional, sin `+`, espacios ni guiones. Ejemplo:

```js
const WHATSAPP_NUMBER = "51999999999";
```

## Publicar en GitHub Pages

1. Crea un repositorio público llamado `logomat-web`.
2. Sube **todo el contenido de esta carpeta** a la rama `main`.
3. En GitHub, abre `Settings` → `Pages`.
4. En `Build and deployment`, elige `Deploy from a branch`.
5. Selecciona la rama `main`, carpeta `/ (root)` y pulsa `Save`.
6. Espera a que GitHub muestre el enlace publicado.

El enlace tendrá una forma similar a:

`https://yhasiel2202-art.github.io/logomat-web/`

## Importante

- El cotizador prepara una solicitud; no inventa ni calcula precios.
- Las reseñas visibles son espacios para contenido verificado, no testimonios falsos.
- Para reemplazar una fotografía, conserva el nombre del archivo o actualiza su ruta en `script.js`.
