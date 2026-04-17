
// Importanciones para la pagina
import { useRouter } from 'next/navigation';
import { getTickets, deleteTicket } from '../api/api';
import { useEffect, useState } from 'react';

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

interface tableParams {
  ticketsParams: Ticket[]
}

export default function TableTickets({ticketsParams} : tableParams) {

  // Movimiento entre rutas
  const router = useRouter();

  // Datos de todos los tickets
  const [tickets, setTickets] = useState<Ticket[]>(ticketsParams);

  useEffect(() => {
    onGetTickets();
  }, [tickets])
  
  // Obtener tickets
  const onGetTickets = async () => {
    try {
      const response = await getTickets();
      if (response) {
        setTickets(response.tickets);
      }
    } catch (err) {
      console.error("Algo salio mal", err)
    }
  };

  // Metodo para borrar un ticket
  const onDeleteTicket = async (id : number) => {
    const Profile = {
      id: id,
    }

    const response = await deleteTicket(Profile);
    if (response.error) {
      console.error(response.error);
    }
    onGetTickets();
  };

  // Metodo para redireccionar a una pagina y modificar la tabla tickets
  const onModifyTickets = async (action : string, id : string) => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
      localStorage.setItem('ticket_id', id);
      });
    } else {
      // DOM ya está cargado, ejecutar inmediatamente
      localStorage.setItem('ticket_id', id);
    }
    router.push(`../Admin/${action}`);
  };

  return (
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
          <th>Assign to</th>
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
            <td>{ticket.assigned_to}</td>
            <td>{ticket.created_at.split('T')[0]}</td>
            <td>
              <button onClick={() => onModifyTickets("Assign", String(ticket.id))}>Assign</button>
              <button onClick={() => onModifyTickets("Update", String(ticket.id))}>Editar</button>
              <button onClick={() => onDeleteTicket(ticket.id)}>Eliminar</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}