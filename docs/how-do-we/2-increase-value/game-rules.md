---
sidebar_position: 1
---

# Reglas del juego

Cómo construímos nuestro framework

## Incrementos

### Qué son

Entendemos por __incremento__ a un conjunto de items del _backlog_ (PBI) que al ser liberados a usuarios producen _outcome_ para la compañía.

### Valor

Cuantificaremos el valor de un incremento considerando las siguientes dimensiones:

- __Temporalidad__: crece o disminuye su valor dependiendo de si fue construído en el momento que tenía más prioridad y cuánto demoró en ser liberado a usuarios
- __Eficiencia__: tiene más valor si puede llegar a más usuarios (varios paises) en un mismo ciclo (resolver varios desafios utilizando misma solución)
- __Calidad__: tiene más valor si cuando es liberado no deja `bugs`. Éstos pueden provenir por un mal diseño (se hace cargo de pocos caso de uso) o por mala factura (código mal hecho, o que no responde a la funcionalidad)
- __Aterrizaje__: tiene más valor si tiene una buena y fácil adopción por parte de los usuarios, lo que redunda en un buen uso y pocas consultas/reclamos
- __Rentabilidad__: tiene más valor si logra mover el _P&L_ del negocio

:::note Ejemplo de rentabilidad
Si una compañía tiene varias líneas de negocio y una tuvo mejor desempeño que la otra (por ejemplo, resultado anual en colocaciones), entonces los incrementos que aportaron a esa línea tienen más valor que los que aportaron en otras
:::

### Definition of ready

Un incremento podrá ser construido si solo sí está _ready_. Esto significa que:

