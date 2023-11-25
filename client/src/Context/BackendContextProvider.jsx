import React, {createContext, useContext, useState } from "react";
import Cookies from "js-cookie";

const BackendStateContext = createContext({
    authUser: null,
    authToken: null,
    setAuthUser: () => {},
    manageAuthToken: () => {}
});

export const BackendContextProvider = ({children}) => {

    const [authUser, setAuthUser] = useState({});
    const [authToken, setAuthToken] = useState(Cookies.get('ADMIN_ACCESS_TOKEN'));

    const manageAuthToken = (authToken) => {
        setAuthToken(authToken);
        if(authToken) { Cookies.set('ADMIN_ACCESS_TOKEN', authToken, {expires: 1});   }
        else if(!authToken) { Cookies.remove('ADMIN_ACCESS_TOKEN');    }
    }

    return (
        <BackendStateContext.Provider value={{ authUser, authToken, setAuthUser, manageAuthToken }} >
            {children}
        </BackendStateContext.Provider>
    );
}


export const useBackendStateContext = () => useContext(BackendStateContext);


