
// Correr pagina del lado del cliente
'use client'

// Importanciones para la pagina
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { createType } from "@/app/api/api";

// Estructura de un tipo
interface Type {
  id: number;
  type: string;
  description: string;
  area: string;
}

export default function Page() {

  // Movimiento entre rutas
  const router = useRouter();

  // Mensaje por si hay un error
  const [message, setMessage] = useState<string>("");

  // Datos para un nuevo tipo
  const [type, setType] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [area, setArea] = useState<string>("");
  
  // Metodo para crear un tipo
  const onCreateType = async () => {
  
    if (!type) {
      return setMessage("Please enter a type");
    }

    if (!description) {
      return setMessage("Please enter a description");
    }

    if (!area) {
      return setMessage("Please enter an area");
    }
  
    const newType = {
      type: type,
      description: description,
      area: area
    }

    try {
      const response = await createType(newType);
      setMessage(response.message);
    }
    catch (err) {
      console.error(err)
    }
  };
  
  return (
    <div>
      <button onClick={() => router.push('../../Admin/Types')}>Regresar</button>

      <p>{message}</p>

      <div>
        <label>Type:</label><br/>
        <input 
          value={type} 
          onChange={(e) => setType(e.target.value)}
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
        <label>Area:</label><br/>
        <input 
          value={area} 
          onChange={(e) => setArea(e.target.value)}
        ></input>
      </div>

      <button onClick={onCreateType}>Create type</button>
    </div>
  );
}