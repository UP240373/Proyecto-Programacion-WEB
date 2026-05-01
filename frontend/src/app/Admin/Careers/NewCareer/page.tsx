
// Correr pagina del lado del cliente
'use client'

// Importanciones para la pagina
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { createCareer } from "@/app/api/api";

// Estructura de una carrera
interface Career {
  id: number,
  name: string,
  active: boolean
}

export default function Page() {

  // Movimiento entre rutas
  const router = useRouter();

  // Mensaje por si hay un error
  const [message, setMessage] = useState<string>("");

  // Datos para un nueva carrera
  const [name, setName] = useState<string>("");
  
  // Metodo para crear un ticket
  const onCreateCareer = async () => {
  
    if (!name) {
      return setMessage("Please enter a name");
    }
  
    const newCareer = {
      name: name,
      active: true
    }

    try {
      const response = await createCareer(newCareer);
      setMessage(response.message);
    }
    catch (err) {
      console.error(err)
    }
  };
  
  return (
    <div className="main">
      <button onClick={() => router.push('../../Admin/Careers')} className="bottonReturn">Return</button>

      <h1 className="message" style={{ color: 'var(--color1)' }}>{message}</h1>

      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
        <div className="divInfo">
          <label className="titleInfo">Name:</label><br/>
          <input 
            value={name} 
            onChange={(e) => setName(e.target.value)}
            placeholder="ej. Biologia"
            className="inputInfo"
          ></input>
        </div>
      </div>

      <div style={{ display: 'grid', placeItems: 'center' }}>
        <button onClick={onCreateCareer} className="bottonInfo">Create career</button>
      </div>
    </div>
  );
}