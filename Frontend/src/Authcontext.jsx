import { createContext, useContext, useEffect, useState} from "react";
import axios from "axios";
import { BACKEND_URL } from "../services/service";
import toast from "react-hot-toast";
export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('accessToken') || '');
    const [user, setUser] = useState('');
    const [loading, setLoading] = useState(true);

    const storeTokenInLS = async(serverToken) => {
        localStorage.setItem('accessToken', serverToken);
        setToken(serverToken);
        // await userAuthentication();
    }

    let isLoggedIn = !!token;
    const logout = async() => {
        localStorage.removeItem('accessToken');
        setToken("");
    }

    const userAuthentication = async () => {
        try {
            const response = await axios.get(
                `${BACKEND_URL}/api/v1/user/getuser`,
                {
                    withCredentials: true,
                    headers: {
                        token: token,
                    }
                }
            );
            // console.log("inside the refsd" ,response.data.user);
            setUser(response.data.user);
            toast.success(response.data.message);
        } catch (error) {
            console.error("Error fetching user data:", error);
            toast.error(response.message);   
            setUser(null);
        } finally {
            setLoading(false);
        }
    };
    useEffect(()=>{
        if(isLoggedIn){
            userAuthentication();
        }
    },[isLoggedIn])


    return (
        <AuthContext.Provider value={{ storeTokenInLS, isLoggedIn, logout, user, loading, token }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext);
}
