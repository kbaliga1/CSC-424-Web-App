import { createContext, useContext, useState, useEffect} from "react";
import { fakeAuth } from "../utils/FakeAuth";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Cookies from "js-cookie";
// axios = require('axios');
const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {

    const getUsername = async (token) => {
        const config = {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        };
        const name = await axios.get("http://localhost:5001/username", config
        ).then((res) => {
            return res.data.username;
        }) .catch(error => {
            console.log(error.response.data.error)
        })
    };

    const navigate = useNavigate();
    const [token, setToken] = useState(null);
    const [username, setUsername] = useState(null);
    const cookie = Cookies.get("jwt_authorization")//new Cookies();
    if(cookie != null && token == null) {
        setToken(cookie);
    }

    useEffect(() => {
        if (token != null && username == null) {
            setUsername(getUsername(token));
        }
    }, [token, username]);

    const handleLogin = async (username,password) => {

        const token = await axios.post("http://localhost:5001/account/login", {
            username,
            password
        }).then((res) => {
            setToken(res.data.token);
            Cookies.set("jwt_authorization",res.data.token);
        }).catch(error => {
            console.log(error.response.data.error)
            alert(error.response.data.error)
        });
        navigate("/landing");
    };

    const handleLogout = () => {
        setToken(null);
        Cookies.remove("jwt_authorization")
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
        username,
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