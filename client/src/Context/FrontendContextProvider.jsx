import React, {createContext, useContext, useState } from "react";
import Cookies from "js-cookie";



const FrontendStateContext = createContext({
    authUser: null,
    authToken: null,
    baseImgUrl: null,
    setAuthUser: () => {},
    manageAuthToken: () => {},
    setBaseImgUrl: () => {}
});

export const FrontendContextProvider = ({children}) => {

    const [authUser, setAuthUser] = useState({});
    const [authToken, setAuthToken] = useState(Cookies.get('WEB_ACCESS_TOKEN'));
    const [baseImgUrl, setBaseImgUrl] = useState('http://localhost:9001/uploads')

    const manageAuthToken = (authToken) => {
        setAuthToken(authToken);
        if(authToken) {
            Cookies.set('WEB_ACCESS_TOKEN', authToken, {expires: 1});   }
        
        if(!authToken) {
            Cookies.remove('WEB_ACCESS_TOKEN');    }
    }

    return (
        <FrontendStateContext.Provider value={{ authUser, authToken, baseImgUrl, setAuthUser, manageAuthToken, setBaseImgUrl }} >
            {children}
        </FrontendStateContext.Provider>
    );
}


export const useFrontendStateContext = () => useContext(FrontendStateContext);
