
// Importanciones para la pagina
import { logout } from "../api/api";
import { useRouter } from 'next/navigation';

interface sidebarParams {
  id: number | undefined,
  name: string | undefined,
  last_name: string | undefined,
  options?: string[] | undefined,
}

export default function Sidebar({ id, name, last_name, options } : sidebarParams) {

  // Movimiento entre rutas
  const router = useRouter();

  // Metodo para moverse entre rutas
  const onMoveRoute = (option : string) => {
    if (option === "Home") {
      router.push("../Admin");
      return;
    }

    router.push(`../Admin/${option}`)
  };

  // Metodo para hacer logout
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
      {options?.map((option) => (
        <button key={option} onClick={() => onMoveRoute(option)}>{option}</button>
      ))}
      <button onClick={onLogout}>Cerrar Sesion</button>
    </div>
  )
}