
const API = "http://localhost:3000";

interface user {
  id?: number,
  email?: string,
  password?: string
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

  Metodos para careers:

  Metodos para types y categories:
  getTypes = GET /types

  Metodos para tickets:
  getTickets = GET /tickets
  createTicket = POST /tickets
  getTicket = GET /tickets/:id
  updateTicket = PUT /tickets/:id
  deleteTicket = DELETE /tickets
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
