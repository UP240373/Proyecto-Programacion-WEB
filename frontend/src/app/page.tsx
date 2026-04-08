
// Correr pagina del lado del cliente
'use client'

// Importancias para la pagina
import { useEffect, useState } from "react";

// Estructura de cada usuario
interface User {
  id: number;
  name: string;
  last_name: string;
  username: string;
  email: string;
  career_id: number;
  active: number;
  password: string;
  rol: string;
  failed_attempts: number;
  created_at: string;
}

export default function Home() {

  // Lista de usuarios
  const [users, setUsers] = useState<User[]>([])

  // Correr funcion al iniciar la pagina
  useEffect(() => {
    onGetAPI();
  }, []);

  const API = "http://localhost:3000/users";

  const onGetAPI = async () => {
    const response = await fetch(API);
    const data = await response.json();
    setUsers(data.users);
  };

  return (
    <main>
      <div>
        {users.map((user) => (
          <div key={user.id}>
            <h3>{user.name} {user.last_name}</h3>
            <p>Email: {user.email}</p>
            <p>Rol: {user.rol}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
