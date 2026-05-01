
// Correr pagina del lado del cliente
'use client'

// Importanciones para la pagina
import { useEffect, useState } from "react";
import { getProfile, getTickets } from "../api/api";
import { useRouter } from 'next/navigation';
import Sidebar from "../Components/sidebar";
import TableTickets from "../Components/tableTickets";

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

// Estructura de un ticket
interface Ticket {
  id: number,
  title: string,
  description: string,
  type: string,
  status: string,
  priority: string,
  created_by_name: string,
  assigned_to: string,
  created_at: string
}

export default function Page() {

  // Movimiento entre rutas
  const router = useRouter();

  // Nombres de pestañas
  const options = ['Home', 'Devs', 'Careers', 'Types', 'Metrics'];

  // Datos del usuario
  const [user, setUser] = useState<User>();
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    onInfoUser(userId);
    onGetTickets();
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

  // Metodo para obtener todos los tickets
  const onGetTickets = async () => {
    try {
      const response = await getTickets();
      if (response.error) {
        console.error(response.error);
        return;
      }
      setTickets(response.tickets);
    }
    catch (err) {
      console.error(err);
    }
    
    
  };

  // Metodo para redireccionar a una pagina y modificar la tabla tickets
  const onModifyTickets = async (action : string) => {
    router.push(`../Admin/${action}`);
  };

  return (
    <div className="main">
      <Sidebar id={user?.id} name={user?.name} last_name={user?.last_name} options={options}/>
      
      <div>
        <p className="title"> Welcome {user?.name}</p>
        <button onClick={() => onModifyTickets('NewTicket')} className="bottonCreate">Create new ticket</button>
      </div>

      <TableTickets ticketsParams={tickets}/>
    </div>
  )
}