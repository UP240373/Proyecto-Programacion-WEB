
// Correr pagina del lado del cliente
'use client'

// Importanciones para la pagina
import { useEffect, useState } from "react";
import { getProfile, getTickets } from "../api/api";
import Sidebar from "../Components/sidebar";

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
  created_at: string
}

export default function Page() {

  // Nombres de pestañas
  const options = ['Devs', 'Careers', 'Types', 'Metrics'];

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
    const response = await getProfile(profile);
    setUser(response.user[0]);
  };

  // Metodo para obtener todos los tickets
  const onGetTickets = async () => {
    const response = await getTickets();
    if (response.error) {
      console.error(response.error);
      return;
    }
    setTickets(response.tickets);
  };

  return (
    <div>
      <Sidebar id={user?.id} name={user?.name} last_name={user?.last_name} options={options}/>
      <p> Bienvenida {user?.name}</p>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Type</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Created by</th>
            <th>Created at</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket.id}>
              <td>{ticket.id}</td>
              <td>{ticket.title}</td>
              <td>{ticket.description}</td>
              <td>{ticket.type}</td>
              <td>{ticket.status}</td>
              <td>{ticket.priority}</td>
              <td>{ticket.created_by_name}</td>
              <td>{ticket.created_at.split('T')[0]}</td>
              <td>
                <button>Assign</button>
                <button>Editar</button>
                <button>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
        
      </table>
    </div>
  )
}