- tiene un _outcome_ escrito y definido el indicador del `dashboard` que lo medirá
- tiene un `archetype` de usuario definido y explícito en su descripción
- tiene criterios de aceptación que fueron concebidos como [test orientados a la funcionalidad](./testing-101#a-orientados-al-funcionamiento-black-box)
- tiene explícito cómo interactúan los PBI a través de un _story-mapping_
- tiene una maqueta de baja fidelidad del diseño discutida entre interesados
- tiene un [_user-flow-diagram_](https://creately.com/blog/diagrams/user-flow-diagram/) consensuado que dé cuenta de la `UX`
- Es unánime de que cabe en un sprint

:::note

- La definition of ready aplica a los incrementos, lo cual asume como condición necesaria que los PBI estén ready; más no como condición suficiente
- Los test pueden estar escrito al menos en `pseudo-codigo`
- La naturaleza exacta del test será determinado por el desarrollador al momento
- Los criterios de aceptación deben ser acordados con el Product Owner

:::

### Definition of done

Un incremento estará terminado cuando todos sus PBI estén _done_. Esto significa que:

- no puede tener deuda funcional (debe pasar los criterios de aceptación)
- debe ser desplegado a través de la CI/CD desde el `main-line`
- todos los archivos deben tener un coverage de pruebas unitarias = 100%
- debe quedar en producción con un `feature-toggle` para que el PO lo pueda liberar
- debe contar con los `events` necesarios para alimentar dashboards e informes
- no viola ninguna __regla del juego__

:::tip

- Buscaremos que esta definición quede programada en nuestra CI/CD
- Para cumplir con el coverage del 100% es muy importante hacer TDD, sino será muy costoso

:::

### _Releases_

- Es el PO quien debe generar un _release_ desde dentro del producto (ver _workflow_)
- Debe venir asociado a el rol
- Toda funcionalidad de usuario debe verse reflejada en el panel de administración del cliente, por lo que la activación del _toggle_ debe gatillar ambas cosas
- Debe quedar potencialmente disponible para todos los clientes y circunscrita a un plan
- Debe quedar la documentación publicada

## Cómo construímos

Para mantaner la adaptabilidad del producto antes los problemas del escalamiento, decidimos mitigar la entropía y facilitar el acceso de los devs a las distintas componentes del sistema a través de la estandarización de nomenclaturas, la homogenización de patrones y tecnologías.

### Nomenclatura

<!-- markdownlint-disable MD033 -->
| Tema | Component | Nomenclatura | Ejemplo |
|---|---|---|---|
| Nombre  <br/> repositorios | Git | {tipo_de_api} - <br/> {nombre_de_entidad_etapa} | Ej.1: orchestator-simulator <br/> Ej.2: entity-simulations (plural) |
| Feature  <br/> toggles | Backend | {cliente} / <br/> {feature} / <br/> {type} | abastible/evaluation/automatic |
| User  <br/> resources | Backend | {nombre_api} / <br/> {ruta_REST} / <br/> {:método_http}| Ej.1: internal-backend/operations/bulk/:POST <br/> Ej.2: simulator-backend/prospects/status/:GET |
| User  <br/> feature | Data Base | {feature}| Ej.1: remesas <br/> Ej.2: cobranza |
| End  <br/> points | Frontend <br/> Backend | Usaremos estandar REST | [ver referencia](https://restfulapi.net/) |
| Componentes <br/> visuales | Design <br/> system |  {cliente} - <br/> {tipo_de_componente} | Ej.1: creditu-buton <br/> Ej.2: creditu-input |
| APIs <br/> response | Backend | [API JSON](https://jsonapi.org/examples/) | `code`,`data`, `message` |

:::note

- Puedes encontrar más información sobre los tipo de APIs definidas en la sección arquitectura
- Las API de tipo entity van en plural

:::

### Programming

- Para facilitar el trabajo colaborativo con el tipado fuerte, estandarizar nuestro código e incentivar a que los equipos incrementen cualquier sección del producto; trabajaremos todo en `typescript`
- El creador de un repositorio estipulará el paradigma de programación y dejará claramente señalados sus motivos en el _readme_ y debe ser respetado por los demás programadores que colaboren (revisar este artículo en el blog (@todo))
- Los archivos de código no deben superar las 100 líneas
- Todas las operaciones matemáticas y sobre fechas estarán concentradas en sus respectivas `library`
- Las interfaces o esquemas de las entidades de negocio más relevantes se deben compartir mediante `library`
- Los `traces` deben hacerse mediante `library`
- Para mantener un código eficiente, no debe haber duplicidad de código (se chequeará en la CI/CD)
- Las excepciones - y sus respectivos `try`/`catch` - se evitarán o atajaran en la capa más temprana. A las capas superiores se comunicarán como errores en la respuesta

    ```js
    const makeCallWithAxios = async (callback): Promise<any> => {
      let result = {},
        error;
      try {
        result = (await callback).data;
      } catch (err) {
        error = err.response.data;
      }
      return { result, error };
    };
    ```

    ```js
    const callback = axios.post(`${apiBaseUrl}risk-evaluation`, body);
    const { result, error } = await makeCallWithAxios(callbackW);
    expect(error).toBe(undefined);
    ```

:::tip

- Es importante tener presente que queremos ser adaptables, y para ello es importante minimizar las tecnologías (ver qué dice [LeSS](https://less.works/less/technical-excellence/architecture-design#ArchitectureDesign) sobre multiples tecnologías)
- Somos concientes de que el negocio evoluciona y que eventualmente esto puede ser reevaluado. Podría ser que en algún punto necesitemos visión computacional y lleguemos a la conclusión de que el lenguaje idóneo para eso es Python

:::

### Events

#### Principios Básicos

- Toda nuestra data debe estar siempre disponible para el cliente
- El acceso a la data será sólo a través del producto
- No generamos analítica o reportería a partir de la data transaccional
- El scope de `events` es registrar interacciones de usuarios con el producto y sus consecuentes cambios en el sistema

:::tip Corolarios

- Cuando sea necesaria su incorporación, las conexiones a terceros se considerarán parte del producto.
- La medición del performance de la infraestructura del producto escapa del ámbito de `events` y podrá ser abordada mediante otras herramientas

:::

#### Patrones

- Nos basamos en dos patrones de diseño orientados a eventos: CQRS y Event-Sourcing
- Seguimos los principios del modelo arquitectónico Hexagonal
- Orientamos el desarrollo por dominios DDD
- Evitamos el monolito. Generamos tantos `events-consumers` como dominios empresa/servicio/entidad lo amerite

:::note
Acordamos mantener estos conceptos como guías teóricas para mantener y continuar desarrollando el modelo de eventos
:::

#### Inmutabilidad

- Una vez que un `event` es publicado, su registro permanece inmutable. La base de eventos es la fuente de la verdad. Allí se refleja lo que exactamente pasó en el producto, cuando pasó
- No está permitido de ninguna manera alterar la integridad de un evento.

#### Modelos de lectura

- Son accesibles solo a través del producto
- No generamos vistas directamente en la base de datos
- Construimos tantos como las necesidades de información del cliente
- Siempre debe ser posible reconstruirlos ya que:
  - nacen exclusivamente de `events` y su informacion no puede ser modificable ni enriquecida
  - modificar o enriquecerlos implica generar nuevos `events`, o nuevas versiones
  - sólo a través de ellos se accede a la data de `events`. No se permite realizar consultas directas

:::note

- Los modelos de lectura deben ser visibles y mantenibles vía código. Agregar vistas u otros directamente en la base de datos le quita transparencia al modelo
- Como los modelos de lectura son reflejos de los eventos registrados, no está permitido por ejemplo, agregarle una columna a un modelo de lectura que contiene información proveniente de una fuente externa de datos
- Si en una entidad u objeto de valor se ha incorporado un nuevo campo en la transaccionalidad, para poder reflejarlo en los eventos se debe generar un evento que de cuenta de esa modificación, y así generar una nueva versión en el modelo de lectura
- Realizar consultas directamente sobre los events para mostrar información al cliente, pone en riesgo la integridad de la fuente de la verdad, así como su disponibilidad

:::

#### Publicación

- Los `events` son publicados siempre a partir de la librería dispuesta para tal fin
- La publicacion de un `evento` en el código es siempre asincrono, no esperamos su ejecución
- La publicación de `eventos` puede ocurrir tanto en la capa frontend, como backend
- Los `events` publicados obedecen su `tipo` a casos de uso de entidades conocidas de negocio ya que:
  - refleja una acción que ocurrió en el pasado respecto de una entidad u objeto de negocio
  - no se permite registrar eventos relacionados con acciones de componentes gráficos (clics, p.e.)
  - se puede publicar tantos `events` como se estimen convenientes

:::note

- Existen casos como migraciones de datos, en los cuales eventualmente se pueden generar eventos directamente por el bus de mensajes o eventos. Estos casos puntuales no deben de alguna manera violar los principios, o alterar la integridad de la fuente de la verdad
- Si bien los eventos tienen una importancia específica, para el producto siempre prevalece la transaccionalidad. La publicación de eventos por lo tanto es secundaria y no debe afectar el rendimiento del producto
- Mientras que reflejen cambios sistémicos relevantes y de importancia para el producto, se pueden publicar eventos en ambas capas dentro del mismo proceso
- Como un evento refleja una acción del pasado, lo esperado es que en vez de publicar el evento `user.crear`, publiquemos el evento `user.created`
- La justificación del registro de un evento está en la relevancia del caso de uso planteado para el seguimiento del negocio.
- Un caso es cuando en el front se necesita registrar evento sobre un chekcbok para aceptar condiciones. Como interesa medir la consecuencia que tiene esa acción para la entidad y no el clic en sí, lo esperado es publicar el evento: `user.terms-accepted` y no: `terms.clicked`

:::

### Testing

- Dado que todas las capas de nuestro software tienen lógica, __siempre__ implementamos test unitarios. Usamos `mocks` (aislamos nuestras líneas de código) y configuramos nuestro runner (usualmente `jest`) para contar con una cobertura requerida en la `definition of done`
- La batería de test a las que cada una es sometida va a variar de acuerdo a la naturaleza de la pieza misma, la regla es:

  | Pieza                     | End-to-end | Integration | Contract | Unit | Mutation |
  |---------------------------|:----------:|:-----------:|:--------:|:----:|:--------:|
  | Microfrontend             |      x     |             |          |   x  |          |
  | Entity microservice       |            |      x      |          |   x  |          |
  | Adapter microservice      |            |      x      |          |   x  |          |
  | Orchestrator microservice |            |      x      |     x    |   x  |          |
  | Atomic microservice       |            |      x      |          |   x  |     x    |

:::tip Ojo

- Los test de mutación no siempre se justifican. Recomendamos implementarlos en servicios particularmente
sensibles, donde el dominio sea más complicado de lo usual
- Para más detalle y profundización, revisar [Taller de testing](https://creditu-team.gitlab.io/slides/testing.html), [TDD](https://creditu-team.gitlab.io/slides/tdd.html), [Introducción al testing](./testing-101/)
- Para realizar test en las componentes del design system, se recomienda revisar esta [referencia](https://storybook.js.org/docs/react/writing-tests/introduction)
:::

### User experiencie

- Todas las experiencias de usuario final tienen que diseñarse __mobile-first__
- Todas las experiencias a destino de nuestros clientes empresa pueden diseñarse __desktop-first__, siempre cuidando el responsivo y usabilidad en _mobile_
- Una interfaz con una nota menor a 3/5 estrellas tiene que ser revisada por los equipos que la diseñaron

:::note supuesto
Todas las interfaces en producción contar con un sistema de medición por parte de los usuarios
:::

### User interface

#### Design system

- Todos los componentes de las interfaces de Creditú deben vivir en el repositorio `Creditú-design-system` esta disponible en Gitlab [aquí](https://gitlab.com/lendaas/lendaas-design-system) y la librería de componentes está publicada en `npm`.

  ```txt
  npm i Creditú-design-system
  ```

- No creamos componentes gráficos aislados dentro de cada repositorio front, entendiendo por esto a toda pieza o elemento visible en la interfaz del usuario (ejemplos: botón, input, card, modal, sidebar etc...)
- En caso de que no exista algún componente que necesitamos, __es nuestra responsabilidad__ crearlo primero en el `design-system` y luego importarlo dentro del proyecto en el cuál estamos trabajando
- Los componentes se crean con todas sus variables necesarias (`size`, `disabled`, `color`, etc.)
- Todos los componentes deben tener test automatizados para asegurar calidad

#### Diseño

Como no tenemos equipo de UI dedicado para validar diseño, nos apalancaremos en los siguientes acuerdos:

- La marca Creditú tendrá una guía general de diseño disponible en la introducción de nuestro `design-system`
- Todos los miembros del equipo tienen derecho a aportar "mejoras" a componentes si lo estiman necesario
- Diseñaremos nuestras interfaces en Figma
- Trabajamos con [__atomic-design__](https://bradfrost.com/blog/post/atomic-web-design); manejamos al menos los conceptos de moléculas y organismos para construir nuestros componentes

:::note

- Figma estará integrado con el `design-system`, asi podremos reducir significativamente el tiempo de diseño
- Para saber más sobre la integración de Figma con Storybook ver [este artículo](https://help.figma.com/hc/en-us/articles/360045003494-Storybook-and-Figma)

:::

### Stack

#### Herramientas

Acordamos que éstas (y no otras) serán las herramientas que usaremos para trabajar en nuestro [workflow](./workflow.md):

| Herramienta                                                                                                      | Para qué                                                                                            | Owner    | Cómo usarla                                                                                                                                               |
|------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|
| [AWS](https://lendaas.gitlab.io/lendaas-design-system/?path=/story/all-components-introduction--page)            | Alojar infraestructura, gestión de emails, levantar ambientes, gestión de dominios web, DB Postgres | Creditú  | Para acceder y configurar esta suite debes revisar la guía de cómo hacerlo                                                                                |
| [Mongo](https://account.mongodb.com/account/login?n=%2Fv2&nextHash=%23org%2F5e3c4fad79358e303ac9bb59%2Fprojects) | Guardar y gestionar data transaccional                                                              | Creditú  | Puedes hacerlo desde la web de Mongo o instalando un cliente local                                                                                        |
| Postgres                                                                                                         | Guardar y gestionar data analítica que viene de eventos                                             | Creditú  | Instalando un cliente local y conectándolo con la RDS de AWS a través de la IP de tu PC                                                                   |
| [GitHub](https://github.com/lendaas)                                                                             | Gestión de repositorios git                                                                         | Creditú  | Ver guía                                                                                                                                                  |]
| [CircleCI](https://app.circleci.com/pipelines/github/lendaas)                                                    | Herramienta de CI/CD                                                                                | Creditú  | Ver guía                                                                                                                                                  |
| [Whimsical](https://whimsical.com/lendaas-3eEHJNJXGM4DsAmSg16qeJ)                                                | Diagramas, mock-ups                                                                                 | Creditú  | Debes tener una cuenta y pedir unirte al grupo Creditú para tener acceso                                                                                  |
| [Figma](https://www.figma.com/)                                                                                  | Maquetas alta fidelidad                                                                             | Creditú  | Debes tener una cuenta y pedir al admin que te sume al grupo Creditú-team. Mientras sea plan gratuito, sólo habrán 2 editores, el resto será sólo lectura |
| [Storybook](https://lendaas.gitlab.io/lendaas-design-system/?path=/story/all-components-introduction--page)      | Gestionar componentes visuales                                                                      | Creditú  | Para crear o modificar componentes debes hacerlo a través del repositorio (ver guía de cómo crear o modificar una componente)                             |
| Eslint                                                                                                           | corregir y estandarizar código                                                                      | Gratuito | Se instala como dependencia                                                                                                                               |
| Sonar                                                                                                            | revisar el código y ver si hay duplicidad                                                           | to-do    | Se instala sobre la CI/CD (to-do: como hacerlo en local)                                                                                                  |
| NPM                                                                                                              | para publicar librerías                                                                             | Creditú  | Ver guía de como usarlo                                                                                                                                   |

#### Framework

Elegimos `javascript` como tecnología de programación. Así, usaremos como motor a Node JS y para programar los siguientes _frameworks_:

| Framework                                | Componente | Para qué | Cómo usarla                                          |
|------------------------------------------|------------|---|------------------------------------------------------|
| [Bulma](https://bulma.io/documentation/) | CSS        | diseño de componentes | ver documentacion en el link                         |
| [Oruga.io](https://oruga.io/)            | CSS        | diseño de componentes | ver documentacion en el link                         |
| [Vue 3](https://vuejs.org)               | frontend   | para crear componentes de front y micro-front | creando un proyecto en gitlab                        |
| [Single-spa](https://single-spa.js.org/) | frontend   | A javascript router for front-end microservices | to-do                                                |
| Nest                                     | backend    | para crear api http | creando un proyecto en gitlab                        |
| Lambda                                   | backend    | para servicios serverless | to-do                                                |
| Sam                                      | backend    | para orquestar componentes serverless  | to-do                                                |
| Jest                                     | testing    | para test unitarios y, en algunos casos, de integración| se instala como dependencia al clonar el repositorio |
| Vitest                                   | testing    | para los proyectos que utilizan vue:3: (muy similar a jest) | to-do                                                |
| Cypress                                  | testing    | para test end-to-end | `npm -i cypress`                                     |
| Pinia                                    | backend    | librería de JavaScript para el manejo de estados bajo un store | to-do                                                |

:::note

Para los framework de CSS vienen empaquetados dentro de la librería `npm`. Dado lo anterior, no será necesario instalar estas dependencias en cada repositorio front

:::
