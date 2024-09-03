import { createContext, useState } from 'react';

export const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
    const [isCollapsed, setIsCollapse] = useState(false);

    const toggleSidebar = () => {
        setIsCollapse(!isCollapsed);
    };

    return (
        <SidebarContext.Provider value={{ isCollapsed, toggleSidebar }}>
            {children}
        </SidebarContext.Provider>
    );
};