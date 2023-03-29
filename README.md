# wiki

Contruida con [Docusaurus](https://docusaurus.io/), es el lugar donde vive nuestra documentación y blog.

## Instala dependencias

``` sh
npm install
```

## Arranca en local

``` sh
npm run start
```

Arranca un servidor local con hot reload.

Puedes consultar:

- http://localhost:3000/
- http://localhost:3000/__docusaurus/debug

## Build

``` sh
npm run build
```

Genera el sitio estático en la carpeta `.build`. Puedes usar `$ npm run serve` para servirlo en tu equipo.

## Docker

``` bash
# Construye la imagen
docker build -t wiki .
# Arranca el docker en el puerto 8081
docker run --rm -p 8081:80 -t wiki
```