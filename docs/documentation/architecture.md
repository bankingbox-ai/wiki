---
sidebar_position: 2
---

# Arquitectura

Cómo es, cómo la definimos y qué contiene

<!-- markdownlint-disable MD033 -->
<iframe width="800" height="450" src="https://whimsical.com/embed/9p3qoqGCuGHaL5eZ8tmDgw"></iframe>

## Capas y su misión

Trabajaremos con una arquitectura de microservicios, organizada por capas.

### API Gateway

Expone públicamente los endpoint de los micro servicios. Se comunica con la capa AUTH.

### Business

Aquí vive la mayor parte de la lógica de negocio. Existen dos tipos de APIs:

- Orchestrators: pueden llamar a otras APIs, incluyendo orchestrators, atomic-services, entities y third parties. No acceden directamente a una BD.
- Atomic-Services: no llaman a ningun otro recurso ni acceden a BDs.

### Auth

Resuelve la autenticación y la autorización, incluyendo los toggles.

### Entities

Administan las entidades del modelo de negocio. Se caracterizan por tener un modelo de datos que persiste en una BD, una mínima lógica de negocio y resuelven el CRUD sobre el recurso. No realizan llamadas a otras APIs.

### Third party adapters

Implementación y conexión con recursos de terceros. Protegen a nuestro dominio, evitan que se contamine con el dominio de un tercero. Estas APIs no se comunican con otras del producto y pueden o no persistir mediante una BD.

### Analytics

Esta capa se encarga de mantener la data necesaria para la analítica. Se comunica con las capas Business Layer y Entites Layer mediante eventos, en un sólo sentido (apis => analítica). Cuénta con conectores http para la publicación, pero su arquitectura interna es de eventos a diferencia del resto del producto.

### Observability & trazability

Permite comprender el estado interno de la solución en función de la telemetría. Considera 3 fuentes de datos:

- Logs: Registros de lo que va ocurriendo en el sistema.
- Métricas: Información cuantitativa relativa a procesos o recursos en máquinas.
- Trazas: Datos que permiten comprender las rutas (llamadas http, mensajes en cola, ejecuciones programadas) para optimizar e identificar errores.

## Serverless

Sin servidor.

**¿Por qué?**

- Nos permite centrarnos en el código más que en el aprovisionamiento y mantención de la infraestructura
- Minimiza el costo de la solución

**¿Cómo?**

Usaremos Lambdas

:::note **Serverless**

- **Prerequisitos**

  - Resolver la integración continua
  - Resolver TDD

- **¿Cómo transitamos a este nuevo esquema?**

  - Migraremos APIs REST a recursos con lambdas, encapsulando colas y lógica de eventos
  - Mantendremos la arquitectura de microservicios HTTP REST
:::

## CI/CD

<iframe width="800" height="450" src="https://whimsical.com/embed/N4ac5C1zpggtpuMfwx8EKn@2Ux7TurymMnHfj6zjc3T"></iframe>
