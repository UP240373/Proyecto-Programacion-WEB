
// Importanciones para la pagina
import { getTicketsByStatus } from '../api/api';
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

export default function TableOrderByStatus() {

  // Datos de todos los tickets
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    onGetTickets();
  }, [tickets])
  
  // Obtener tickets
  const onGetTickets = async () => {
    try {
      const response = await getTicketsByStatus();
      if (response) {
        setTickets(response.tickets);
      }
    } catch (err) {
      console.error("Algo salio mal", err)
    }
  };

  return (
    <table className='table'>
      <thead>
        <tr>
          <th className='tableCells'>ID</th>
          <th className='tableCells'>Title</th>
          <th className='tableCells'>Type</th>
          <th className='tableCells'>Status</th>
          <th className='tableCells'>Priority</th>
          <th className='tableCells'>Assign to</th>
          <th className='tableCells'>Created at</th>
        </tr>
      </thead>

      <tbody>
        {tickets.map((ticket) => (
          <tr key={ticket.id}>
            <td className='tableCells'>{ticket.id}</td>
            <td className='tableCells'>{ticket.title}</td>
            <td className='tableCells'>{ticket.type}</td>
            <td className='tableCells'>{ticket.status}</td>
            <td className='tableCells'>{ticket.priority}</td>
            <td className='tableCells'>{ticket.assigned_to}</td>
            <td className='tableCells'>{ticket.created_at.split('T')[0]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}