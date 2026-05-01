
// Correr pagina del lado del cliente
'use client'

// Importanciones para la pagina
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { createUser, getCareers } from "@/app/api/api";

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

// Estructura de una carrera
interface Career {
  id: number,
  name: string,
  active: number
}

export default function Page() {

  // Movimiento entre rutas
  const router = useRouter();

  // Mensaje por si hay un error
  const [message, setMessage] = useState<string>("");

  // Carreras
  const [careers, setCareers] = useState<Career[]>([]);

  // Datos para un nuevo desarrollador
  const [name, setName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [careerId, setCareerId] = useState<number>();
  const [active, setActive] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rol, setRol] = useState<string>("");

  useEffect(() => {
    onGetCareers();
  }, [])

  // Metodo para obtener todas las carreras
  const onGetCareers = async () => {
    try {
      const response = await getCareers();
      setCareers(response.careers);
    }
    catch (err) {
      console.error(err);
    }
  };
  
  // Metodo para crear un usuario
  const onCreateUser = async () => {
  
    if (!name) {
      return setMessage("Please enter a name");
    }

    if (!lastName) {
      return setMessage("Please enter last name");
    }

    if (!username) {
      return setMessage("Please enter a username");
    }

    if (!email) {
      return setMessage("Please enter a email");
    }

    if (careerId == 0) {
      return setMessage("Please enter a career");
    }

    if (!password) {
      return setMessage("Please enter a password");
    }

    if (!rol) {
      return setMessage("Please enter a rol");
    }
  
    const newDev = {
      name: name,
      last_name: lastName,
      username: username,
      email: email,
      career_id: careerId,
      active: 0,
      password: password,
      rol: rol
    }

    try {
      const response = await createUser(newDev);
      setMessage(response.message);
    }
    catch (err) {
      console.error(err)
    }
  };
  
  return (
    <div className="main">
      <button onClick={() => router.push('../../Admin/Devs')} className="bottonReturn">Return</button>

      <h1 className="message" style={{ color: 'var(--color1)' }}>{message}</h1>

      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
        <div className="divInfo">
          <label className="titleInfo">Name:</label><br/>
          <input 
            value={name} 
            onChange={(e) => setName(e.target.value)}
            className="inputInfo"
          ></input>
        </div>

        <div className="divInfo">
          <label className="titleInfo">Last Name:</label><br/>
          <input 
            value={lastName} 
            onChange={(e) => setLastName(e.target.value)}
            className="inputInfo"
          ></input>
        </div>

        <div className="divInfo">
          <label className="titleInfo">Username:</label><br/>
          <input 
            value={username} 
            onChange={(e) => setUsername(e.target.value)}
            className="inputInfo"
          ></input>
        </div>

        <div className="divInfo">
          <label className="titleInfo">Email:</label><br/>
          <input 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@gmail.com"
            className="inputInfo"
          ></input>
        </div>

        <div className="divInfo">
          <label className="titleInfo">Career:</label><br/>
          <select value={careerId} onChange={(e) => setCareerId(Number(e.target.value))} className="selectInfo">
            <option value={0}>Select a career</option>
            {careers.map((career) => (
              <option value={career.id} key={career.id}>{career.active == 1 ? career.name : undefined}</option>
            ))}
          </select>
        </div>

        <div className="divInfo">
          <label className="titleInfo">Password:</label><br/>
          <input 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            className="inputInfo"
          ></input>
        </div>

        <div className="divInfo">
          <label className="titleInfo">Rol:</label><br/>
          <select value={rol} onChange={(e) => setRol(e.target.value)} className="selectInfo">
            <option value="">Select rol</option>
            <option value="Admin">Admin</option>
            <option value="dev">Dev</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', placeItems: 'center' }}>
        <button onClick={onCreateUser} className="bottonInfo">Create dev</button>
      </div>
    </div>
  );
}