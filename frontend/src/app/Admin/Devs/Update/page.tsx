
// Correr pagina del lado del cliente
'use client'

// Importanciones para la pagina
import { useEffect, useState } from "react";
import { getUser, updateUser, getCareers} from "@/app/api/api";
import { useRouter } from 'next/navigation';

// Estructura de una carrera
interface Career {
  id: number,
  name: string,
  active: number
}

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

export default function Page() {

  // Movimiento entre rutas
  const router = useRouter();

  // Datos del desarrollador
  const [careers, setCareers] = useState<Career[]>([]);
  const [user, setUser] = useState<User>();
  const [name, setName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [career, setCareer] = useState<number>();
  const [password, setPassword] = useState<string>('');
  const [rol, setRol] = useState<string>('');

  useEffect(() => {
    const DevId = localStorage.getItem('dev_id');
    onInfoDev(Number(DevId));
  }, []);

  // Metodo para obtener los datos del usuario
  const onInfoDev = async (id : number) => {

    const careersRequest = await getCareers();
    setCareers(careersRequest.careers);

    const dev = {
      id: id
    }
    const response = await getUser(dev);
    setUser(response.user[0]);
    setName(response.user[0].name);
    setLastName(response.user[0].last_name);
    setUsername(response.user[0].username);
    setEmail(response.user[0].email);
    for (let i = 0; i < careersRequest.careers.length; i++) {
      if (response.user[0].career_id == careersRequest.careers[i].id) {
        setCareer(careersRequest.careers[i].id);
      }
    }
    setPassword(response.user[0].password);
    setRol(response.user[0].rol);
  };

  // Metodo para guardar los cambios
  const onSaveDev = async () => {
    const NewDev = {
      name: name,
      last_name: lastName,
      username: username,
      email: email,
      career_id: career,
      password: password,
      active: 0,
      rol: rol
    }

    const response = await updateUser(Number(user?.id), NewDev)
    if (response.error) {
      console.error(response.error)
    }

    router.push('../../Admin/Devs');
  };

  return (
    <div>

      <button onClick={() => router.push('../../Admin/Devs')}>Regresar</button>
      
      <div>
        <label>Name:</label><br/>
        <input 
          value={name}
          onChange={(e) => setName(e.target.value)}></input>
      </div>

      <div>
        <label>Last Name:</label><br/>
        <input 
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}></input>
      </div>

      <div>
        <label>Username:</label><br/>
        <input 
          value={username}
          onChange={(e) => setUsername(e.target.value)}></input>
      </div>

      <div>
        <label>Email:</label><br/>
        <input 
          value={email}
          onChange={(e) => setEmail(e.target.value)}></input>
      </div>

      <div>
        <label>Career:</label><br/>
        <select value={career} onChange={(e) => setCareer(Number(e.target.value))}>
          {careers.map((career) => (
            <option value={career.id} key={career.id}>{career.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label>Password:</label><br/>
        <input 
          value={password}
          onChange={(e) => setPassword(e.target.value)}></input>
      </div>

      <div>
        <label>Rol:</label><br/>
        <select value={rol} onChange={(e) => setRol(e.target.value)}>
          <option value="Admin">Admin</option>
          <option value="dev">dev</option>
        </select>
      </div>

      <button onClick={() => onSaveDev()}>Guardar cambios</button>
    </div>
  );
}