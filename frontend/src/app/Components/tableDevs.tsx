
// Importanciones para la pagina
import { useRouter } from 'next/navigation';
import { getUsers, deleteUser } from '../api/api';
import { useEffect, useState } from 'react';

// Estructura de un desarrollador
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
  created_at: string;
}

export default function TableDevs() {

  // Movimiento entre rutas
  const router = useRouter();

  // Datos de todos los desarrolladores
  const [users, setUsers] = useState<User[]>();

  useEffect(() => {
    onGetUsers();
  }, [users]);

  // Obtener desarrolladores
  const onGetUsers = async () => {
    try {
      const response = await getUsers();
      if (response) {
        setUsers(response.users);
      }
    } catch (err) {
      console.error("Algo salio mal", err)
    }
  };

  // Metodo para borrar un usuario
  const onDeleteUser = async (id : number) => {
    const Profile = {
      id: id,
    }
  
    try {
      const response = await deleteUser(Profile);
      if (response && response.error) {
        console.log(response.error);
        return;
      }
      onGetUsers();
    }
    catch (err) {
      console.log(err);
    }
  };

  // Metodo para redireccionar a una pagina y modificar la tabla usuarios
  const onModifyUsers = async (id : string) => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
      localStorage.setItem('dev_id', id);
      });
    } else {
      // DOM ya está cargado, ejecutar inmediatamente
      localStorage.setItem('dev_id', id);
    }
    router.push(`../Admin/Devs/Update`);
  };

  return (
    <table className='table'>
      <thead>
        <tr className='tableTitles'>
          <th className='tableCells'>ID</th>
          <th className='tableCells'>Full Name</th>
          <th className='tableCells'>Username</th>
          <th className='tableCells'>Email</th>
          <th className='tableCells'>Career</th>
          <th className='tableCells'>Active</th>
          <th className='tableCells'>Password</th>
          <th className='tableCells'>Rol</th>
          <th className='tableCells'>Created At</th>
          <th className='tableCells'>Actions</th>
        </tr>
      </thead>

      <tbody>
        {users?.map((user) => (
          <tr key={user.id}>
            <td className='tableCells'>{user.id}</td>
            <td className='tableCells'>{user.name} {user.last_name}</td>
            <td className='tableCells'>{user.username}</td>
            <td className='tableCells'>{user.email}</td>
            <td className='tableCells'>{user.career_id}</td>
            <td className='tableCells'>{user.active == 1 ? "Active" : "Inactive"}</td>
            <td className='tableCells'>{user.password}</td>
            <td className='tableCells'>{user.rol}</td>
            <td className='tableCells'>{user.created_at.split('T')[0]}</td>
            <td className='tableCells'>
              <button className='botton' onClick={() => onModifyUsers(String(user.id))}>Edit</button>
              <button className='botton' onClick={() => onDeleteUser(user.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}