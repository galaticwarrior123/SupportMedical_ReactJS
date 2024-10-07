import { createContext, useContext, useState } from "react";

const AuthContext = createContext();


export const useAuth = () => {
    return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
    const [token, setToken] = useState(localStorage.getItem("token") || null);

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("roles");
        setUser(null);
    };

    const updateUser = (newUser) => {
        localStorage.setItem("user", JSON.stringify(newUser));
        setUser(newUser);
    };

    const updateToken = (newToken) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);
    }

    return (
        <AuthContext.Provider value={{ user, logout, updateUser, token, updateToken }}>
            {children}
        </AuthContext.Provider>
    );
}