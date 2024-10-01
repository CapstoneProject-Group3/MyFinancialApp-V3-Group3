import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const [token, setToken] = useState("");

    const url = "http://localhost:4000";

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    const loginUser = async (email, password) => {
        try {
            const response = await axios.post(url + "/api/login", { email, password });
            const { token } = response.data;
            localStorage.setItem("token", token);
            setToken(token);
        } catch (error) {
            console.error("login failed", error);
        }
    };

    const logoutUser = () => {
        localStorage.removeItem("token");
        setToken("");
    };

    const contextValue = {
        token,
        loginUser,
        logoutUser,
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;
