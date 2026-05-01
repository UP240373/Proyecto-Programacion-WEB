
// Importanciones para la pagina
import { getTickets, changeStatusTicket } from '../api/api';
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
  name: string | undefined
}

export default function TableTicketsByUsers({ name } : tableParams) {

  // Datos de todos los tickets
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    onGetTickets();
  }, [tickets]);

  // Obtener tickets
  const onGetTickets = async () => {
    try {
      const response = await getTickets();
      if (response) {
        const filteredTickets = response.tickets.filter((ticket : Ticket) => {
          // Split por coma y trim para limpiar espacios
          const names = ticket.assigned_to.split(',').map((n : string) => n.trim());
          // Verificar si targetName está en la lista
          return names.includes(name ?? '');
        });
        setTickets(filteredTickets);
      }
    } catch (err) {
      console.error("Algo salio mal", err)
    }
  };

  // Modificar el estado de un ticket
  const onChangeStatus = async (id: number, status : string) => {
    const changeStatus = {
      status: status
    }
    console.log(id, changeStatus)
    try {
      const response = await changeStatusTicket(id, changeStatus);
      if (response.err) {
        console.log(response.err);
      }

      onGetTickets();
    }
    catch (err) {
      console.error(err);
    }
  }
  
  return (
    <table className='table'>
      <thead>
        <tr>
          <th className='tableCells'>ID</th>
          <th className='tableCells'>Title</th>
          <th className='tableCells'>Description</th>
          <th className='tableCells'>Type</th>
          <th className='tableCells'>Status</th>
          <th className='tableCells'>Priority</th>
          <th className='tableCells'>Created by</th>
          <th className='tableCells'>Assign to</th>
          <th className='tableCells'>Created at</th>
        </tr>
      </thead>

      <tbody>
        {tickets.map((ticket) => (
          <tr key={ticket.id}>
            <td className='tableCells'>{ticket.id}</td>
            <td className='tableCells'>{ticket.title}</td>
            <td className='tableCells'>{ticket.description}</td>
            <td className='tableCells'>{ticket.type}</td>
            <td className='tableCells'>
              <select value={ticket.status} onChange={(e) => onChangeStatus(ticket.id, e.target.value)} className='selectInfo'>
                <option value="open">Open</option>
                <option value="in_progress">In progress</option>
                <option value="closed">Closed</option>
              </select>
            </td>
            <td className='tableCells'>{ticket.priority}</td>
            <td className='tableCells'>{ticket.created_by_name}</td>
            <td className='tableCells'>{ticket.assigned_to}</td>
            <td className='tableCells'>{ticket.created_at.split('T')[0]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}