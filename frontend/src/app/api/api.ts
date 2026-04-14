
const API = "http://localhost:3000";

interface user {
  id?: number,
  email?: string,
  password?: string
}

/*

  Metodos;
  login = POST /auth/login
  getProfile = GET /auth/profile

*/

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
