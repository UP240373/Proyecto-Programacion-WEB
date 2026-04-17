
// Correr pagina del lado del cliente
'use client'

// Importanciones para la pagina
import { useEffect, useState } from "react";
import { getProfile } from "@/app/api/api";
import { useRouter } from 'next/navigation';
import Sidebar from "../../Components/sidebar"
import TableCareers from "@/app/Components/tableCareers";

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

  // Movimiento entre rutas
  const router = useRouter();

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
      
      <div>
        <p>All of the careers</p>
        <button onClick={() => router.push(`./Careers/NewCareer`)}>Create new career</button>
      </div>

      <TableCareers/>
    </div>
  );
}