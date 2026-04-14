
import { logout } from "../api/api";
import { useRouter } from 'next/navigation';

interface sidebarParams {
  id: number | undefined,
  name: string | undefined,
  last_name: string | undefined,
}

export default function Sidebar({ id, name, last_name } : sidebarParams) {

  // Movimiento entre rutas
  const router = useRouter();

  const onLogout = async () => {
    const Profile = {
      id: id
    }

    const response = await logout(Profile);
    if (response.error) {
      console.log(response.error);
      return;
    }

    console.log(response.message);
    router.push("../");
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <p>Imagen del usuario</p>
      <p>{name} {last_name}</p>
      <button onClick={onLogout}>Cerrar Sesion</button>
    </div>
  )
}