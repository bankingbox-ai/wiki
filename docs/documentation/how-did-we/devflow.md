# Flujo de desarrollo

En el repo `mf-lendaas-com-home`:

## Configurando test unitarios

### Primera prueba

1. Instalamos:

    ```shell
    npm i -D @vue/cli
    npm i -D @vue/cli-plugin-unit-jest
    ```

2. Creamos el archivo para los test `App.spec.ts`
3. Inicializamos jest

    ```shell
    ./node_modules/.bin/jest --init
    ```

    Luego de ejecutar el proceso se crea el archivo `jest.config.ts`

4. No funciona como se espera, desinstalamos todo

### Segunda prueba

1. Ejecutamos `vue add unit-jest`
2. Agregamos los scripts en package.json
3. Funciona!

## Configurando test e2e

```shell
npm i -D cypress
```

### Configura Cypress

```shell
touch cypress.config.js
```

```js
const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    video: false,
    supportFile: false,
    baseUrl: 'http://localhost:8081',
    specPattern: 'tests/e2e/**/*.spec.js',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    }
  },
});
```

### Configura eslint

```js
env: {
  ...,
  jest: true
}
```

### Para solucionar el error 'cy is not defined'

En el archivo eslintrc.js agregar `jest` dentro de `env` y `cy` dentro de `globals`, ambos en `true`:

```js
 globals: {
    cy: true,
  },
 env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true,
  },
```

### Para configurar mobile en cypress

En cypress.config.js agregar:

```js
   viewportWidth: 360,
   viewportHeight: 800,
```

### Definiendo el script en `package` para correr las pruebas

Definimos los scripts para poder correr todas las pruebas en local, y para que sólo corran las pruebas que no estén pendientes (`wip`, *work in progress*). Dentro del archivo `package.json`:

```json
# TODO copiar desde repo home, la nueva version la trabajó Thomas
```

:::note Nota
El separar las pruebas en `e2e` y `e2e-wip` sigue los lineamientos que definimos en [Doble ciclo](docs/how-do-we/2-increase-value/workflow.md)
:::

Ahora podrás visualizar las pruebas tanto en local como en producción

### Configurando YML

Agregar la instancia ``orbs``

```json
orbs:
   cypress: cypress-io/cypress@2.2.0
```
