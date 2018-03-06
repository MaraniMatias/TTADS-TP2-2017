# TTADS-TP2-2017

## Alcance del TP

El TP consiste en un backend para abmc de partidos, equipos y tipos de evento; y un frontend desarrollado en VueJS 2 con un modulo para el gestor del los partidos (abmc partidos, equipos y tipos de evento) y otro para el cliente (visualización de partidos en curso junto con su detalle).

## Integrantes
``` javascript
var tp = {
  anio: 2017,
  integrantes : [{
    nombre : "Andrés de la Grana",
    legajo : 41034
  }, {
    nombre : "Arian Valles",
    legajo : 41556
  }]
}
console.log(tp.integrantes);
```


# NOTAS

Agregar variables de entorno las que se leen en `process.env.`.
Y configurar para que openshift valide que el server esta andando con `/status` y no con `/pagecount`
