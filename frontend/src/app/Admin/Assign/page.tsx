
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
    <div className="main">

      <button onClick={() => router.push('../../Admin')} className="bottonReturn">Return</button>

      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
        <div className="divInfo">
          <label className="titleInfo">Ticket asignado a:</label><br/>
          <select value={assign} onChange={(e) => onSaveTicket(Number(e.target.value))} className="selectInfo">
            <option value={0}></option>
            {users?.map((user) => (
              <option key={user.id} value={user.id}>{user.rol} - {user.name}</option>
            ))}
          </select>
        </div>

        <div className="divInfo">
          <label className="titleInfo">Ticket's id:</label>
          <p className="textInfo">{ticket?.id}</p>
        </div>

        <div className="divInfo">
          <label className="titleInfo">Ticket's title:</label>
          <p className="textInfo">{ticket?.title}</p>
        </div>

        <div className="divInfo">
          <label className="titleInfo">Ticket's description:</label>
          <p className="textInfo">{ticket?.description}</p>
        </div>

        <div className="divInfo">
          <label className="titleInfo">Ticket's type:</label>
          <p className="textInfo">{ticket?.type}</p>
        </div>

        <div className="divInfo">
          <label className="titleInfo">Ticket's status:</label>
          <p className="textInfo">{ticket?.status}</p>
        </div>

        <div className="divInfo">
          <label className="titleInfo">Ticket's priority:</label>
          <p className="textInfo">{ticket?.priority}</p>
        </div>

        <div className="divInfo">
          <label className="titleInfo">Created by:</label>
          <p className="textInfo">{ticket?.created_by_name}</p>
        </div>

        <div className="divInfo">
          <label className="titleInfo">Created at:</label>
          <p className="textInfo">{ticket?.created_at.split('T')[0]}</p>
        </div>
      </div>
    </div>
  );
}