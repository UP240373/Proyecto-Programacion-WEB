
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
    <table className='table'>
      <thead>
        <tr className='tableTitles'>
          <th className='tableCells'>ID</th>
          <th className='tableCells'>Name</th>
          <th className='tableCells'>Active</th>
          <th className='tableCells'>Actions</th>
        </tr>
      </thead>

      <tbody>
        {careers?.map((career) => (
          <tr key={career.id}>
            <td className='tableCells'>{career.id}</td>
            <td className='tableCells'>{career.name}</td>
            <td className='tableCells'>{career.active == true ? "Active" : "Inactive"}</td>
            <td className='tableCells'>
              <button onClick={() => onModifyCareers(String(career.id))} className='botton'>Edit</button>
              <button onClick={() => onDeleteCareer(career.id)} className='botton'>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}