---
sidebar_position: 1
---

# Desempeño

Puntos y estrellas.

En producto Digital la evaluación de desempeño de cada *Product Developer* (PD) tendrá -como en todo Creditú- una componente **cuantitativa** y otra **cualitativa**, las cuales serán representada a través de puntos y estrellas correspondientemente.

La forma de entregar **puntos** es la siguiente:

- En la *Retrospective* de equipo, cada integrante repartirá 100 puntos porcentuales a sus compañerpos (la totalidad de ellos)
- En la *Retrospective-overall* podrá recibir puntos de integrantes de otros equipos
- Para la asignación, cada integrante deberá preguntarse por cuánto valor aportó cada uno de ellos al *Sprint goal*, **independientemente de la forma** en que lo hizo y/o el contexto y/o el conocimiento de cada uno tenía
- Una vez que los incrementos sean liberados a usuarios, se irá apreciando o depreciando en el año mediante un sistema de cálculo de puntos. Esos puntos se irán repartiendo a los integrandes en la proporción que recibió sus puntos

La forma de entregar **estrellas** es la siguiente:

- En la *Retrospective* de equipo, cada integrante tendrá 1 estrella que podrá o no dar una estrella a sus compañeros de equipos
- En la *Retrospective-overall* podrá entregarla a un integrante de otro equipo (siempre no la haya dado previamente)
- Para la asignación, cada integrante deberá preguntarse quién destacó por su actitud, **independientemente cuánto aportó al objetivo**, en alguno de los 5 principios que promueve Creditú: emprendimiento, liderazgo cercano, ccción orientada al impacto, yntegridad y profesionalismo, proactividad y excelencia

Al final de año se sumarán los puntos y estrellas, dando una nota de evaluación que se traducirá en el sisguientes conceptos:

1. Excepcional
2. Excelente
3. Sólido
4. Cumple con aspectos por mejorar
5. No cumple

## Puntos

Cuantificaremos el **valor de un incremento** ($\small{V_{i}}$) con un estimador de valor al cual llamaremos **puntos** y lo calcularemos través de la siguiente función:

$$
V_{i} = \min{(0, \sum_{j}{V_{j}})} \cdot f_{r}
$$

### Prioridad

Cuando el *Product Backlog* está repriorizado, existe una lista ordenada por su *outcome* de posibles incrementos. Como la capacidad de desarrollo es limitada, solo los que están en la parte superior de esa lista tienen un valor de corto plazo, por se les asignará un **puntaje inicial** a través de la siguiente función (continua y decreciente):

$$
\begin{matrix}
  V_{p} = \begin{cases}
    m & \text{si equipo que lo toma no tiene opción de tomar algo más prioritario} \\
    a \cdot b^{p} + c & \text{si no toma los más prioritario y} \ p \leq k \\
    z & \text{si} \ p > k
  \end{cases}
\end{matrix}
$$

Donde,

```text
p: prioridad del incremento
m: máximo puntaje por prioridad
a: parámetro de decreciemiento
b: factor de concavidad
c: ajuste a puntos base
k: capacidad max de incrementos por sprint
z: puntos base
```

### Tiempo

Dependiendo de si el incremento demoró (`cycleTime`) más o menos del tiempo comprometido (`sprintLenght`) en quedar potencialmente liberable de adicionarán o restarán puntos mediante la siguiente fórmula:

$$
V_{t} = \frac{2}{t+1}-1
$$

Donde,

```text
t = cycleTime/sprintLenght
```

:::note El puntaje inicial podrá:

- Hasta duplicarse si el `cycleTime` es menor al `sprintLenght`
- Mantenerse si  el `cycleTime` es igual al `sprintLenght`
- Disminuir hasta cero si el `cycleTime` es mucho mayor al `sprintLenght`

:::

### Eficiencia

Un PBI tiene más valor si puede llegar a más usuarios (varios paises) en un mismo ciclo (resolver varios desafios utilizando misma solución)

