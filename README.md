
## Estructura del proyecto
Project/  
├── backend/  
│ ├── db.js  
│ └── setpoints.js  
├── frontend/  
│ ├── public/  
│ ├── src/app/  
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
Para ejecutar el projecto, utiliza el comando:
 - npm run project

Nota: En caso de unicamente querer utilizar el backend, utilizar el comando:
 - npm run backend

Nota: En caso de unicamente querer utilizar el frontend, utilizar el comando:
 - npm run frontend


## Metodos disponibles
Aqui se encuentran todos los metodos que se pueden realizar dentro del programa utilizando la API:
1. Metodos para Users:
 - GET /users = Obtener todos los usuarios de la base de datos.
 - GET /users/filter = Filtrar usuarios
 - GET /users/{id} = Obtener usuario por ID
 - POST /users = Crear usuario
 - PATCH /users/{id}/status = Actualizar estado
 - PUT /users/{id} = Editar usuario
 - DELETE /users/{id} = Eliminar usuario

2. Metodos para Carrers:
 - GET /careers = Obtener carreras
 - GET /careers/filter = Filtrar carreras
 - POST /careers = Crear carrera
 - PUT /careers/{id} = Actualizar carrera
 - DELETE /careers/{id} = Eliminar carrera

3. Metodos para Types y Categories:
 - GET /types = Obtener tipos de ticket
 - POST /types = Crear tipo de ticket
 - PUT /types/{id} = Actualizar tipo
 - DELETE /types/{id} = Eliminar tipo
 - GET /categories = Obtener categorías

4. Metodos para Tickets:
 - GET /tickets = Obtener todos los tickets
 - POST /tickets = Crear ticket
 - GET /tickets/{id} = Obtener ticket por ID
 - GET /tickets/filter = Filtrar tickets
 - PATCH /tickets/{id}/status = Cambiar estado del ticket
 - PUT /tickets/{id} = Actualizar ticket
 - DELETE /tickets/{id} = Eliminar ticket
 - POST /tickets/assign = Asignar ticket a desarrollador
 - GET /tickets/user/{id} = Obtener tickets por usuario

5. Metodos de KPIs:
 - GET /kpi/tickets/status = Tickets por estado
 - GET /kpi/tickets/user = Tickets por usuario