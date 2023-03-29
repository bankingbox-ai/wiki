# Permisos

Cuáles son y cómo se generan los roles & permisos

## Que son

### Cómo los generamos

#### User features

Para dar permisos de __lectura__ y __edición__ a los distintos usuarios, los `user-features` se deben crear en la base de datos considerando un stack de `user-resources` que permitan lo anterior. Deben tener un nombre descriptivo que haga alución a una funcionalidad, como por ejemplo: `remesas` o `cobranza`.

- Para evitar entropía y mantener el producto limpio, los `feature-toggle` deben contar con un flag de clasificación que diferencie entre los __permanentes__, (vivirán en el producto cómo parte los planes), y los __no-permamentes__ si, que en el futuro deben ser removidos.

En desarrollo de software un [feature toggle](https://en.wikipedia.org/wiki/Feature_toggle) provee una alternativa para mantener múltiples ramas en el código fuente. La funcionalidad puede integrarse a la rama principal antes de que esté completa.

## Roles

Los roles se deben generar en la base de datos considerando un stack de `user-features` y deben tener un nombre descriptivo como `backoffice/tesorero` o `backoffice/contador`.
