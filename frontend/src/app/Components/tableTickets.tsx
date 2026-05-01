
// Importanciones para la pagina
import { useRouter } from 'next/navigation';
import { getTickets, deleteTicket } from '../api/api';
import { useEffect, useState } from 'react';

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
    <table className='table'>
      <thead>
        <tr className='tableTitles'>
          <th className='tableCells'>ID</th>
          <th className='tableCells'>Title</th>
          <th className='tableCells'>Description</th>
          <th className='tableCells'>Type</th>
          <th className='tableCells'>Status</th>
          <th className='tableCells'>Priority</th>
          <th className='tableCells'>Created by</th>
          <th className='tableCells'>Assign to</th>
          <th className='tableCells'>Created at</th>
          <th className='tableCells'>Actions</th>
        </tr>
      </thead>

      <tbody>
        {tickets.map((ticket) => (
          <tr key={ticket.id}>
            <td className='tableCells'>{ticket.id}</td>
            <td className='tableCells'>{ticket.title}</td>
            <td className='tableCells'>{ticket.description}</td>
            <td className='tableCells'>{ticket.type}</td>
            <td className='tableCells'>{ticket.status}</td>
            <td className='tableCells'>{ticket.priority}</td>
            <td className='tableCells'>{ticket.created_by_name}</td>
            <td className='tableCells'>{ticket.assigned_to}</td>
            <td className='tableCells'>{ticket.created_at.split('T')[0]}</td>
            <td className='tableCells'>
              <button className='botton' onClick={() => onModifyTickets("Assign", String(ticket.id))}>Assign</button>
              <button className='botton' onClick={() => onModifyTickets("Update", String(ticket.id))}>Edit</button>
              <button className='botton' onClick={() => onDeleteTicket(ticket.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}