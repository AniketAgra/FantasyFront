import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import { useForm } from '../../shared/hooks/form-hook';
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/util/validators';
import './PlaceForm.css'
import Card from '../../shared/components/UIelements/Card';
import { useHttpClient } from '../../shared/hooks/http-hook';
import ErrorModal from '../../shared/components/UIelements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIelements/LoadingSpinner';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { AuthContext } from '../../shared/context/auth-context';

 
// const DUMMY_PLACES = [
//     {
//       id:'p1',
//       title:'Empire State Building',
//       description:'One of the most famous sky scrapers in the world!',
//       imageUrl:'https://th.bing.com/th/id/OLC.lp5u7VeEyp0Iew480x360?&rs=1&pid=ImgDetMain',
//       address:'350 5th Ave, New York, NY 10118',
//       location:{
//           lat: 40.7484405,
//           lng:-73.9878584
//       },
//       creator:'u1'
//     },
//     {
//       id:'p2',
//       title:'Empire State Building',
//       description:'One of the most famous sky scrapers in the world!',
//       imageUrl:'https://fthmb.tqn.com/fXZ9zp4p4olTFYLuGV215Vd7XRM=/5097x3398/filters:fill(auto,1)/ESB-c-John-Moore-Getty-Images-News-58642af33df78ce2c33feb1c.jpg',
//       address:'350 5th Ave, New York, NY 10118',
//       location:{
//           lat: 40.7484405,
//           lng:-73.9878584
//       },
//       creator:'u2'
//     }
// ];

const UpdatePlace = () => {

  // const[isLoading,setIsLoading] = useState(true);
  const{isLoading, error, sendRequest, clearError} = useHttpClient();
  const [loadedPlace , setLoadedPlaces] = useState();

  const placeId = useParams().placeId;
  const history = useHistory();
  const auth = useContext(AuthContext);
  
  const[formState, inputHandler,setFormData] = useForm({
    title:{
      value: '',
      isValid: false
    },
    description:{
        value: '',
        isValid: false
    }
  },false)

  // const identifiedPlace = DUMMY_PLACES.find(p => p.id === placeId);

  useEffect(() => {
      const fetchPlaces = async () => {
        try{
          const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`);
          setLoadedPlaces(responseData.place);
          setFormData({
            title:{
                value: responseData.place.title,
                isValid: true
              },
              description:{
                  value: responseData.place.description,
                  isValid: true
              }
            },true
          );
        }catch(err){};
      }
      fetchPlaces();
  },[sendRequest,placeId,setFormData])

  // useEffect(()=>{                 //so we this logic --> identifiedPlace will not change with every re-render cycle also setForm data will also not so, as we wrapped it into callback
  //   if(identifiedPlace){
  //       setFormData({
  //           title:{
  //               value: identifiedPlace.title,
  //               isValid: true
  //             },
  //             description:{
  //                 value: identifiedPlace.description,
  //                 isValid: true
  //             }
  //           },true
  //         );
  //   }                 
  //     setIsLoading(false);
  // },[setFormData,identifiedPlace])

  const placeUpdateSubmitHandler = async event => {
    event.preventDefault();
    // console.log(formState.inputs);
    try{
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`,
        'PATCH',
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
        }),
        {
          'Content-Type': 'application/json',
           Authorization: 'Bearer ' + auth.token 
        });
        history.push('/'+ auth.userId + '/places');
    }catch(err){}
  }

  if(isLoading){
    return (
        <div className='center'>
            <LoadingSpinner/>
        </div>
    );
  }

  if (!loadedPlace && !error){
    return (
        <div className='center'>
            <Card>
                <h2>Could not find place!</h2>
            </Card>
        </div>
    );
  }
  

  return (
    <React.Fragment>
      <ErrorModal error = {error} onClear={clearError}/>
      {!isLoading && loadedPlace && <form className='place-form' onSubmit={placeUpdateSubmitHandler}>
        <Input 
          id="title"
          element="input"
          type="text"
          label="Title"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid title."
          onInput={inputHandler}
          initialValue={loadedPlace.title}
          initialValid={true}
        />
        <Input 
          id="description"
          element="textarea"
          label="Description"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid description (min 5 characters)."
          onInput={inputHandler}
          initialValue={loadedPlace.description}
          initialValid={true}
        />
        <Button type='submit' disabled={!formState.isValid} >UPDATE PLACE</Button>
      </form>}
    </React.Fragment>
  )
}

export default UpdatePlace