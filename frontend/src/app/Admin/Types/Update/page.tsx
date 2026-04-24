
// Correr pagina del lado del cliente
'use client'

// Importanciones para la pagina
import { useEffect, useState } from "react";
import { getTypes, updateType } from "@/app/api/api";
import { useRouter } from 'next/navigation';

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

  // Datos del tipo
  const [type, setType] = useState<Type>();
  const [newType, setNewType] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [area, setArea] = useState<string>('');

  useEffect(() => {
    const TypeId = localStorage.getItem('type_id');
    onInfoType(Number(TypeId));
  }, []);

  // Metodo para obtener los datos del usuario
  const onInfoType = async (id : number) => {
    const response = await getTypes();

    for (let i = 0; i < response.types.length; i++) {
      if (id == response.types[i].id) {
        setType(response.types[i]);
        setNewType(response.types[i].type);
        setDescription(response.types[i].description);
        setArea(response.types[i].area);
      }
    }
  };

  // Metodo para guardar los cambios
  const onSaveType = async () => {
    const NewType = {
      type: newType,
      description: description,
      area: area
    }

    const response = await updateType(Number(type?.id), NewType)
    if (response.error) {
      console.error(response.error)
    }

    router.push('../../Admin/Types');
  };

  return (
    <div>

      <button onClick={() => router.push('../../Admin/Types')}>Regresar</button>
      
      <div>
        <label>Type:</label><br/>
        <input 
          value={newType}
          onChange={(e) => setNewType(e.target.value)}></input>
      </div>

      <div>
        <label>Description:</label><br/>
        <textarea 
          value={description}
          onChange={(e) => setDescription(e.target.value)}></textarea>
      </div>

      <div>
        <label>Area:</label><br/>
        <input 
          value={area}
          onChange={(e) => setArea(e.target.value)}></input>
      </div>

      <button onClick={() => onSaveType()}>Guardar cambios</button>
    </div>
  );
}