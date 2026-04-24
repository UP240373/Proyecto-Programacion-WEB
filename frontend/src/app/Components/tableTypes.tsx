
// Importanciones para la pagina
import { useRouter } from 'next/navigation';
import { getTypes, deleteType } from '../api/api';
import { useEffect, useState } from 'react';

// Estructura de un tipo
interface Type {
  id: number;
  type: string;
  description: string;
  area: string;
}

export default function TableDevs() {

  // Movimiento entre rutas
  const router = useRouter();

  // Datos de todos los desarrolladores
  const [types, setTypes] = useState<Type[]>();

  useEffect(() => {
    onGetTypes();
  }, [types]);

  // Obtener tipos
  const onGetTypes = async () => {
    try {
      const response = await getTypes();
      if (response) {
        setTypes(response.types);
      }
    } catch (err) {
      console.error("Algo salio mal", err)
    }
  };

  // Metodo para borrar un tipo
  const onDeleteType = async (id : number) => {
    const Profile = {
      id: id,
    }
  
    try {
      const response = await deleteType(Profile);
      if (response && response.error) {
        console.log(response.error);
        return;
      }
      onGetTypes();
    }
    catch (err) {
      console.log(err);
    }
  };

  // Metodo para redireccionar a una pagina y modificar la tabla tipos
  const onModifyTypes = async (id : string) => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
      localStorage.setItem('type_id', id);
      });
    } else {
      // DOM ya está cargado, ejecutar inmediatamente
      localStorage.setItem('type_id', id);
    }
    router.push(`../Admin/Types/Update`);
  };

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Type</th>
          <th>Description</th>
          <th>Area</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {types?.map((type) => (
          <tr key={type.id}>
            <td>{type.id}</td>
            <td>{type.type}</td>
            <td>{type.description}</td>
            <td>{type.area}</td>
            <td>
              <button onClick={() => onModifyTypes(String(type.id))}>Edit</button>
              <button onClick={() => onDeleteType(type.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
