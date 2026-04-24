
const API = "http://localhost:3000";

interface user {
  id?: number,
  email?: string,
  password?: string
}

interface career {
  id?: number,
  name?: string,
  active?: boolean
}

interface ticket {
  id?: number,
  title?: string,
  description?: string,
  type_id?: number,
  status?: string,
  priority?: string,
  created_by_name?: string,
  created_at?: string
}

/*

  Metodos para login:
  login = POST /auth/login
  getProfile = POST /auth/profile
  logout = POST /auth/logout

  Metodos para users:
  getUsers = GET /users
  getUser = GET /users/:id
  createUser = POST /users
  updateUser = PUT /users/:id
  deleteUser = DELETE /users/:id

  Metodos para careers:
  getCareers = GET /careers
  createCareer = POST /careers
  updateCareer = PUT /careers/:id
  deleteCareers = DELETE /careers/:id

  Metodos para types y categories:
  getTypes = GET /types

  Metodos para tickets:
  getTickets = GET /tickets
  createTicket = POST /tickets
  getTicket = GET /tickets/:id
  updateTicket = PUT /tickets/:id
  deleteTicket = DELETE /tickets/:id
  assignTicket = POST /tickets/assign

  Metodos para KPIs:

*/

// Realizar el login
export const login = async (cuerpo : user) => {
  try {
    const response = await fetch(`${API}/auth/login`, {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cuerpo)
    })
    const data = response.json();
    return data;
  }
  catch (err) {
    console.error("Algo salio mal", err)
  }
};

// Obtener el usuario
export const getProfile = async (cuerpo : user) => {
  try {
    const response = await fetch(`${API}/auth/profile`, {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cuerpo)
    })
    const data = response.json();
    return data;
  }
  catch (err) {
    console.error("Algo salio mal", err)
  }
};

// Realizar el logout
export const logout = async (cuerpo : user) => {
  try {
    const response = await fetch(`${API}/auth/logout`, {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cuerpo)
    })
    const data = response.json();
    return data;
  }
  catch (err) {
    console.error("Algo salio mal", err)
  }
};

// Obtener todos los usuarios
export const getUsers = async () => {
  try {
    const response = await fetch(`${API}/users`, {
      method: 'GET', 
      headers: {
        'Content-Type': 'application/json',
      }
    })
    const data = response.json();
    return data;
  }
  catch (err) {
    console.error("Algo salio mal", err)
  }
};

// Obtener un usuario en especifico
export const getUser = async (cuerpo : user) => {
  try {
    const response = await fetch(`${API}/users/${cuerpo.id}`, {
      method: 'GET', 
      headers: {
        'Content-Type': 'application/json',
      }
    })
    const data = response.json();
    return data;
  }
  catch (err) {
    console.error("Algo salio mal", err)
  }
};

// Crear un nuevo usuario
export const createUser = async (cuerpo : user) => {
  try {
    const response = await fetch(`${API}/users`, {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cuerpo)
    })
    const data = response.json();
    return data;
  }
  catch (err) {
    console.error("Algo salio mal", err)
  }
};

// Actualizar un usuario
export const updateUser = async (id : number, cuerpo : user) => {
  try {
    const response = await fetch(`${API}/users/${id}`, {
      method: 'PUT', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cuerpo)
    })
    const data = response.json();
    return data;
  }
  catch (err) {
    console.error("Algo salio mal", err)
  }
};

// Borrar un usuario
export const deleteUser = async (cuerpo : user) => {
  try {
    const response = await fetch(`${API}/users/${cuerpo.id}`, {
      method: 'DELETE', 
      headers: {
        'Content-Type': 'application/json',
      }
    })
    const data = await response.json();
    return data;
  }
  catch (err) {
    console.error("Algo salio mal", err);
  }
};

// Obtener todas las carreras
export const getCareers = async () => {
  try {
    const response = await fetch(`${API}/careers`, {
      method: 'GET', 
      headers: {
        'Content-Type': 'application/json',
      }
    })
    const data = response.json();
    return data;
  }
  catch (err) {
    console.error("Algo salio mal", err);
    throw err;
  }
};

