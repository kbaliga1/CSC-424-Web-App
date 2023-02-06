import { useAuth } from "./context/AuthProvider";
import {useState} from "react";

export const Home = () => {
    const { value } = useAuth();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    return (
        <>
            <h2>Home (Public)</h2>
            <div>
            <label>Username</label>
            <input type={"text"} value={username} onChange={e => setUsername(e.target.value)}/>
            </div>
            <div>
            <label>Username</label>
            <input type={"text"} value={password} onChange={e => setPassword(e.target.value)}/>
            </div>
            <button type = "button" onClick={() => value.onLogin(username,password)}>
                Sign In
            </button>
        </>
    );
};