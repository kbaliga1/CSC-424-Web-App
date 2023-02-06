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

        const token = await axios.post("http://localhost:5001/account/login", {
            username,
            password
        }).then((res) => {
            setToken(res.data.token);
        }).catch(error => {
            console.log(error.response.data.error)
            alert(error.response.data.error)
        });
        navigate("/landing");
    };

    const handleLogout = () => {
        setToken(null);
    };

    const handleRegister = async (username,password) => {
        const token = await axios.post("http://localhost:5001/account/register", {
            username,
            password
        }).then((res) => {
            alert("Successfully Registered");
        }).catch(error => {
            console.log(error.response.data.error);
            alert(error.response.data.error);
        })
    };

    const value = {
        token,
        onLogin: handleLogin,
        onLogout: handleLogout,
        onRegister: handleRegister
    };

    return (
        <AuthContext.Provider value={{ value }}>
            {children}
        </AuthContext.Provider>
    );
};

// give callers access to the context
export const useAuth = () => useContext(AuthContext);