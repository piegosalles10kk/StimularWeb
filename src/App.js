import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Nav, Button, Image } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './tabs/Home';
import UsuariosCadastrados from './tabs/Usuarios';
import AtividadesCadastradas from './tabs/GrupoAtividades';
import Mural from './tabs/Mural';
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
                body: JSON.stringify({ email, senha }),
            });

            const data = await response.json();

            if (response.ok) {
                if (data.tipoDeConta === 'Admin') {
                    localStorage.setItem('id', data.id);
                    localStorage.setItem('authToken', data.token);
                    onLogin(data.token);
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
            <Image width="200" height="130" src={Logo} alt="Imagem da atividade" rounded style={{ margin: '0 auto' }} />
            <br />
            <h2>Login</h2>
            <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <br />
            <input type="password" placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} />
            <br />
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
        localStorage.setItem('authToken', receivedToken); // ✅ Agora usando localStorage
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken'); // ✅ Agora usando localStorage
        localStorage.removeItem('id'); // ✅ Agora usando localStorage
        setIsAuthenticated(false);
        setToken('');
    };

    useEffect(() => {
        const storedToken = localStorage.getItem('authToken'); // ✅ Agora usando localStorage
        if (storedToken) {
            setIsAuthenticated(true);
            setToken(storedToken);
        }
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
                            <Nav.Link as={Link} to="/">Home</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link as={Link} to="/mural">Mural</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link as={Link} to="/usuarios">Usuários</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link as={Link} to="/atividades">Atividades</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Button variant="outline-danger" onClick={handleLogout}>Logout</Button>
                        </Nav.Item>
                    </Nav>

                    <Routes>
                        <Route path="/" element={<Home token={token} />} />
                        <Route path="/usuarios" element={<UsuariosCadastrados token={token} />} />
                        <Route path="/atividades" element={<AtividadesCadastradas token={token} />} />
                        <Route path="/mural" element={<Mural token={token} />} />
                    </Routes>
                </BrowserRouter>
            )}
        </div>
    );
}

export default App;
