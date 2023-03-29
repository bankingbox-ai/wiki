---
slug: /
sidebar_position: 1
---

# Bienvenidos

👋 Hola! En esta sección explicaremos cómo usamos y qué encontrarán en la distintas secciones de esta wiki.

## Introducción

Tal como lo expresa nuestro [manifiesto](principles-statement.md), la documentación por defecto siempre será el código fuente y siempre preferiremos tener software funcionado a documentación extensiva.

Sin embargo, hemos considerado que es importante - tanto para nosotros como para los *stakeholders* - compartir elementos que permitan un mejor entendimiento del producto.

## Secciones

El sitio web de Lendaas cuenta con dos grandes secciones para agregar contenido: **wiki** y **blog**. Para poder diferenciar dónde
poner contenido, dejamos los siguientes acuerdos:

- Usaremos la **wiki** para documentar todo lo que sea de naturaleza "objetiva" (framework, acuerdos, guías, PoC, documentación, etc...) y
que sea bueno que alguien lo pueda tomar como una referencia para hacer su trabajo.

- Usaremos el **blog** para documentar todo lo que sea de naturaleza "subjetiva" (opiniones, recomendaciones, prácticas
deseables, etc...), las cuales serán publicadas como `post` dentro de esta sección, con el propósito de fomentar la
discusión, obtener feedback y transparentar a otros cómo trabajamos.

## Escritura

- Todo se hablará en primera persona plural, para tener un lenguaje cercano
- No usamos lenguaje inclusivo, porque no está reconocido por la RAE y porque es muy poco eficiente
- Para que este contenido sea exportable a diferentes motores de markdown, nos aseguramos de escribirlo dando cumplimiento a las normas de estilo más comunes [CommonMark Specification](https://commonmark.org/)
- Código `in-line` para aludir a cosas relacionadas con el código (nombre variables, comandos etc.)
- Para destacar una palabras, usamos **bold** y para otro idioma, *cursiva*
- Bloques de código sólo para código. Para encerrar texto, usar [admonitions](https://docusaurus.io/docs/markdown-features/admonitions)

:::note

Tanto la wiki como el blog son parte del mismo repositorio, por lo que comparten las mismas reglas de escritura

:::

## Edición

Para quienes tengan permiso de edición, usaremos `Linter` en la integración continua del repositorio. Para evitar errores (al menos mientras usemos docusaurus) recomendamos:

- `npm run start` para revisar la wiki en local
- `npm run lint` para monitorear errores de formato
- `npm run lint:fix` para intentar reparar errores automáticamente
- `npm run build` para asegurarte que todo sigue funcionando, especialmente si hiciste un cambio en la estructura de carpetas
- Instalar extensiones que te asistan en el correcto formato de MarkDown en tu IDE. En VSCode, recomendamos [markdownlint](https://marketplace.visualstudio.com/items?itemName=DavidAnson.vscode-markdownlint)
- Si se deja un bloque de código que no alude al lenguaje va a fallar el linter
- Se debe usar una versión de node igual o superior a 16, chequea que sea así escribiendo en la consola:

```js
nvm use 16
```
