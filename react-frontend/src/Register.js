import { useAuth } from "./context/AuthProvider";
import {useState} from "react";

export const Register = () => {
    const { value } = useAuth();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    return (
        <>
            <h2>Registration (Public)</h2>
            <h3>Register:</h3>
            <div>
                <label>Username</label>
                <input type={"text"} value={username} onChange={e => setUsername(e.target.value)}/>
            </div>
            <div>
                <label>Username</label>
                <input type={"text"} value={password} onChange={e => setPassword(e.target.value)}/>
            </div>
            <button type = "button" onClick={() => value.onRegister(username,password)}>
                Register
            </button>
        </>
    );
};