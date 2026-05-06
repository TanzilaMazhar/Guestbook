import React, { createContext, useEffect, useState } from 'react';

//creating context
export const ThemeContext = createContext();

//creating provider
export function ThemeProvider({ children }) {
    //managing theme
    const [theme, setTheme] = useState(
        () => localStorage.getItem("theme") || "light"
    );
    //toggle them
    const toggle = () => {
        setTheme(prev => {
            const newTheme = prev === "light" ? "dark" : "light";
            localStorage.setItem("theme", newTheme);
            return newTheme;
        });
    };

    //apply theme to dom
    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [theme]);

    //provide context to children
    return (
        <ThemeContext.Provider value={{ theme, toggle }}>
            {children}
        </ThemeContext.Provider>
    );
}
