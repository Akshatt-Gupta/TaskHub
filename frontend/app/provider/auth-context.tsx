import { createContext,useState,useContext, useEffect } from "react"
import type { User } from "../type/index";
import { queryClient } from "./react-query-provider";
import { useLocation, useNavigate } from "react-router";
import { publicRoutes } from "@/lib/index";


interface AuthContextType {
    user:User|null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login:(data:any) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType|undefined>(undefined);

const AuthProvider = ({children}:{children:React.ReactNode}) => {
    const [user, setUser] = useState<User|null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const navigate=useNavigate();
    const location = useLocation();
    const currentPath = location.pathname;
    const isPublicRoute=publicRoutes.includes(currentPath);

    useEffect(()=>{
        const checkAuth=async()=>{
            setIsLoading(true);
            const userInfo=localStorage.getItem("user");
            if(userInfo){
                setUser(JSON.parse(userInfo));
                setIsAuthenticated(true);
            }
            else{
                setIsAuthenticated(false);
                if(!isPublicRoute){
                    navigate("/sign-in");
                }
            }
            setIsLoading(false);
        }
        checkAuth();
    },[]);

    useEffect(()=>{
        const handleLogout=()=>{
            logout();
            navigate("/sign-in");
        }
        window.addEventListener("force-logout",handleLogout);
        return()=>window.removeEventListener("force-logout",handleLogout);
    })

    const login=async (data:any) => {
        console.log(data);
        localStorage.setItem("token",data.token);
        localStorage.setItem("user",JSON.stringify(data.user));
        setUser(data.user);
        setIsAuthenticated(true);
    };
    const logout=async () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setIsAuthenticated(false);
        
        navigate("/sign-in");
        queryClient.clear();
    };

    const values={
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
    };
    return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export { AuthProvider, AuthContext };