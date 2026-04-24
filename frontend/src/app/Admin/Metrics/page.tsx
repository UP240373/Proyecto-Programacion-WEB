
// Correr pagina del lado del cliente
'use client'

// Importanciones para la pagina
import { useEffect, useState } from "react";
import { getProfile } from "@/app/api/api";
import Sidebar from "../../Components/sidebar"
import TableOrderByUsers from "@/app/Components/tableOrderByUsers";
import TableOrderByStatus from "@/app/Components/tableOrderByStatus";

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
  created_at: Date;
}

export default function Page() {

  // Nombres de pestañas
  const options = ['Home', 'Devs', 'Careers', 'Types', 'Metrics'];

  // Datos del usuario
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    onInfoUser(userId);
    }, []);

  // Metodo para obtener los datos del usuario
  const onInfoUser = async (id : string | null) => {
    const profile = {
      id: Number(id)
    }
  
    try {
      const response = await getProfile(profile);
      if (response.error) {
        console.error(response.error);
        return;
      }
      setUser(response.user[0]);
    }
    catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <Sidebar id={user?.id} name={user?.name} last_name={user?.last_name} options={options}/>

      <div style={{display: 'flex', flexDirection: 'row'}}>
        <div>
          <p>Tickets in order by users</p>
          <TableOrderByUsers/>
        </div>

        <div>
          <p>Tickets in order by status</p>
          <TableOrderByStatus/>
        </div>
      </div>
    </div>
  );
}