
// Correr pagina del lado del cliente
'use client'

// Importanciones para la pagina
import { useEffect, useState } from "react";
import { getUser, updateUser, getCareers } from "@/app/api/api";
import { useRouter } from 'next/navigation';

// Estructura de una carrera
interface Career {
  id: number,
  name: string,
  active: number
}

// Estructura del usuario
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

  // Datos del usuario
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
    const userId = localStorage.getItem('user_id');
    onInfoUser(userId);
  }, []);

  // Metodo para obtener los datos del usuario
  const onInfoUser = async (id : string | null) => {

    const careersRequest = await getCareers();
    setCareers(careersRequest.careers);

    const Profile = {
      id: Number(id)
    }
    const response = await getUser(Profile);
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
  const onSaveUser = async () => {
    const NewInfo = {
      name: name,
      last_name: lastName,
      username: username,
      email: email,
      career_id: career,
      password: password,
      active: 0,
      rol: rol
    }

    const response = await updateUser(Number(user?.id), NewInfo)
    if (response.error) {
      console.error(response.error)
    }

    router.push('../../Dev');
  };

  return (
    <div className="main">

      <button onClick={() => router.push('../../Dev')} className="bottonReturn">Return</button>
      
      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
        <div className="divInfo">
          <label className="titleInfo">Name:</label><br/>
          <input 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="inputInfo"
          ></input>
        </div>

        <div className="divInfo">
          <label className="titleInfo">Last Name:</label><br/>
          <input 
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="inputInfo"
          ></input>
        </div>

        <div className="divInfo">
          <label className="titleInfo">Username:</label><br/>
          <input 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="inputInfo"
          ></input>
        </div>

        <div className="divInfo">
          <label className="titleInfo">Email:</label><br/>
          <input 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="inputInfo"
          ></input>
        </div>

        <div className="divInfo">
          <label className="titleInfo">Career:</label><br/>
          <select value={career} onChange={(e) => setCareer(Number(e.target.value))} className="selectInfo">
            {careers.map((career) => (
              <option value={career.id} key={career.id}>{career.name}</option>
            ))}
          </select>
        </div>

        <div className="divInfo">
          <label className="titleInfo">Password:</label><br/>
          <input 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="inputInfo"></input>
        </div>

        <div className="divInfo">
          <label className="titleInfo">Rol:</label><br/>
          <select value={rol} onChange={(e) => setRol(e.target.value)} className="selectInfo">
            <option value="Admin">Admin</option>
            <option value="dev">dev</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', placeItems: 'center' }}>
        <button onClick={() => onSaveUser()} className="bottonInfo">Save changes</button>
      </div>
    </div>
  );
}