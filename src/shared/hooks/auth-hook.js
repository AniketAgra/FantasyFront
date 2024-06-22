import { useCallback,useState,useEffect } from "react";

let logoutTimer;

export const useAuthentication = () => {
    const[token,setToken] = useState(null);
    const[userId,setUserId] = useState(null);
    const[tokenExpirationTime,setTokenExpirationTime] = useState();                                                       
  
    const login = useCallback((uid, token, expirationDate) => {
      setToken(token);
      setUserId(uid);
      const tokenExpirationDate = expirationDate ||  new Date(new Date().getTime() + 1000 * 60 * 60);     // current time + 1hr(1000 * 60 * 60)
      setTokenExpirationTime(tokenExpirationDate);
      localStorage.setItem('userData', JSON.stringify({userId: uid, token: token, expiration: tokenExpirationDate.toISOString() }));  //prevent logout on refreshing website
    },[]);
  
    const logout = useCallback(() => {
      setToken(null);
      setUserId(null);
      setTokenExpirationTime(null);
      localStorage.removeItem('userData');
    },[]);
  
    useEffect(() => {
        if(token && tokenExpirationTime){
          const remainingTime = tokenExpirationTime.getTime() - new Date().getTime();    //in miliseconds
          logoutTimer =  setTimeout(logout, remainingTime);
        }else{
          clearTimeout(logoutTimer);
        }
    },[token,logout,tokenExpirationTime]);
  
    useEffect(() => {                                                  //useEffect always runs after the render cycle
      const storedData = JSON.parse(localStorage.getItem('userData')); 
      if(storedData && storedData.token && new Date(storedData.expiration) > new Date() ){
       login(storedData.userId, storedData.token);
      }
    }, [login]);

    return {token, login, logout, userId};
};