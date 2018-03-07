# TTADS-TP2-2017

## Integrantes
``` javascript
var tp = {
  anio: 2017,
  integrantes : [{
    nombre : "Andrés de la Grana",
    legajo : 41034
  }, {
    nombre : "Marani Matias Ezequiel",
    legajo : 39710
  }]
}
console.log(tp.integrantes);
```

## Alcance del TP

Este proyecto consiste de un Backend que será consumido por la aplicación móvil correspondiente al
repositorio https://github.com/MaraniMatias/TTADS-TP3-2017.

El Backend antes mencionado consta de las siguientes funciones:

- ABMC de torneos, partidos, equipos, jugadores y tipos de evento;
- La api puede usarse para:
  - Consultar todos los objetos
  - Consultar un conjunto de objetos que cumplan con el(los) parémetro(s) especificado(s)
  - Consultar un solo objeto junto con su detalle
  - Dar de alta un objeto
  - Modificar un determinado objeto pasando el id por una petición GET
  - Eliminar un determinado objeto pasando el id por una petición GET
- Todas las consultas que recuperen información y traigan varios objetos, incorporan un paginado. Esto se
  logra con un interceptor que asigna valores de skip y limit a la consulta. Si no vienen en la petición
  GET, se les dará valores por default.
- Se incorpora una función de normalización para todas las respuestas.
- Seguridad para todas las peticiones POST, PUT y DELETE antes mencionados incorporando autentificación
  por token.

## Tecnologías y dependencias 

body-parser
chai
chai-http
cookie-parser
cors
crypto
express
express-session
jsonwebtoken
lodash
mocha
mongoose
morgan
object-assign
passport
passport-facebook
passport-jwt
passport-local



# Servidor online

El proyecto se encuentra corriendo online. La url es la siguiente:

http://nodejs-mongo-persistent-ttads-tp3-2017.a3c1.starter-us-west-1.openshiftapps.com/status


# NOTAS

Agregar variables de entorno las que se leen en `process.env.`.
Y configurar para que openshift valide que el server esta andando con `/status` y no con `/pagecount`
