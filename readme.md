
<br />
<p align="center">

  <h1 align="center">Explorador de archivos</h1>

  <h3 align="center">
   Un explorador de archivos realizado con Angular 18 y .NET 7
    <br />
  </h3>
</p>




<!-- ABOUT THE PROJECT -->

## Estructura del proyecto

<details><summary>Core</summary>

* Incluye todas las clases de datos e interfaces del backend
* Esta carpeta no tiene ningun código de logica son unicamente declaraciones

</details>


<details><summary>Persistence</summary>

* Incluye todo lo relacionado a la conexion con la base de datos
* Se configuran las tablas de Sqlite en la carpeta de EntityConfiguration
* Incluyen las implementaciones de los repositorios definidos en Core

</details>

<details><summary>WebApi</summary>

* Incluye todo lo relacionado al proyecto de REST API
* Utiliza dependency injection de repositorios y servicios para que sea facilmente testeable
y que se pueda en un futuro cambiar la implementacion facilmente (por si se quiere cambiar de base de datos o almacenar documentos en otro lado)

</details>

<details><summary>WebApp</summary>

* Este es el proyecto de angular
* Tambien tiene una carpeta Core, con todos los modelos de datos y servicios http, esta carpeta no contiene ningun código de HTML ni CSS, es unicamente TypeScript
* La carpeta modules contiene los 'modulos' de la aplicacion, en este caso solo es el explorador de archivos y tiene una sola pantalla que es el dashboard
* Shared contiene componentes y clases de ayuda compartidos en toda la aplicación

</details>


<br>


<!-- Herramientas de desarrollo -->

## Ejecutar el proyecto
Antes de clonar el repositorio asegurate de tener instalado:

- NodeJS [![NodeJS](https://img.shields.io/badge/NodeJS-v20.16.0-green)](https://nodejs.org/es/)
- NPM [![NPM](https://img.shields.io/npm/v/npm)](https://nodejs.org/es/)
- Angular 18 [![NPM](https://img.shields.io/badge/Angular-18-red)](https://angular.dev/)
- .NET 7 [![NPM](https://img.shields.io/badge/.NET-7-blue)](https://dotnet.microsoft.com/es-es/download/dotnet/7.0)


- Una vez que hayas descargado el repositorio en la carpeta WebApp instala las dependencias utilizando

```
  npm install
```

- En la carpeta WebApi correr el comando

```
  dotnet build WebApi.csproj
```

- Para ejecutar el backend, en la carpeta WebApi correr el comando

```
  dotnet run --urls http://localhost:5001
```

- Para ejecutar el frontend, en la carpeta WebApp correr el comando

```
  ng serve
```

## Contacto

Fernando Maldonado - [@Fmaldonado4202](https://twitter.com/Fmaldonado4202) - fmaldonado824@gmail.com
