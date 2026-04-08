
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
Aqui se encuentran todos los pedos que se pueden realizar dentro del programa utilizando una APi:
 - GET /users = Obtener todos los usuarios de la base de datos.