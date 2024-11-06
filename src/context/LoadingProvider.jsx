import { createContext, useContext, useState } from "react";
import LoadingOverlay from "../Components/LoadingOverlay/LoadingOverlay";

const LoadingContext = createContext();

export const useLoading = () => {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error('useLoading must be used within a LoadingProvider');
    }
    return context;
}

export const LoadingProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);

    return <LoadingContext.Provider value={{
        loading,
        setLoading
    }}>
        {loading && <LoadingOverlay />}
        {children}
    </LoadingContext.Provider>;
};