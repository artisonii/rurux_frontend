import { createContext, useState } from "react";



export const AuthReducer = createContext()

export const AuthReducerProvider = ({ children }) => {
    const [authContext, setAuthContext] = useState({
        isAuth: false,
        name: "",
        role: "",
        token: "",
    })

    const setLogin = (payload) => {
        setAuthContext({ authStatus: true, ...payload })
    }

    const setLogout = () => {
        setAuthContext({
            authStatus: false,
            name: "",
            role: ""
        })
    }

    return (
        <AuthReducer.Provider value={{ setLogin, authContext, setLogout }}>
            {children}
        </AuthReducer.Provider>
    )
}