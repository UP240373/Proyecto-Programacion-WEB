
// Correr pagina del lado del cliente
'use client'

// Importanciones para la pagina
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { getProfile, getTypes, createTicket } from "@/app/api/api";

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

  // Mensaje por si hay un error
  const [message, setMessage] = useState<string>("");

  // Datos del usuario
  const [user, setUser] = useState<User>();

  // Datos para un nuevo ticket
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [type, setType] = useState<number>(0);
  const [priority, setPriority] = useState<string>("");

  // Tipos de tickets
  const [types, setTypes] = useState<Type[]>();

  useEffect(() => {
    const userId = localStorage.getItem('ticket_id');
    onInfoUser(userId);
    onGetTypes();
  }, []);

  // Metodo para obtener el usuario
  const onInfoUser = async (id : string | null) => {
    const Profile = {
      id: Number(id)
    }
    try {
      const response = await getProfile(Profile);
      setUser(response.user[0]);
    }
    catch (err) {
      console.error(err);
    }
  };

  // Metodo para obtener todos los tipos
  const onGetTypes = async () => {
    try {
      const response = await getTypes();
      setTypes(response.types);
    }
    catch (err) {
      console.error(err);
    }
  };

  // title, description, status, priority
  // Metodo para crear un ticket
  const onCreateTicket = async () => {

    if (!title) {
      return setMessage("Please enter a title");
    }

    if (type == undefined) {
      return setMessage("Select one type for the ticket please");
    }

    if (!priority) {
      return setMessage("Select the priority for the ticket please");
    }

    const newTicket = {
      title: title,
      description: description,
      type_id: type,
      status: "open",
      priority: priority,
      created_by: user?.id,
    }

    console.log(newTicket);
    try {
      const response = await createTicket(newTicket);
      setMessage(response.message);
    }
    catch (err) {
      console.error(err)
    }
  };

  return (
    <div>

      <button onClick={() => router.push('../../Admin')}>Regresar</button>

      <p>{message}</p>

      <div>
        <label>Title:</label><br/>
        <input 
          value={title} 
          onChange={(e) => setTitle(e.target.value)}
          placeholder="ej. Fallos de conexion en mi computadora"
        ></input>
      </div>

      <div>
        <label>Description:</label><br/>
        <textarea
          value={description} 
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
      </div>

      <div>
        <label>Type:</label><br/>
        <select value={type} onChange={(e) => setType(Number(e.target.value))}>
          <option value={0}></option>
          {types?.map((type) => (
            <option key={type.id} value={type.id}>{type.type}</option>
          ))}
        </select>
      </div>

      <div>
        <label>Priority:</label><br/>
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option></option>
          <option value={"low"}>low</option>
          <option value={"medium"}>medium</option>
          <option value={"high"}>high</option>
        </select>
      </div>

      <button onClick={onCreateTicket}>Crear ticket</button>
    </div>
  );
}