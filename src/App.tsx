import React from 'react';
import axios from 'axios';
import './App.css';

const serverUrl = 'http://localhost:3000/user';

interface User {
    id: number;
    name: string;
    email: string;
}

const App: React.FC = () => {
    const [users, setUsers] = React.useState<User[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        async function fetchUsers() {
            try {
                const response = await axios.get<User[]>(serverUrl);
                setUsers(response.data);
            } catch (error) {
                console.error('Error al obtener usuarios', error);
            } finally {
                setLoading(false);
            }
        }
        fetchUsers();
    }, []);

    if (loading) return <h2>Loading...</h2>;

    return (
        <div>
            <h1>Lista de Usuarios</h1>
            {users.length === 0 ? (
                <p>No hay usuarios</p>
            ) : (
                <ul>
                    {users.map((user) => (
                        <li key={user.id}>
                            {user.name} — {user.email}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default App;