// Actualizar un carrera
export const updateCareer = async (id : number, cuerpo : career) => {
  try {
    const response = await fetch(`${API}/careers/${id}`, {
      method: 'PUT', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cuerpo)
    })
    const data = response.json();
    return data;
  }
  catch (err) {
    console.error("Algo salio mal", err)
  }
};

// Crear una nueva carrera
export const createCareer = async (cuerpo : career) => {
  try {
    const response = await fetch(`${API}/careers`, {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cuerpo)
    })
    const data = response.json();
    return data;
  }
  catch (err) {
    console.error("Algo salio mal", err)
  }
};

// Borrar una carrera
export const deleteCareer = async (cuerpo : career) => {
  try {
    const response = await fetch(`${API}/careers/${cuerpo.id}`, {
      method: 'DELETE', 
      headers: {
        'Content-Type': 'application/json',
      }
    })
    const data = await response.json();
    return data;
  }
  catch (err) {
    console.error("Algo salio mal", err);
  }
};

// Obtener todos los tipos de tickets
export const getTypes = async () => {
  try {
    const response = await fetch(`${API}/types`, {
      method: 'GET', 
      headers: {
        'Content-Type': 'application/json',
      }
    })
    const data = response.json();
    return data;
  }
  catch (err) {
    console.error("Algo salio mal", err)
  }
};

// Obtener todos los tickets
export const getTickets = async () => {
  try {
    const response = await fetch(`${API}/tickets`, {
      method: 'GET', 
      headers: {
        'Content-Type': 'application/json',
      }
    })
    const data = response.json();
    return data;
  }
  catch (err) {
    console.error("Algo salio mal", err)
  }
};

// Crear un nuevo ticket
export const createTicket = async (cuerpo : ticket) => {
  try {
    const response = await fetch(`${API}/tickets`, {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cuerpo)
    })
    const data = response.json();
    return data;
  }
  catch (err) {
    console.error("Algo salio mal", err)
  }
};

// Obtener un usuario en especifico
export const getTicket = async (cuerpo : ticket) => {
  try {
    const response = await fetch(`${API}/tickets/${cuerpo.id}`, {
      method: 'GET', 
      headers: {
        'Content-Type': 'application/json',
      }
    })
    const data = response.json();
    return data;
  }
  catch (err) {
    console.error("Algo salio mal", err)
  }
};

// Cambiar estado de un ticket
export const changeStatusTicket = async (id : number, cuerpo : ticket) => {
  try {
    const response = await fetch(`${API}/tickets/${id}/status`, {
      method: 'PATCH', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cuerpo)
    })
    const data = response.json();
    return data;
  }
  catch (err) {
    console.error("Algo salio mal", err)
  }
};

// Actualizar un ticket
export const updateTicket = async (id : number, cuerpo : ticket) => {
  try {
    const response = await fetch(`${API}/tickets/${id}`, {
      method: 'PUT', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cuerpo)
    })
    const data = response.json();
    return data;
  }
  catch (err) {
    console.error("Algo salio mal", err)
  }
};

// Borrar un ticket
export const deleteTicket = async (cuerpo : ticket) => {
  try {
    const response = await fetch(`${API}/tickets/${cuerpo.id}`, {
      method: 'DELETE', 
      headers: {
        'Content-Type': 'application/json',
      }
    })
    const data = response.json();
    return data;
  }
  catch (err) {
    console.error("Algo salio mal", err)
  }
};

export const assignTicket = async (id_ticket : number, id_user : number) => {
  const cuerpo = {
    id_ticket: id_ticket,
    id_user: id_user
  }

  try {
    const response = await fetch(`${API}/tickets/assign`, {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cuerpo)
    })
    const data = response.json();
    return data;
  }
  catch (err) {
    console.error("Algo salio mal", err)
  }
};
