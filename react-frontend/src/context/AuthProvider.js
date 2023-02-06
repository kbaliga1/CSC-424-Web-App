import { createContext, useContext, useState } from "react";
import { fakeAuth } from "../utils/FakeAuth";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
// axios = require('axios');
const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [token, setToken] = useState(null);

    const handleLogin = async (username,password) => {
        // const token = await fakeAuth();
        //const username = "admin";
        //const password = "assword";
        const token = await axios.post("http://localhost:5001/account/login", {
            username,
            password
        }).then((res) => {
            //console.log(res.data)
            setToken(res.data.token);
        }).catch(error => {
            console.log(error)
            alert("LOGIN FAILED")
        });
        //console.log("Token:",token)
        //setToken(token);
        navigate("/landing");
    };

    const handleLogout = () => {
        setToken(null);
    };

    const value = {
        token,
        onLogin: handleLogin,
        onLogout: handleLogout,
    };

    return (
        <AuthContext.Provider value={{ value }}>
            {children}
        </AuthContext.Provider>
    );
};

// give callers access to the context
export const useAuth = () => useContext(AuthContext);