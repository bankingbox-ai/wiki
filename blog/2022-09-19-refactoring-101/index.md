---
title: Refactor, ¿qué es y cómo enfrentarlo?
authors: [benja]
slug:   refactoring-101
tags: [testing, guias, programming]
---

[Martin Fowler](https://martinfowler.com/) tiene un [libro completo sobre esto](https://www.martinfowler.com/books/refactoring.html), pensé
que sería una buena idea al menos tener un artículo que introduzca el tópico.

![refactor](./code-refactoring.jpg)

<!--truncate-->

## Qué es 🙉

[Parafraseando a _Fowler_](https://martinfowler.com/bliki/DefinitionOfRefactoring.html),
generalmente habría dos maneras de entenderlo:

1. __Refactor__, como sustantivo (concepto)

    > Es un cambio a la estructura interna del software que lo hace más fácil de entender y
    > simplifica su posterior modificación, pero sin alterar su comportamiento observable.

2. __Refactorizar__ como verbo (actividad)

    > Sería la actividad de aplicar estos cambios (conocidos como refactorizaciones) que
    > mejoran el diseño / la solución.

Y yendo más allá, también podemos entender al refactor como una habilidad,
que se adquiere con la experiencia
de refactorizar. Una que como desarrolladores queremos tener.

## Por qué refactorizar ☃️

![code quality](https://imgs.xkcd.com/comics/code_quality.png)

Es medio majadero, porque la misma defición de Fowler lo explica, pero quería detenerme en el porqué.
Refactorizamos por una serie de razones, intentaré nombrar algunas de ellas:

- Porque trabajamos con TDD, es parte de nuestro flujo de trabajo
- Porque intentamos mantener patrones ordenados en nuestras piezas
- Porque intentamos evitar la deuda técnica
- Porque que el código sea entendible y mantenible son argumentos que valoramos

Mantener el refactor como práctica cotidiana nos ayuda a mantener un buen estándar de calidad. Refactorizar es parte de nuestra cultura: invertimos en
mejorar constantemente la calidad.

## La mentira del gran refactor 🙊

Un refactor nunca será una mejora en sí mismo. La misma definición, nuevamente, lo dice: "sin alterar
su comportamiento observable". Por lo tanto es evidente que el refactor se trata de la forma, del cómo, pero nunca
del qué. El funcionamiento del software se mantiene. Siempre será del ámbito del __output__ (una mejora visible para
el equipo) y no del __outcome__ (una nueva capacidad, característica o experiencia para el usuario o cliente).

Por lo mismo, es natural que nuestra metodología jamás considere que al refactor como un ciudadano (ítem) legítimo del backlog.
Si un equipo quisiera usar su sprint para refactorizar, claro que puede hacerlo, el equpo es autónomo. Pero esa decisión
evidentemente tiene costos:

- Impacta negativamente en el cycle time (tiempo que se toma el equipo en liberar un feature)
- No acciona la prioridad establecida por el product owner
- Es un sprint de __output__ y sin __outcome__

De ahí la real importancia del refactor cotidiano: debiera ayudarnos
a evitar un nivel de deuda técnica que cree esa distancia entre el
incremento actual y el futuro. Incrementos futuros siempre debieran
ser accionables sin un __Gran Refactor__.

## Cómo aprender a refactorizar 🧑‍🏫

Es una habilidad práctica, se aprende y mejora con, adivinen. Exacto: práctica.

Algunas ideas:

### Pedir feedback

Puede ser pedir ayuda a quien creas que pueda tener alguna idea
crítica acerca de cómo mejorar una pieza de código o puedes pedir un _code-review_, nunca falla.

### Pair programming

Dos cabeza piensan mejor que una, siempre será una experiencia
enriquecedora trabajar con otro. Puedes consultar [este artículo](/pair-programming)
con más información acerca de cómo nos acercamos a esta práctica.

### Estudiar y leer

Además de leer libros acerca del tema, siempre es sano mantenerse al día de las nuevas mejoras que
trae EcmaScript, leer acerca de patrones de diseño que podrían implementarse
para mejorar nuestro producto y estar en contacto con la industria.

### Practicar

Como toda habilidad práctica, hay que practicarla. Recomiendo la cuenta
de [GitHub de Emily Bache](https://github.com/emilybache), ella se dedica a hacer consultoría y coaching
acerca de estos temas y comparte los ejercicios que utiliza en
sus consultorías: el código en una tremenda cantidad de lenguajes,
una pequeña batería de test y un readme que te puede orientar
en algunas alternativas de refactor. Además, puedes encontrar las
"soluciones" que otros dieron al problema en forma de código ya refactorizado. Muy recomendado.

### Programación en equipo / mob-programming

Enfrentar un refactor como equipo o con un colectivo puede ser muy enriquecedor
para todos. Muchas veces se pueden combinar algunas sesiones colectivas
para las operaciones más delicadas y luego abordar el resto con `pair programming`
o como parte de un sprint.

## Refactorizando en situaciones incómodas

Imagina que estás en algo así:

- Trabajando con código que otra persona escribió, sobre un dominio que no manejas
- Podría ser código legado
- Código complicado
- Larga extensión
- No testeado

En estos casos, antes de decidir hacia donde dirigirse, la primera
prioridad es escribir algunos test: ojalá documentar rápidamente al menos las
funcionalidades que el código ofrece (o debiera ofrecer). En este proceso
es muy probable que tropieces con bugs que nadie documentó antes y que el
camino tienda a bifurcarse a otros lados.

Luego de contar con una cantidad digna de test, puedes comenzar el refactor.

Si el análisis se vuelve aún más complicado, técnicas como el [método](https://www.youtube.com/watch?v=nJSNpcXrPYU) [mikado](https://www.youtube.com/watch?v=qvlkyJ26PGc) podrían ayudar a conceptualizar
los pasos necesarios para el refactor y planear una estrategia ganadora
como equipo.

## Cómo refactorizar

`TDD` son el mejor aliado del refactor, es crucial que para refactorizar tengamos un test que nos ayude a determinar
cómo debe funcionar el código. Dado que no existirá un cambio observable, las suites de test funcionales debieran
ejecutarse correctamente previo al refactor y servirá para asegurar que el refactor no atentó contra el funcionamiento.

Atención constante al detalle para evitar grandes refactors. Trabajo incremental, los cambios
y giros estructurales que enfrenta el software debieran ocurrir de
forma orgánica, de la mano de TDD.

Como decía: cuando no podemos tener una idea acerca de si es posible o no tomar un incremento del backlog,
probablemente nos falta refactor en nuestra cultura de desarrollo

## Errores comunes

- Intentar hacer demasiado: mantén los cambios en su mínima expresión
(_baby steps_)
- No tengas miedo de volver atrás
- Evita las ramas (sobre todo más de una semana), en organizaciones
dinámicas puede ser muy difícil resolver los conflictos con la rama principal
- El refactor debiera ser una actividad colectiva: coméntalo con tu equipo,
coméntalo con el equipo completo, transparéntalo, comparte la estrategia,
invita a otro a acompañarte en el refactor, etc

## Code smells

Como dice Kent Beck y parafrasea Martin Fowler, existen ciertas
pistas que nos van a ayudar a determinar hacia dónde puede
mejorarse el código
