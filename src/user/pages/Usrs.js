import React, { useEffect, useState } from "react";

import UserList from "../components/UserList";
import ErrorModal from "../../shared/components/UIelements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIelements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";

const Users = () => {
    // const [isLoading,setIsLoading] = useState(false);
    // const [error,setError] = useState();
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [loadedUsers, setLoadedUsers] = useState();


    // const USERS = 
    // [
    //     {id:'u1',name:'Max Schwarz',image:'https://th.bing.com/th/id/OIP.lkJgA_uQGAkyXq2bls3TggAAAA?rs=1&pid=ImgDetMain',places:3 }
    // ];

    //from database
    
    // useEffect(() => {
    //     const sendRequest  = async () => {
    //         setIsLoading(true);

    //         try{
    //             const response = await fetch('REACT_APP_BACKEND_URL + '/users');

    //             const responseData = await response.json();

    //             if(!response.ok){
    //                 throw new Error(responseData.message);
    //             }

    //             setLoadedUsers(responseData.users);   //users (array) from backend
    //             setIsLoading(false);
    //         }catch(err){
    //             setError(err.message);
    //         }
    //         setIsLoading(false);
    //     };
    //     sendRequest();
    // }, []);

    // const errorHandlder = () => {
    //     setError(null);
    // }

    useEffect(() => {
        const fetchUsers  = async () => {
            try{
                const responseData = await sendRequest(process.env.REACT_APP_BACKEND_URL + '/users');
                setLoadedUsers(responseData.users);
            }catch(err){}
        };
        fetchUsers();
    }, [sendRequest]);

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear = {clearError} />
            {isLoading && (
                <div className="center">
                    <LoadingSpinner />
                </div>
            )}
            {!isLoading && loadedUsers && <UserList items={loadedUsers} />}    
        </React.Fragment>
    );
}

export default Users ;