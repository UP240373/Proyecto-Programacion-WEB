
// Importanciones para la pagina
import { useRouter } from 'next/navigation';
import { getCareers, deleteCareer } from '../api/api';
import { useEffect, useState } from 'react';

// Estructura de un ticket
interface Career {
  id: number,
  name: string,
  active: boolean
}

export default function TableCareers() {

  // Movimiento entre rutas
  const router = useRouter();

  // Datos de todas las carreras
  const [careers, setCareers] = useState<Career[]>();

  useEffect(() => {
    onGetCareers();
  }, [careers]);

  // Obtener tickets
  const onGetCareers = async () => {
    try {
      const response = await getCareers();
      if (response) {
        setCareers(response.careers);
      }
    } catch (err) {
      console.error("Algo salio mal", err)
    }
  };

  // Metodo para borrar una carrera
  const onDeleteCareer = async (id : number) => {
    const Profile = {
      id: id,
    }
  
    try {
      const response = await deleteCareer(Profile);
      if (response && response.error) {
        console.log(response.error);
        return;
      }
      onGetCareers();
    }
    catch (err) {
      console.log(err);
    }
  };

  // Metodo para redireccionar a una pagina y modificar la tabla carreras
  const onModifyCareers = async (id : string) => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
      localStorage.setItem('career_id', id);
      });
    } else {
      // DOM ya está cargado, ejecutar inmediatamente
      localStorage.setItem('career_id', id);
    }
    router.push(`../Admin/Careers/Update`);
  };

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Active</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {careers?.map((career) => (
          <tr key={career.id}>
            <td>{career.id}</td>
            <td>{career.name}</td>
            <td>{career.active == true ? "Active" : "Inactive"}</td>
            <td>
              <button onClick={() => onModifyCareers(String(career.id))}>Edit</button>
              <button onClick={() => onDeleteCareer(career.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}