
// Correr pagina del lado del cliente
'use client'

// Importanciones para la pagina
import { useEffect, useState } from "react";
import { login } from "./api/api";
import { useRouter } from 'next/navigation';

// Estructura de cada usuario
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

export default function Home() {

  // Movimiento entre rutas
  const router = useRouter();

  // Email y Password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Realizar login
  const onLogin = async () => {
    const profile = {
      email: email,
      password: password
    }

    // Realizar la peticion a la API, en caso de fallar, arroja el error
    const response = await login(profile);
    if (response.success == false) {
      setError(response.error);
      return console.error(response.error);
    }

    // Determina que tipo de usuario es
    const user = response.user[0];
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
      localStorage.setItem('user_id', user.id);
      });
    } else {
      // DOM ya está cargado, ejecutar inmediatamente
      localStorage.setItem('user_id', user.id);
    }
    
    if (user.rol == "Admin") {
      router.push("./Admin");
    } else {
      router.push("./Dev");
    }
  };

  return (
    <main>
      <div>
        <div>
          <label>Enter your email address:</label><br/>
          <input 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="Email"
          ></input>
        </div>

        <div>
          <label>Enter your password</label><br/>
          <input 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          ></input>
        </div>

        <button onClick={() => onLogin()}>Login</button>

        <p>{error}</p>
      </div>

    </main>
  );
}
