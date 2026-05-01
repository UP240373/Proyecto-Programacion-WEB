
// Importanciones para la pagina
import { logout } from "../api/api";
import { useRouter } from 'next/navigation';
import imageProfil from '../../../public/withoutPhoto.png';
import Image from "next/image";

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
    <div className="sidebar" style={{  }}>
      <div className="sidebarName">
        <Image
          src={imageProfil}
          alt="Imagen del usuario"
          width={45}
        />
        <p>{name} {last_name}</p>
        </div>

      <div className="sidebarOptions">
        {options?.map((option) => (
          <button key={option} onClick={() => onMoveRoute(option)} className="sidebarBottonOptions">{option}</button>
        ))}
      </div>

      <div className="sidebarLogout">
        <button onClick={onLogout} className="sidebarBottonLogout">Log out</button>
      </div>
    </div>
  )
}