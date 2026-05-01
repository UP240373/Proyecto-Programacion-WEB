
// Correr pagina del lado del cliente
'use client'

// Importanciones para la pagina
import { useEffect, useState } from "react";
import { getCareers, updateCareer} from "@/app/api/api";
import { useRouter } from 'next/navigation';

// Estructura de una carrera
interface Career {
  id: number,
  name: string,
  active: boolean
}

export default function Page() {

  // Movimiento entre rutas
  const router = useRouter();

  // Datos del ticket
  const [career, setCareer] = useState<Career>();
  const [name, setName] = useState<string>('');
  const [active, setActive] = useState<string>();

  // Mensajes
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const CareerId = localStorage.getItem('career_id');
    onInfoCareer(CareerId);
  }, []);

  // Metodo para obtener los datos del usuario
  const onInfoCareer = async (id : string | null) => {
    const response = await getCareers();

    if (response && !response.error) {
      for (let i = 0; i < response.careers.length; i++) {
        if (id == response.careers[i].id) {
          setCareer(response.careers[i]);
          setName(response.careers[i].name);
          setActive(response.careers[i].active);
        }
      }
    }
  };

  // Metodo para guardar los cambios
  const onSaveCareer = async () => {
    const NewCareer = {
      name: name,
      active: active == "1" ? true : false 
    }

    const response = await updateCareer(Number(career?.id), NewCareer)
    if (response.error) {
      console.error(response.error)
    }

    router.push('../../Admin/Careers');
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
            className="inputInfo"
          ></input>
        </div>

        <div className="divInfo">
          <label className="titleInfo">Active:</label><br/>
          <select value={active} onChange={(e) => setActive(e.target.value)} className="selectInfo">
            <option value="1">Yes</option>
            <option value="0">No</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', placeItems: 'center' }}>
        <button onClick={() => onSaveCareer()} className="bottonInfo">Guardar cambios</button>
      </div>
    </div>
  );
}