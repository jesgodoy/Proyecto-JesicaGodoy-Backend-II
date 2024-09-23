# Proyecto Backend I

Este proyecto es una aplicación de ecommerce desarrollada como parte del curso de Backend en Coder. El objetivo del proyecto es aplicar los conceptos aprendidos durante el curso para crear una solución completa y funcional para un ecommerce utilizando Node.js, Express, Express-Handlebars, Socket.io , mongoose y modngoDB 

## Tabla de Contenidos

- [Descripción](#descripción)
- [Instalación](#instalación)
- [Uso](#uso)
- [Rutas de la API](#rutas-de-la-api)

## Descripción

### Proyecto Final

Este proyecto es una API desarrollada con Node.js y Express para gestionar productos y carritos de compra. La aplicación escucha en el puerto 8080 
Se ha integrado ademas  Handlebars para renderizar vistas en el servidor

1. **Lista de Productos**: Disponible en la ruta `/products`, muestra todos los productos.
2. **detalle del carrito**: Disponible en la ruta `/carts/:cid`, permite ver el detalle delos productos agregados en el carrito
3. **lista de procuctos**: Disponible en la ruta `/api/products`, permite ver todos los productos pero desde una vison de array
4. **lista de carritos**: Disponible en la ruta `/api/carts`, permite ver todos los carritos pero desde una vison de array
5. **real time prodcts**: Disponible en la ruta `/realtimeproducts`, permite ver todos los productos y da opcion de eliminarlos, ademas cuenta con un formulario para crear nuevos productos


## Instalación

Sigue estos pasos para configurar el proyecto en tu entorno local:

1. **Clona el repositorio**:
    ```bash
    git clone https://github.com/jesgodoy/Proyecto-JesicaGodoy-Backend-I.git
    ```

2. **Navega al directorio del proyecto**:
    ```bash
    cd nombre-del-repositorio
    ```

3. **Instala las dependencias**:
    ```bash
    npm install
    ```

4. **Inicia el servidor**:
    ```bash
    npm run dev
    ```

   El servidor se ejecutará en `http://localhost:8080`.

## Uso
Puedes interactuar con la aplicación usando un navegador web para las vistas y herramientas como Postman para las rutas de la API.

- **Ruta de la vista de productos**: `http://localhost:8080/products`
- **Ruta de la vista de productos en tiempo real**: `http://localhost:8080/realtimeproducts` 

## Rutas de la API para usar con Postman

### Productos (`/api/products/`)

- **`GET /api/products/`**: Lista todos los productos.
- **`GET /api/products/:pid`**: Obtiene un producto por su ID. 
- **`PUT /api/products/:pid`**: Actualiza un producto por su ID. 
- **`DELETE /api/products/:pid`**: Elimina un producto por su ID.

### Carritos (`/api/carts/`)

- **`POST /api/carts/`**: Crea un nuevo carrito.
- **`GET /api/carts/:cid`**: Lista los productos en un carrito por su ID.
- **`POST /api/carts/:cid/product/:pid`**: Agrega un producto al carrito. Si el producto ya está en el carrito, incrementa la cantidad.


