
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
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Full Name</th>
          <th>Username</th>
          <th>Email</th>
          <th>Career</th>
          <th>Active</th>
          <th>Password</th>
          <th>Rol</th>
          <th>Created At</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {users?.map((user) => (
          <tr key={user.id}>
            <td>{user.id}</td>
            <td>{user.name} {user.last_name}</td>
            <td>{user.username}</td>
            <td>{user.email}</td>
            <td>{user.career_id}</td>
            <td>{user.active == 1 ? "Active" : "Inactive"}</td>
            <td>{user.password}</td>
            <td>{user.rol}</td>
            <td>{user.created_at.split('T')[0]}</td>
            <td>
              <button onClick={() => onModifyUsers(String(user.id))}>Edit</button>
              <button onClick={() => onDeleteUser(user.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}