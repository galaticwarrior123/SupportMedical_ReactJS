import { createContext, useState } from 'react';

export const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
    const [isCollapsed, setIsCollapsed] = useState(() => {
        // Load the initial state from localStorage if available
        const savedState = localStorage.getItem('sidebarCollapsed');
        return savedState ? JSON.parse(savedState) : false;
    });

    const toggleSidebar = () => {
        setIsCollapsed(prevState => {
            const newState = !prevState;
            localStorage.setItem('sidebarCollapsed', JSON.stringify(newState));
            return newState;
        });
    };

    return (
        <SidebarContext.Provider value={{ isCollapsed, toggleSidebar }}>
            {children}
        </SidebarContext.Provider>
    );
};