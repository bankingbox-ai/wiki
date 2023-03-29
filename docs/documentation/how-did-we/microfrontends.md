# Micro-frontends

Los microfrontends (inspirados en los microservicios) son un tipo de arquitectura donde se divide una
aplicación web en diferentes módulos o funciones individuales.

Son autónomas, permiten flexibilidad y velocidad a los equipos de desarrollo.

## Contexto

Contexto aquí ...

## Microfrontend: mf-lendaas.com-documentation

Uno de nuestros primeros microfrontends creados en Lendaas, ha sido nuestra documentación, la cual fue
desarrollada con tecnología [Docusaurus](https://docusaurus.io/). Esta contiene nuestra wiki y nuestro blog.

Al repositorio lo hemos llamado *mf-lendaas.com-documentation*.
Cambiamos el nombre en package.json y readme.

## Creación repositorio raíz para micro-frontends

Al repositorio lo llamamos *mf-lendaas.com-app-shell*.
[Ver repo](https://github.com/lendaas/mf-lendaas-com-app-shell)

Generamos un root-config con el siguiente comando:

``` bash
npx create-single-spa --moduleType root-config
```

Hacemos el paso a paso de single-spa con las siguientes opciones:

- npm: yes
- typescript: yes
- single-spa Layout Engine: yes
- Organization name: Lendaas

Sacamos el Husky por molesto.

Instalar la extensión de chrome *Single-spa Inspector*
disponible [acá](https://chrome.google.com/webstore/detail/single-spa-inspector/emldbibkihanfiaiaghebffnbahjcgcp/related)
.

## Despliegue

- Creamos directorio `.circleci` en la raíz del repositorio
- Creamos el archivo [`config.yml`](https://github.com/lendaas/mf-lendaas-com-app-shell/blob/main/.circleci/config.yml)
- Agregamos el
  archivo [`get-aws-variables.sh`](https://github.com/lendaas/docs-lendaas-com/blob/main/.circleci/get-aws-variables.sh)
  en el directorio `.circleci`, copiándolo de un repositorio existente
- Creamos el archivo `template.yml` en la raíz del repositorio

## Desplegar repositorio en prod

Realizamos las siguientes configuraciones en el archivo *config.yml*:

- Modificamos la ruta a *dist* dependiendo de la carpeta que nos contruya el build en el run name: *upload build*.

- Sacamos la configuración de Cypress, por lo que debemos eliminar el stack manualmente.

## (Deprecado) Crear nuestro primer micro-front

:::caution Atención
Estos pasos no nos funcionaron. Finalmente usamos `vue-cli-plugin-single-spa` para inicializar el repositorio.
:::
Creamos un nuevo repo (mf-lendaas-com-header) con los siguientes comandos:

``` bash
npm create vite@latest
```

- Project Name: mf-lendaas-com-header
- Elegimos: Vue
- Elegimos Typescript

``` bash
npm i
npm i --save-dev @node/types
npm i -D eslint
npm install --save single-spa-vue
```

- Agregamos en el archivo vite.config.ts código para que use localhost y no 127.0.0.1
- Agregamos soporte para usar variables de entorno en vite.config.ts
- Inicializamos lint `./node_modules/.bin/eslint --init`
- Agregamos el script `lint: "eslint"` al package.json
- Actualizamos main.ts para que utilice single-spa
- Agregamos el archivo main-standalone.ts y un script en al package.json para ejecutar en modo standalone.

Configuramos el `vite.config.ts`: ejemplo [acá](https://github.com/joeldenning/vite-single-spa-example)

## Importar modulos desde el repositorio root usando Module Federation

Nos estamos basando en la configuración
de [este repositorio](https://github.com/joeldenning/vite-single-spa-root-config/blob/main/src/index.ejs).
Desde este repositorio tomamos el archivo `org-root-config.js`.

Finalmente, no pudimos usar Vite y Module Federation.
Lo que utilizamos fue Webpack y ImportMaps, que es lo que viene por defecto con `vue-cli-plugin-single-spa`.

## Referenciar *assets* estáticos

Dado que los micro frontends quedan insertos en un repositorio *root*, las referencias a *assets* estáticos, tales como
imágenes, no funcionan correctamente.
La solución es entregarle al componente Vue un `prop` llamado `assetPath` en el archivo `main.ts`:

```ts
const vueLifecycles: SingleSpaVueLifecycles = singleSpaVue({
  createApp,
  appOptions: {
    render() {
      return h(App, {
        props: {},
        // @ts-ignore
        assetPath: this.assetPath,
      });
    },
  },
  handleInstance: (/* app */) => {
    // app.use(router);
  },
});
```

## Instalar vue-router

El manejo de rutas se hace directamente desde cada micro-frontends

Instalamos vue-router en cada repositorio micro-front que lo necesite.

router/index.ts:

```ts
import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
  { path: '/', component: () => import('@/pages/Index.vue') },
  { path: '/onboarding', component: () => import('@/pages/Onboarding.vue') },
];

export default createRouter({
  history: createWebHashHistory(),
  routes,
});
```

Main.ts:

```ts
import router from '@/router/index';

const vueLifecycles: SingleSpaVueLifecycles = singleSpaVue({
  handleInstance: (app) => {
    app.use(router);
  },
});
```

## Resolviendo problemas con CORS

Dado que los recursos que cargamos usando micro frontends pueden provenir de distintos orígenes (por
ejemplo, `lendaas.com`, `cdn.lendaas.com` o `www.lendaas.com`), el navegador podría tener problemas para cargar estos
recursos por las reglas CORS.
Cuando empezamos a alojar nuestras propias fuentes en el CDN, empezamos a tener problemas para cargarlas.
En la consola nos mostraba el
error `Refused to load the font '<URL>' because it violates the following Content Security Policy directive: "default-src 'self' https: localhost:*". Note that 'font-src' was not explicitly set, so 'default-src' is used as a fallback.`

En el repositorio `mf-lendaas-com-app-shell` archivo `index.ejs` se debe actualizar la siguiente línea con los valores
necesarios:

```html

<meta http-equiv="Content-Security-Policy"
      content="default-src 'self' https: localhost:*; script-src 'unsafe-inline' 'unsafe-eval' https: localhost:*; connect-src https: localhost:* ws://localhost:*; style-src 'unsafe-inline' https:; object-src 'none';">
```

## Creando el repositorio `mf-lendaas-com-pricing`

1. Crear repositorio en GitHub
2. Crear `.nvmrc`: `node -v > .nvmrc`
    - Estamos usando la versión v16.17.1
3. Instalar Vue en el repo: `vue create . --merge`
    - Requiere tener previamente instalado Vue CLI de forma global: `npm i -g @vue/cli`
    - Manually select features:
        - Seleccionar Babel, TS, Linter, Unit, E2E
        - Vue 3.x
        - Class-style component syntax? **No**
        - Babel? **Yes**
        - Airbnb
        - Lint on save
        - Jest
        - Cypress
        - In dedicated config files
        - Save preset > `lendaas-mf`
4. Agregar con el CLI de Vue: `vue add single-spa`
5. Configurar el `libraryTarget` en el proyecto:

   ```typescript
     // vue.config.js
   const { defineConfig } = require('@vue/cli-service');
   
   module.exports = defineConfig({
     ...,
     configureWebpack: {
       output: {
         libraryTarget: 'system',
       },
     },
   });
   ```

6. Configurar test para que funcionen sin el vue-cli-service , editando el archivo `package.json`

     ```json
   {
     "scripts": {
       ...,
       "test:unit": "jest",
       "test:e2e": "cypress open"
     }
   }
     ```

7. Instala y configura Pinia

    - `vue add pinia`
    - En el `main.ts` con `single-spa`

    ```typescript
    import { createPinia } from "pinia";
    const vueLifecycles: SingleSpaVueLifecycles = singleSpaVue({
      createApp,
      appOptions: {
        render() {
          ...
        }
      },
      // instalamos pinia en la aplicación de vue
      handleInstance: (app) => {
        app.use(router);
      }
    });
    ```

8. Configuramos los tests y el archivo config.yml para el despliegue

## Micro-frontend Pricing

Para utilizar class recordar que tenemos que separar cada argumento en una línea, en el caso del mf pricing creamos una
clase Service que pretende tener un método recursivo que nos permita obtener el total de los servicios seleccionados con
su precio.

El servicio tendrá los siguientes datos:

- forced
- conversionIndicator
- totalFixed
- maxVariable

Las pruebas se realizan sobre ```PricingCalculator```
