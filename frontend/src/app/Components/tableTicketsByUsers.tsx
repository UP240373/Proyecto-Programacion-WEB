
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
        </tr>
      </thead>

      <tbody>
        {tickets.map((ticket) => (
          <tr key={ticket.id}>
            <td>{ticket.id}</td>
            <td>{ticket.title}</td>
            <td>{ticket.description}</td>
            <td>{ticket.type}</td>
            <td>
              <select value={ticket.status} onChange={(e) => onChangeStatus(ticket.id, e.target.value)}>
                <option value="open">Open</option>
                <option value="in_progress">In progress</option>
                <option value="closed">Closed</option>
              </select>
            </td>
            <td>{ticket.priority}</td>
            <td>{ticket.created_by_name}</td>
            <td>{ticket.assigned_to}</td>
            <td>{ticket.created_at.split('T')[0]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}