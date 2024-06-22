import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import PlaceList from "../components/PlaceList";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIelements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIelements/LoadingSpinner";

    // const DUMMY_PLACES = [
    //   {
    //     id:'p1',
    //     title:'Empire State Building',
    //     description:'One of the most famous sky scrapers in the world!',
    //     imageUrl:'https://th.bing.com/th/id/OLC.lp5u7VeEyp0Iew480x360?&rs=1&pid=ImgDetMain',
    //     address:'350 5th Ave, New York, NY 10118',
    //     location:{
    //         lat: 40.7484405,
    //         lng:-73.9878584
    //     },
    //     creator:'u1'
    //   },
    //   {
    //     id:'p2',
    //     title:'Empire State Building',
    //     description:'One of the most famous sky scrapers in the world!',
    //     imageUrl:'https://fthmb.tqn.com/fXZ9zp4p4olTFYLuGV215Vd7XRM=/5097x3398/filters:fill(auto,1)/ESB-c-John-Moore-Getty-Images-News-58642af33df78ce2c33feb1c.jpg',
    //     address:'350 5th Ave, New York, NY 10118',
    //     location:{
    //         lat: 40.7484405,
    //         lng:-73.9878584
    //     },
    //     creator:'u2'
    //   }
    // ];

const UserPlaces = () => {
    const[loadedPlaces, setLoadedPlaces] = useState();
    const { isLoading, error, sendRequest, clearError} = useHttpClient();
    const userId =  useParams().userId;

    useEffect(() => {
      const fetchPlaces = async () => {
        try {
          const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/user/${userId}`);
          setLoadedPlaces(responseData.places);
        } catch (err) {}
      };
      fetchPlaces();
    },[sendRequest,userId]);

    const placeDeletedHandler = (deletedPlaceId) => {
      setLoadedPlaces(prevPlaces => prevPlaces.filter(place => place.id !== deletedPlaceId));
    };

    // const loadedPlaces = DUMMY_PLACES.filter(place => place.creator === userId);
    return (
      <React.Fragment>
        <ErrorModal error = {error} onClear={clearError} />
        {isLoading && <div className="center"><LoadingSpinner /></div>}
        {!isLoading && loadedPlaces && <PlaceList items={loadedPlaces} onDeletePlace={placeDeletedHandler}/>}
      </React.Fragment>
    );
};

export default UserPlaces;