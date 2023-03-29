# Docusaurus

Cómo implementamos la herramienta que usamos para construir esta wiki.

[Aquí](https://docusaurus.io/docs/markdown-features) puedes ver las posibilidades que ofrece su implementación de MarkDown.

## Levantar Wiki Estática Docusaurus

Paso a paso:

- En GitLab creamos un nuevo repo llamado "Wiki", que clonamos posteriormente de forma local.
- Docusaurus tiene un proceso de instalación por defecto: [https://docusaurus.io/docs/next/installation](https://docusaurus.io/docs/next/installation)
- Entre los requerimientos, esta trabajar con la version 16 de Node.
- Luego, corremos el paso "Scaffold project website", que permite instalar el esqueleto del proyecto:
`npx create-docusaurus@latest my-website classic`
- El archivo docusuarus.config.js, tiene configuraciones varias para personalizar el titulo, favicon, el navbar, los contenidos etc.
- Creamos el archivo `gitlab-ci.yml` para describir el plan de despliegue con un stage llamado 'pages' que permite subir artefactos estaticos en una carpeta '/public'.
- Creamos en el proyecto la carpeta "Acuerdos" que contendra todos los acuerdos Lendaas. Dentro podemos crear multiples archivos .md que se van indexando y agregando solos al menú.
