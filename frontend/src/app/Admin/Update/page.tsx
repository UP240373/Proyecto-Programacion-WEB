
// Correr pagina del lado del cliente
'use client'

// Importanciones para la pagina
import { useEffect, useState } from "react";
import { getTypes, getTicket, updateTicket } from "@/app/api/api";
import { useRouter } from 'next/navigation';

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
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [type, setType] = useState<number>();
  const [status, setStatus] = useState<string>('');
  const [priority, setPriority] = useState<string>('');

  useEffect(() => {
    const ticketId = localStorage.getItem('ticket_id');
    onInfoTicket(ticketId);
    onGetTypes();
  }, []);

  // Metodo para obtener los datos del usuario
  const onInfoTicket = async (id : string | null) => {
    const Profile = {
      id: Number(id)
    }
    const response = await getTicket(Profile);
    setTicket(response.ticket[0]);
    setTitle(response.ticket[0].title);
    setDescription(response.ticket[0].description);
    setType(response.ticket[0].type);
    setStatus(response.ticket[0].status);
    setPriority(response.ticket[0].priority);
  };

  // Metodo para obtener todos los tipos de tickets
  const onGetTypes = async () => {
    const response = await getTypes();
    setTypes(response.types);
  };

  // Metodo para guardar los cambios
  const onSaveTicket = async () => {
    if (type === undefined) {
      console.log("Selecionar un tipo");
      return;
    }

    const NewTicket = {
      title: title,
      description: description,
      type_id: type,
      status: status,
      priority: priority,
    }

    const response = await updateTicket(Number(ticket?.id), NewTicket)
    if (response.error) {
      console.log(response.error)
    }

    router.push('../../Admin');
  };

  return (
    <div>

      <button onClick={() => router.push('../../Admin')}>Regresar</button>
      
      <div>
        <label>Title</label><br/>
        <input 
          value={title}
          onChange={(e) => setTitle(e.target.value)}></input>
      </div>

      <div>
        <label>Description</label><br/>
        <textarea 
          value={description}
          onChange={(e) => setDescription(e.target.value)}></textarea>
      </div>

      <div>
        <label>Type</label><br/>
        <select value={type} onChange={(e) => setType(Number(e.target.value))}>
          <option value={0}>Seleccionar un tipo</option>
          {types.map((type) => (
            <option key={type.id} value={type.id}>{type.type}</option>
          ))}
        </select>
      </div>

      <div>
        <label>Status</label><br/>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="open">Open</option>
          <option value="in_progress">In progress</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      <div>
        <label>Priority</label><br/>
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <button onClick={() => onSaveTicket()}>Guardar cambios</button>
    </div>
  );
}