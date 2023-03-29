---
sidebar_position: 2
---

# Workflow

Refinamiento ▶ Planning ▶ Desarrollo ▶ Release

## Refinamiento

A continuación un diagrama resumen del proceso propuesto:

<!-- markdownlint-disable MD033 -->
<iframe width="750" height="450" src="https://whimsical.com/embed/5PPDkN1MEKgofoaysX8aqg@7YNFXnKbZALBnBGkAU2Mj"></iframe>

### Paso 1: describir

Un incremento debe tener textos bien redactados, precisos y entendible para que cualquier equipo que quiera tomarlo, pueda hacerlo. Por eso, el equipo que refine debe asegurarse que en su descripción exista una estructura de este tipo (la que además, satiface parte de la [DoR](./game-rules#definition-of-ready)):

- **Título**: debe explicitar la funcionalidad y su *scope*
- **Contexto**: cuál es la situación actual, problemática y la necesidad que se va a atender
- **Outcome**: lista de beneficios a obtener del incremento e indicadores que darán cuenta de eso
- **Arquetipo**: quienes interactuarán con la aplicación, específicamente con el incremento

:::tip
"Te escribo esta carta tan larga porque no he tenido tiempo de escribirte una más corta"

*George Bernard Shaw*, dramaturgo, crítico y polemista irlandés
:::

### Paso 2: dibujar

Lo más importante de este paso es elegir el **tipo de dibujo** (se podría hacer más de uno, pero en refinamiento queremos trabajar en alto nivel lo más eficiente posible) que más ayude a entender mejor el incremento para generar criterios de aceptación.

Dependiendo del tipo de incremento, existen algunas opciones (pueden ser más):

- Si la funcionalidad está cargada al desarrollo de un diseño de una UX, entonces trabajar con una **maqueta de baja fidelidad**
- Si la funcionalidad está cargada a nueva lógica de negocio sobre la que ya existe, entonces trabajar con un **diagrama de flujo**
- Si la funcionalidad es desconocida y compleja, entonces trabajar con un **diagrama de arquitectura**

:::caution
Si la funcionalidad tiene *frontend*, entonces igual debe tener una **maqueta de baja fidelidad** para cumplir con la [DoR](./game-rules#definition-of-ready). Sin embargo, si la UX es sencilla de hacer, se recomienda postergar este trabajo para la planning 2.
:::

### Paso 3: test de aceptación

Dentro del incremento se escriben los criterios de aceptación con la siguiente formato:

```json
DADO: contexto previo del usuario
CUANDO: acción que realiza el usuario y gatilla el incremento
ENTONCES: consecuencia del incremento en el contexto del usuario
```

### Bonus track

Debido al tiempo que toma, no queremos dejar como parte de la `DoR` las sesiones de prueba con usuario final real. No obstante, consideramos los beneficios que puedan aportar y proponemos la siguiente metodología en caso de realizarse:

1. Preparar anteriormente el proptotipo navegable y un mini desafío que tendrá que realizar el usuario.
1. Al comenzar la sesión, explicar contexto, leer junto con el usuario las consignas y responder unicamente preguntas que tengan que ver con el contexto general del ejercicio.
1. Dejar al usuario realizar el desafío de navegación, anotando todas sus reacciones y dudas **sin** responderlas en el momento.
1. Al terminar el ejercicio, preguntar sobre su sensación general, sin hacer preguntas demasiadas enfocadas.
1. Al terminar la sesión se pueden responder todas las dudas anteriores que surgieron durante el ejercicio.

## Planning

### Plannig 1

En la planning nos preguntamos: Qué `eventos` debo registrar para medir si mi incremento:

- funciona desde lo operativo?
- funciona desde el negocio?
- entrega toda la información que el cliente necesita?

El alcance de la publicación de `eventos` es negociable: se puede generar eventos genéricos y postergar la implementación del modelo de lectura.

### Planning 2

1. Reviso que todos debe cumplir la DoR, y tiene criterios de aceptación ya negociados con el PO.
1. Planifico mi sprint. Hago slicing, re-negocio criterios de aceptación, ordeno el valor de la historia, y armo mi estrategia para el sprint.

## Desarrollo

<!-- markdownlint-disable MD033 -->
<iframe width="800" height="450" src="https://whimsical.com/embed/5PPDkN1MEKgofoaysX8aqg@2Ux7TurymLmYku1XESaD"></iframe>

### Preparación

1. Hago `git pull` en el repositorio donde estoy trabajando, para traerme la última versión del código, o `git clone` para traerlo por primera vez
1. Defino `stacks`, repositorios que deben ser levantados para trabajar en mi *feature*
1. Ejecuto tests funcionales contra el `stack`

:::note

- **Supuesto**: existe un sprint backlog construido con items que cumplen con la [DoR](./game-rules#definition-of-ready)
- Los **tests** deberían pasar si no se han hecho cambios. Sino, los corrijo, reviso si es algún problema del `stack`

:::

### Elección de flujo CI/CD

Elijo el tipo de *workflow* a seguir: **regular**, **excepcional** y **hot-fix**, basados en la naturaleza del trabajo que se tiene que realizar.

1. **Regular** (*trunk-based-development*): en dónde la rama principal estará constantemente actualizada y no trabajará con ramas
2. **Excepcional** (*pull-request-strategy*): en dónde se creará una rama
3. **Hot-fix**: se debe arreglar algo urgente y para eso se usa el versionamiento

:::note ¿Porqué?
Revisar lo que recomienda LeSS sobre [continuous integration](https://less.works/less/technical-excellence/continuous-integration#ContinuousIntegration)
:::

### Doble ciclo de testing

1. Escribo mi **criterio de aceptación** como `functional-test`. Este test debería fallar, pues aún no he implementado la funcionalidad.
    - Los criterios de aceptación cuyo código aún no ha sido implementado deben estar en una carpeta aparte (`functional-wip` o `e2e-wip`), para que no corran durante las pruebas en CI/CD.
1. Entro en el ciclo de los `unit-test` para la funcionalidad que quiero implementar:
    1. Escribo el test
    1. Escribo el **mínimo código necesario** para que sólo pase ese test
    1. Refactorizo
    1. Escribo el siguiente test
1. Cuándo pasa el **criterio de aceptación**, muevo los tests funcionales a la carpeta de tests implementados (`functional` o `e2e`), y vuelvo al ciclo de las `functional-test` y respectivas unitarias con el siguiente criterio.

:::caution Importante
El código de ir con *feature-toggle* al inicio para que los clientes puedan comprar la funcionalidad
:::

### Integración continua (CI)

Hago `commit` y `push` durante el doble ciclo de testing según el flujo de CI en que se esté, usando las siguiente estrategias

1. **Double loop directo**: El desarrollo por defecto se hace siempre en la rama principal, *main*.
La posibilidad de romper *main* es alta en este tipo de desarrollo.
La estrategia consiste en hacer `commit`, pero no `push` hasta que estén pasando los `functional-test` y `unit-test` y no se rompa *main* (el *pipeline* QA correrá después de llegar a *main*).
Para evitar ciclos largos sin hacer commit, los `functional-test` cuyo código aún no ha sido implementado quedan en una carpeta *work-in-progress* (con el sufijo `-wip`).
A medida que vamos implementando el código y haciendo que las pruebas pasen, las vamos moviendo a la carpeta de pruebas productivas.
Las pruebas que ya están productivas **nunca** regresan a la carpeta *wip*.
Al hacer push a la rama principal se corren funcionales prod y unitarias. La estrategia sería:
    - `push` el `functional-test` a *main*, pero está aislado del CI (en la carpeta *wip*)
    - `commit` y `push` los `unit-test` y mejoras a a *main*
    - Cuando el `functional-test` sí pasa, lo migro a donde estén los tests que sí son considerados por el CI
    - `push` el `functional-test` a *main*
1. **Double loop en rama**: Si existe una razón de peso para hacerlo (por ejemplo, facilitar trabajo en equipo, o modificar el CI/CD) puedo trabajar en una rama distinta a la principal.
En este caso, puedo hacer `commit` y `push` en cualquier punto sin romper *main*.
Antes de mergear con *main* hay que asegurarse de que las pruebas estén pasando.
Esto es particularmente importante al trabajar en una rama ya que estamos incorporando una mayor cantidad de código a la rama principal, lo que dificulta detectar y corregir potenciales errores.
El *pipeline* de QA debe correr **antes** de llegar a *main* y, si está todo bien, se hace `merge`. Finalmente el *pipeline* vuelve a correr **después** de haber sido "mergeado"
1. **Hot-fix**: El *hot-fix* consiste en realizar un *rollback* momentáneo, por ejemplo, si hay algún bug productivo importante.
Esto permite devolver la funcionalidad al producto sin perder código.
Mientras el *hot-fix* está desplegado, los desarrolladores trabajan en una rama tratando de arreglar el problema, y mergean y despliegan su rama cuando el problema esté solucionado.
Esto es una situación excepcional y requiere constante comunicación de los equipos.
Para realizar un hotfix, **se debe empujar un tag de versionamiento que termine en `-hotfix` o `-hotfix-NN`** (donde `NN` es un número), por ejemplo, `v1.2.3-hotfix`.
Esto desplegará un pipeline que, de pasar correctamente las pruebas, pondrá el *hot-fix* en producción.

:::tip
La recomendación siempre va a ser usar la CI/CD lo más frecuentemente posible
:::

:::info Información
Cuando decimos "romper" la rama principal, nos referimos a alguno de los siguientes casos:

- Que no pasen todas las pruebas en el CI/CD.
- Que el software no se construya o despliegue correctamente.
:::

### Versionamiento

Cuando tocamos a un componente productivo para agregar nueva funcionalidad, evaluamos si podemos crear una nueva versión ya que en un despliegue automático en producción, este versionamiento se haría **de forma automática**.

Dado lo anterior, es necesario asegurarse que:

- El paso a producción del componente no quiebre el antiguo, hasta sea conveniente jubilar la versión anterior
- En caso contrario, bajar el producto (y poner un mensaje)

## Release

Antes de comenzar desarrollando es imperativo definir bien cuáles son las funcionalidades, pues cada una de ellas debe liberarse con su respectivo `feature-toggle`, dado que forman parte de planes que pueden o no incluirlas.

También es necesario definir los permisos de usuario (`user-resources`), sus agrupaciones (`user-features`) y roles (conjunto de funcionalidades).

Lo esperable es que antes de comenzar el desarrollo, todos estos toggles estén definidos y setteados en la **Base de Datos** correspondiente.
