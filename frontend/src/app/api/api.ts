
const API = "http://localhost:3000";

interface user {
  id?: number,
  email?: string,
  password?: string
}

/*

  Metodos para login:
  login = POST /auth/login
  getProfile = POST /auth/profile
  logout = POST /auth/logout

  Metodos para users:

  Metodos para careers:

  Metodos para types y categories:

  Metodos para tickets:
  getTickets = GET /tickets

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
