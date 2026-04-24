
// Correr pagina del lado del cliente
'use client'

// Importanciones para la pagina
import { useEffect, useState } from "react";
import { getProfile } from "../api/api";
import Sidebar from "../Components/sidebar";
import TableTicketsByUsers from "../Components/tableTicketsByUsers";

// Estructura del usuario
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

export default function Page() {

  // Datos del usuario
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    onInfoUser(userId);
  }, []);

  // Metodo para obtener los datos del usuario
  const onInfoUser = async (id : string | null) => {
    console.log(localStorage.getItem('user_id'));
    const profile = {
      id: Number(id)
    }
    const response = await getProfile(profile);
    setUser(response.user[0]);
  };

  return (
    <div>
      <Sidebar id={user?.id} name={user?.name} last_name={user?.last_name}/>

      <div>
        <p> Bienvenida {user?.name}</p>
        <button>Edit my account</button>
      </div>

      <TableTicketsByUsers name={user?.name}/>

    </div>
  )
}