
## Estructura del proyecto
Project/  
├── backend/  
│ ├── db.js  
│ └── setpoints.js  
├── frontend/  
│ ├── public/  
│ ├── src/app/  
│ │ ├── Admin/  
│ │ └── page.tsx  
│ │ ├── api/  
│ │ └── api.ts  
│ │ ├── Components/  
│ │ └── sidebar.tsx  
│ │ ├── Dev/  
│ │ └── page.tsx  
│ │ ├── layout.tsx  
│ │ └── page.tsx  
│ └── .gitignore  
├── .env.example  
├── .gitignore  
├── package-lock.json  
├── package.json  
└── README.md  

## Pasos previos a la ejecucion
1. Configurar el archivo .env.example y cambiar su nombre a .env
2. En terminal dentro de la carpeta main utilizar los comandos:
 - npm init -y
 - npm install express
 - npm install mysql2
 - npm install dotenv
 - npm install cors

3. En terminal dentro de la carpeta backend utilizar los comandos: 
 - npm install concurrently --save-dev


## Pasos para ejecucion
Para ejecutar el proyecto, utiliza el comando:
 - npm run project

Nota: En caso de unicamente querer utilizar el backend, utilizar el comando:
 - npm run backend

Nota: En caso de unicamente querer utilizar el frontend, utilizar el comando:
 - npm run frontend


## Endpoints disponibles
Aqui se encuentran todos los endpoints que se pueden realizar dentro del programa utilizando la API:

1. Endpoints para login:
 - POST /auth/login = Login
 - GET /auth/profile = Obtener perfil
 - POST /auth/logout = Logout

2. Endpoints para Users:
 - GET /users = Obtener todos los usuarios de la base de datos.
 - GET /users/filter = Filtrar usuarios
 - GET /users/{id} = Obtener usuario por ID
 - POST /users = Crear usuario
 - PATCH /users/{id}/status = Actualizar estado
 - PUT /users/{id} = Editar usuario
 - DELETE /users/{id} = Eliminar usuario

3. Endpoints para Carrers:
 - GET /careers = Obtener carreras
 - GET /careers/filter = Filtrar carreras
 - POST /careers = Crear carrera
 - PUT /careers/{id} = Actualizar carrera
 - DELETE /careers/{id} = Eliminar carrera

4. Endpoints para Types y Categories:
 - GET /types = Obtener tipos de ticket
 - POST /types = Crear tipo de ticket
 - PUT /types/{id} = Actualizar tipo
 - DELETE /types/{id} = Eliminar tipo
 - GET /categories = Obtener categorías

5. Endpoints para Tickets:
 - GET /tickets = Obtener todos los tickets
 - POST /tickets = Crear ticket
 - GET /tickets/{id} = Obtener ticket por ID
 - GET /tickets/filter = Filtrar tickets
 - PATCH /tickets/{id}/status = Cambiar estado del ticket
 - PUT /tickets/{id} = Actualizar ticket
 - DELETE /tickets/{id} = Eliminar ticket
 - POST /tickets/assign = Asignar ticket a desarrollador
 - GET /tickets/user/{id} = Obtener tickets por usuario

6. Endpoints de KPIs:
 - GET /kpi/tickets/status = Tickets por estado
 - GET /kpi/tickets/user = Tickets por usuario

## Roles dentro de la pagina
Existen 2 roles principales que podran interactuar con la pagina. El primero es:

1. Admin  
Este usuario sera capaz de:  
 -  Ver todos los tickets realizados

2. Dev
Este usuario sera capaz de:
 -  