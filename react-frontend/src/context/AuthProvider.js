import { createContext, useContext, useState, useEffect} from "react";
import { fakeAuth } from "../utils/FakeAuth";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Cookies from "js-cookie";
// axios = require('axios');
const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {

    const navigate = useNavigate();
    const [token, setToken] = useState(null);
    const [username, setUsername] = useState(null);
    const [contacts, setContacts] = useState([]);
    const cookie = Cookies.get("jwt_authorization")//new Cookies();
    if(cookie != null && token == null) {
        setToken(cookie);
    }

    useEffect(() => {
        if (token != null && username == null) {
            getUsername(token);
        }
        getContacts();
    }, [token, username]);

    const handleLogin = async (username,password) => {

        const token = await axios.post("https://localhost:5001/account/login", {
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
        const token = await axios.post("https://localhost:5001/account/register", {
            username,
            password
        }).then((res) => {
            alert("Successfully Registered");
        }).catch(error => {
            console.log(error.response.data.error);
            alert(error.response.data.error);
        })
    };

    const getContacts = async () => {
        axios.get('https://localhost:5001/contacts')
            .then(response => {
                const names = response.data; // the list of names is in the response data
                console.log(names);
                setContacts(names);
            })
            .catch(error => {
                console.error(error);
            });
    }

    const getUsername = async (token) => {
        const config = {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        };
        await axios.get("https://localhost:5001/username", config
        ).then((res) => {
            console.log(res.data.username)
            setUsername(res.data.username);
        }) .catch(error => {
            console.log(error.response.data.error)
        })
    };

    const value = {
        token,
        username,
        contacts,
        onLogin: handleLogin,
        onLogout: handleLogout,
        onRegister: handleRegister,
        getContacts: getContacts
    };

    return (
        <AuthContext.Provider value={{ value }}>
            {children}
        </AuthContext.Provider>
    );
};

// give callers access to the context
export const useAuth = () => useContext(AuthContext);