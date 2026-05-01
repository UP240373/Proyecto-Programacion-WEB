
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

    try {
      const response = await createTicket(newTicket);
      setMessage(response.message);
    }
    catch (err) {
      console.error(err)
    }
  };

  return (
    <div className="main">

      <button onClick={() => router.push('../../Admin')} className="bottonReturn">Return</button>

      <h1 className="message" style={{ color: 'var(--color1)' }}>{message}</h1>

      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
        <div className="divInfo">
          <label className="titleInfo">Title:</label><br/>
          <input 
            value={title} 
            onChange={(e) => setTitle(e.target.value)}
            placeholder="ej. Fallos de conexion en mi computadora"
            className="inputInfo"
          ></input>
        </div>

        <div className="divInfo">
          <label className="titleInfo">Description:</label><br/>
          <textarea
            value={description} 
            onChange={(e) => setDescription(e.target.value)}
            className="textAreaInfo"
          ></textarea>
        </div>

        <div className="divInfo">
          <label className="titleInfo">Type:</label><br/>
          <select value={type} onChange={(e) => setType(Number(e.target.value))} className="selectInfo">
            <option value={0}></option>
            {types?.map((type) => (
              <option key={type.id} value={type.id}>{type.type}</option>
            ))}
          </select>
        </div>

        <div className="divInfo">
          <label className="titleInfo">Priority:</label><br/>
          <select value={priority} onChange={(e) => setPriority(e.target.value)} className="selectInfo">
            <option></option>
            <option value={"low"}>low</option>
            <option value={"medium"}>medium</option>
            <option value={"high"}>high</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', placeItems: 'center' }}>
        <button onClick={onCreateTicket} className="bottonInfo">Create ticket</button>
      </div>
    </div>
  );
}