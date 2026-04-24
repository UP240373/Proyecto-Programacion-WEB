
// Importanciones para la pagina
import { getTicketsByUsers } from '../api/api';
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

export default function TableOrderByUsers() {

  // Datos de todos los tickets
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    onGetTickets();
  }, [tickets])
  
  // Obtener tickets
  const onGetTickets = async () => {
    try {
      const response = await getTicketsByUsers();
      if (response) {
        setTickets(response.tickets);
      }
    } catch (err) {
      console.error("Algo salio mal", err)
    }
  };

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Title</th>
          <th>Type</th>
          <th>Status</th>
          <th>Priority</th>
          <th>Assign to</th>
          <th>Created at</th>
        </tr>
      </thead>

      <tbody>
        {tickets.map((ticket) => (
          <tr key={ticket.id}>
            <td>{ticket.id}</td>
            <td>{ticket.title}</td>
            <td>{ticket.type}</td>
            <td>{ticket.status}</td>
            <td>{ticket.priority}</td>
            <td>{ticket.assigned_to}</td>
            <td>{ticket.created_at.split('T')[0]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}