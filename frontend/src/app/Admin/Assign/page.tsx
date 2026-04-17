
// Correr pagina del lado del cliente
'use client'

// Importanciones para la pagina
import { useEffect, useState } from "react";
import { getUsers, getTypes, getTicket, assignTicket } from "@/app/api/api";
import { useRouter } from 'next/navigation';

// Estructura de un usuario
interface User {
  id: number,
  name: string,
  rol: string
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

// Estructura de un tipo de ticket
interface Type {
  id: number,
  type: string,
  description: string,
  area: string
}

export default function Page() {

  // Movimiento entre rutas
  const router = useRouter();

  // Datos del ticket
  const [ticket, setTicket] = useState<Ticket>();
  const [types, setTypes] = useState<Type[]>([]);
  const [assign, setAssign] = useState();
  
  // Datos de todos los usuarios
  const [users, setUsers] = useState<User[]>();

  useEffect(() => {
    const ticketId = localStorage.getItem('ticket_id');
    onInfoTicket(ticketId);
    onGetTypes();
    onGetUsers();
  }, []);

  // Metodo para obtener los datos del usuario
  const onInfoTicket = async (id : string | null) => {
    const Profile = {
      id: Number(id)
    }
    const response = await getTicket(Profile);
    console.log(response.ticket[0])
    setTicket(response.ticket[0]);
    setAssign(response.assigned_to);
  };

  // Obtener todos los usuarios
  const onGetUsers = async () => {
    try {
      const response = await getUsers();
      if (response) {
        setUsers(response.users);
      }
    } catch (err) {
      console.error("Algo salio mal", err)
    }
  };

  // Metodo para obtener todos los tipos de tickets
  const onGetTypes = async () => {
    const response = await getTypes();
    setTypes(response.types);
  };

  // Metodo para guardar los cambios
  const onSaveTicket = async (idUser : number) => {
    if (idUser === 0) {
      console.log("Asigna una persona al ticket")
    }

    try {
      const response = await assignTicket(Number(ticket?.id), idUser)
    }
    catch (err) {
      console.error(err);
    }
  };

  return (
    <div>

      <button onClick={() => router.push('../../Admin')}>Regresar</button>

      <div>
        <label>Ticket asignado a:</label><br/>
        <select value={assign} onChange={(e) => onSaveTicket(Number(e.target.value))}>
          <option value={0}></option>
          {users?.map((user) => (
            <option key={user.id} value={user.id}>{user.rol} - {user.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label>Ticket's id:</label>
        <p>{ticket?.id}</p>
      </div>

      <div>
        <label>Ticket's title:</label>
        <p>{ticket?.title}</p>
      </div>

      <div>
        <label>Ticket's description:</label>
        <p>{ticket?.description}</p>
      </div>

      <div>
        <label>Ticket's type:</label>
        <p>{ticket?.type}</p>
      </div>

      <div>
        <label>Ticket's status:</label>
        <p>{ticket?.status}</p>
      </div>

      <div>
        <label>Ticket's priority:</label>
        <p>{ticket?.priority}</p>
      </div>

      <div>
        <label>Created by:</label>
        <p>{ticket?.created_by_name}</p>
      </div>

      <div>
        <label>Created at:</label>
        <p>{ticket?.created_at.split('T')[0]}</p>
      </div>

      <table>
        <thead>
          <tr>
            <th>Assigned to</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>
              
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}