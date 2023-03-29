---
title: Cómo construir un test
slug: how-to-build-a-test
authors: benja
tags: [guías, testing]
---

En Lendaas trabajamos con TDD (o lo intentamos 🤓), [aquí](/testing-101) puedes leer un poco más acerca
de nuestra estrategia global. Suena bonito, pero en la práctica
escribir test de distintas naturalezas antes de codear no es tan
sencillo.

En este artículo abordaré de forma más concreta distintos
escenarios cotidianos a los que nos enfrentamos y cómo resolvemos
el test en cada uno.

<!--truncate-->

## Qué entendemos por un test

Un test sería un caso de prueba que tiene ciertas características:

- Tiene un nombre o descripción que normalmente escribimos en inglés
e incluye la palabra _should_ (debería). Cualquiera debería poder leerlo
y entender la expectativa del test
- Cada test es una unidad independiente, puedo ejecutarlo por sí solo
y siempre debiera obtener el mismo resultado. En otras palabras, no debería
existir dependencia entre mi test y el anterior
- El resultado del test siempre debiera ser un `booleano`, un semáforo que solo
tiene luz verde o roja (🟢 / 🔴)

:::info tip

En algunas ocasiones traicionamos un poco la república independiente de cada test,
agrupando casos de prueba que comparten estrechamente un contexto. Para esto
usamos un _describe_ y describimos las coordenadas específicas que los une.

:::

## Partes de un test

Cada test tiene una estructura de tres partes:

1. __Arrange__: en esta etapa configuro todo lo necesario para que mi test pueda
ejecutarse. ¿Necesito construir algún objeto? ¿Necesito reemplazar alguna
dependencia? ¿Necesito que haya algo previamente en la base de datos?
2. __Act__: aquí ejecuto. Hago alguna acción que desencadene un cambio
en el estado observable del software. Puede ser que ejecute una petición http
contra una API o simplemente ejecute un método
3. __Assert__: ahora verifico el resultado. Esta etapa es la que determina si el test
arroja un resultado positivo o falla

A tener en cuenta:

- Recomiendo siempre comenzar por la descripción del test
- Explicitar las tres secciones suele ayudarme a tener consciencia de
qué / por qué estoy haciendo algo. Suelo dejar como comentario las tres secciones
del test, incluso aunque pueda prescindir de una de ellas
- Mantener el orden y síntesis es clave para que otro distinto de mí pueda
entender rápidamente de qué trata el test
- A veces, sobre todo cuando hay `mocks`, es posible que un `assert` quede anidado
dentro del `arrange`. No es deseable, pero si no lo puedo evitar, dejo un comentario explícitando este anti patrón

## Ejemplos prácticos

### Test Unitario

#### Caso simple

Supongamos que tenemos el siguiente método:

``` js
// math.js
export const sum = numbers => {
  return numbers.reduce((total, current) => {
    return total + current;
  }, 0);
};
```

Un test sencillo sería algo así:

``` js
// math.spec.js
import { sum } from './math.js';

test('should sum int numbers', () => {
  // ARRANGE
  // Construyo el input que necesito para mi test
  const numbers = [1, 2, 3];
  // ACT
  // Ejecuto la función y le entrego el argumento
  const result = sum(numbers);
  // ASSERT
  // Reviso que el resultado sea 6
  expect(result).toBe(6);
});
```

#### Un poco más sofisticado

Supongamos que queremos interactuar con la [api de Star Wars](https://swapi.dev/)
y obtener personajes:

``` js
// api.js
const axios = require('axios');

/**
 * Obtiene personajes desde la api de StarWars
 * @param page    Número de página
 * @returns       Objeto, la llave results contiene el arreglo de personajes
 */
const getCharacters = async (page = undefined) => {
  const params = { page };
  try {
    const { data } = await axios.get(
      `${process.env.SWAPI_BASE_URL}/people`,
      { params }
    );
    return data;
  } catch (error) {
    throw new Error('Error fetching characters');
  }
};
```

Dado que el objetivo del test unitario es revisar que mis líneas de código hacen
lo que quiero que haga y de que no quiero sobrecargar de llamadas a la api,
tengo que construir un __mock__ (sustituto) de `axios`:

``` js
const axios = require('axios');
const { getCharacters } = require('./api');

describe('./api.js', () => {
  beforeEach(() => {
    // para asegurar que el entorno de cada test sea único
    process.env = {};
  });

  it('should get characters', async () => {
    // ARRANGE
    process.env.SWAPI_BASE_URL = 'swapi_url';
    const axiosGetMock = jest.spyOn(axios, 'get')
      .mockImplementationOnce(async () => ({ data: 'data' }));

    // ACT
    const characters = await getCharacters();

    // ASSERT
    expect(characters).toBe('data');
    expect(axiosGetMock).toHaveBeenCalledWith(
      'swapi_url/people',
      { params: { page: undefined } }
    );
  });
});
```

:::info

Tal como comenté en [este](/testing-101#b1-unitarios) artículo que
introduce los tipos de test, los unitarios persiguen la idea de probar
exclusivamente MIS líneas de código. Hacer __mocks__ a veces no parece
necesario, pero es la herramienta que nos permite aislar cualquier comportamiento
ajeno y así, concentrarme exclusivamente en lo que me interesa.

:::

### Test de integración

Un test de integración prueba los distintos componentes de una solución interactuando entre sí.
En este tipo de tests no se utilizan mocks de los componentes externos.
Por el contrario, estos tests se hacen en un ambiente similar al que utilizarían si el software estuviera desplegado.
Esto significa que necesitamos contar con bases de datos, y desplegar todos los recursos de los que dependa lo que queremos testear.