$$
\begin{matrix}
  V_{e} = \begin{cases}
    0 & \text{es desplegado un país y solo ese país tiene esa necesidad} \\
    3 \cdot z & \text{si es desplegado todos los paises con esa necesidad} \\
    -z & \text{no es desplegado un país que tiene esa necesidad}
  \end{cases}
\end{matrix}
$$

:::note
Si un incremento es desplegado en 1 país, habiendo más paises con esa necesidad, entonces el incremento es castigado porque aumentará la probabilidad de trabajar por silos y dejar **deuda técnica**
:::

### Calidad

Un PBI tiene más valor si cuando es liberado no deja `bugs`. Éstos pueden provenir por un mal diseño (se hace cargo de pocos caso de uso) o por mala factura (código mal hecho, o que no responde a la funcionalidad).

Una vez que un incremento haya sido liberado al usuario (`released`), se debe asegurar que esté [done](https://creditu-team.gitlab.io/wiki/methodology/definition-of-done.html) y funcionando.
Por eso, cada vez que se reporte un `bug` productivo (ver definición de bug), el incremento sufrirá una pérdida de puntaje por día/evento ocurrido.

- Si el incremento fue realizado `this.year` y el `bug` ocurre entre el 1-ene `this.year` y 31-ene `next.year`, se descontará puntos de ese incremento.
- Caso contrario será considerado un "contra-incremento", que sólo considerará la componente $V_{c}$ y restará puntos `this.year`

```text
Valor calidad

V{c} = - sum{Bug(i)*diasBug(i)}
minDurationBug = 1 dia
```

:::caution
Para no dejar al esta medición arbitrio de quienes estarán observando el proceso, los mismos equipos deben desarrollar un método que permita medir bugs de los incrementos de manera consensuada y consistente
:::

### Aterrizaje

Un PBI tiene más valor si tiene una buena y fácil adopción por parte de los usuarios, lo que redunda en un buen uso y pocas consultas / reclamos. Se usará un evaluación en 5 estrellas para medir aterrizaje, suponiendo cómo consideraron los usuarios la recepción del incremento.

```text
Valor aterrizaje

V{a} = puntosBase * 5 / calificación ⭐⭐⭐⭐⭐
V{a} = puntosBase  / calificación ⭐⭐⭐⭐
V{a} = 0  / calificación ⭐⭐⭐
V{a} = - puntosBase  / calificación ⭐⭐
V{a} = - puntosBase * 5+  / calificación ⭐
```

:::caution
Para no dejar al esta medición arbitrio de quienes estarán observando el proceso, los mismos equipos deben desarrollar un método que permita medir bugs de los incrementos de manera consensuada y consistente
:::

### Rentabilidad

Un PBI tiene más valor si participa de la utilidad. Por ejemplo, si una compañía tiene varias líneas de negocio y una tuvo mejor desempeño que la otra (por ejemplo, resultado anual en colocaciones), entonces los PBI's que aportaron a esa línea tienen más valor que los que aportaron en otras.

En esta componente, todos los items que son parte de un **customer journey** serán multiplicados de la siguiente manera:

- Los que pertenecen a **acquisition**, por el cumplimiento del presupuesto de `colocaciones`
- Los pertenecientes a **payment**, por el nivel de `mora` de la cartera
- Los pertenecientes a **customer care**, por el nivel de `satisfacción` del cliente
- Los pertenecientes a **endorsment**, por el % de mutuos `endosados/originados`

```text
Factor rentabilidad

f{r}: 1.5 / si meta anual sobre cumplió arriba 120%
f{r}: 1.2 / si meta anual sobre cumplió bajo 120%
f{r}: 1 / si meta anual cumplió
f{r}: 0.7 / si meta anual fue entre 70%-100%
f{r}: 0.3 / si meta anual fue menor a 70%
```

### Ejemplo

El proceso de cálculo será experimental e incremental. En la medida que se tenga más información sobre los incrementos, se podrá ir sofisticando el modelo. Por el momento se podrán ver los resultados [acá](https://datastudio.google.com/s/n2a04iTqUHc).

<!-- markdownlint-disable MD033 -->
<iframe width="800" height="450" src="https://whimsical.com/embed/JSH1RR2mmWrC32zdiiPD1p"></iframe>
