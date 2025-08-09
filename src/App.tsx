import React from 'react';
import axios from 'axios';
import './App.css';

const serverUrl = 'http://localhost:3000/';

const App: React.FC = () => {
    const [message, setMessage] = React.useState<string | undefined>();

    React.useEffect(() => {
        async function fetchHelloWorld() {
            const response = await axios.get<string>(serverUrl);
            setMessage(response.data);
        }
        fetchHelloWorld();
    }, []);

    return (
        <>
            {message === undefined
                ? <h2>Loading...</h2>
                : <h2>{message}</h2>}
        </>
    );
};

export default App;
