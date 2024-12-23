import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import {Nav, Button, Image} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Home from './componentes/Home';
import UsuariosCadastrados from './componentes/Usuarios';
import AtividadesCadastradas from './componentes/GrupoAtividades';
import Logo from './assets/Logo.png';
import { api } from './utils/api';

function Login({ onLogin }) {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    const handleLogin = async () => {
      try {
          const response = await fetch(`${api}/auth/login`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  email,
                  senha,
              }),
          });
  
          const data = await response.json();
          console.log('Resposta do servidor:', data); // Verifique a resposta do servidor
  
          if (response.ok) {
              if (data.tipoDeConta === 'Admin') {
                  // Armazenar o id e o token no AsyncStorage
                  await AsyncStorage.setItem('id', data.id); // Agora deve armazenar o id corretamente
                  console.log('ID salvo:', data.id); // Confirme que o ID está sendo salvo
                  onLogin(data.token); // Chama a função para armazenar o token
              } else {
                  alert('Acesso restrito a administradores');
              }
          } else {
              alert(data.msg || 'Falha na autenticação');
          }
      } catch (error) {
          console.error('Erro durante a autenticação:', error);
          alert('Erro durante a autenticação. Tente novamente.');
      }
  };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Image
                width="200"
                height="130"
                src={Logo}
                alt="Imagem da atividade"
                rounded 
                style={{ margin: '0 auto' }}
              />
              <br/>
          <h2>Login</h2>
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
            <br/>
            <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          <br/>
          <Button onClick={handleLogin}>Login</Button>
        </div>
    );
}

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [token, setToken] = useState('');

    const handleLogin = async (receivedToken) => {
        setIsAuthenticated(true);
        setToken(receivedToken);
        // Armazenar o token no AsyncStorage
        await AsyncStorage.setItem('authToken', receivedToken);
    };

    const handleLogout = async () => {
        // Limpar os dados do AsyncStorage
        await AsyncStorage.removeItem('authToken');
        await AsyncStorage.removeItem('id');
        setIsAuthenticated(false);
        setToken(''); // Limpar o token no estado
    };

    // Recuperar o token e o id do AsyncStorage ao iniciar a aplicação
    useEffect(() => {
        const loadStoredData = async () => {
            const storedToken = await AsyncStorage.getItem('authToken');
            const storedId = await AsyncStorage.getItem('id');

            if (storedToken) {
                setIsAuthenticated(true);
                setToken(storedToken);
            }

            console.log('ID recuperado:', storedId); // Exemplo de uso
        };

        loadStoredData();
    }, []);

    return (
        <div className="App">
            
              

            {!isAuthenticated ? (
                <Login onLogin={handleLogin} />
            ) : (
                <BrowserRouter>
                <h1>BackOffice Stimular</h1>
                    <Nav fill variant="tabs" defaultActiveKey="/home">
                        <Nav.Item>
                            <Nav.Link as={Link} to="/usuarios">Usuarios</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link as={Link} to="/atividades">Atividades</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                        <Button variant="outline-danger" onClick={handleLogout}>Logout</Button>                        
                        </Nav.Item>
                    </Nav>

                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/usuarios" element={<UsuariosCadastrados token={token} />} />
                        <Route path="/atividades" element={<AtividadesCadastradas token={token} />} />
                    </Routes>
                </BrowserRouter>
            )}
        </div>
    );
}

export default App;
