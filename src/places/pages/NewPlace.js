import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

import Input from '../../shared/components/FormElements/Input'
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/util/validators'
import { useForm } from '../../shared/hooks/form-hook';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIelements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIelements/LoadingSpinner';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';
import './PlaceForm.css'

// const formReducer = (state,action) => {
//   switch (action.type){
//     case 'INPUT_CHANGE':
//       let formIsValid = true;
//       for(const inputId in state.inputs){
//         if (inputId === action.inputId){
//           formIsValid = formIsValid && action.isValid;
//         }
//         else{
//           formIsValid = formIsValid && state.inputs[inputId].isValid;
//         }
//       }
//       return {
//         ...state,
//         inputs:{
//           ...state.inputs,
//           [action.inputId]:{value:action.value, isValid:action.isValid}
//         },
//         isValid: formIsValid
//       };

//     default:
//       return state;
//   }
// };

const NewPlace = () => {
  const auth = useContext(AuthContext);
  const {isLoading , error, sendRequest, clearError} = useHttpClient();
  const [formState,inputHandler] = useForm(
    {
      title:{
        value:'',
        isValid: false
      },
      description:{
        value:'',
        isValid: false
      },
      address:{
        value:'',
        isValid: false
      },
      image:{
        value:null,
        isValid: false
      }
    },
    false
  );

  // const [formState,dispatch] = useReducer(formReducer,{
  //   inputs:{
  //     title:{
  //       value:'',
  //       isValid: false
  //     },
  //     description:{
  //       value:'',
  //       isValid: false
  //     },
  //     address:{
  //       value:'',
  //       isValid: false
  //     }
  //   },
  //   isValid: false
  // });

  // const inputHandler = useCallback((id,value,isValid) => {
  //   dispatch({type:'INPUT_CHANGE',value: value, isValid: isValid, inputId:id});
  // }, []); 
  
  //useCallback is used so that the function not go to onInput fn in input.js for infinity 
  
  const history = useHistory();

  const placeSubmitHandler = async event => {
    event.preventDefault();
    // console.log(formState.inputs);  //later sending this to the backend
    try{
      const formData = new FormData();
      formData.append('title',formState.inputs.title.value);
      formData.append('description',formState.inputs.description.value);
      formData.append('address',formState.inputs.address.value);
      formData.append('image',formState.inputs.image.value);
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + '/places', 
        'POST',
        formData,
        //  JSON.stringify({
        //     title: formState.inputs.title.value,
        //     description: formState.inputs.description.value,
        //     address: formState.inputs.address.value,
        //     creator: auth.userId
        // }),
        // {'Content-Type': 'application/json'}
        { Authorization: 'Bearer ' + auth.token }
      );
      history.push('/');
    }catch(err) {}  
  };
  
  return (
    <React.Fragment>
      <ErrorModal error={error} onClear = {clearError} />
      {isLoading && <LoadingSpinner asOverlay/> }
      <form className='place-form' onSubmit={placeSubmitHandler}>
        <Input
          id='title'
          element='input'
          type="text" 
          label="Title" 
          validators={[VALIDATOR_REQUIRE()]} 
          errorText="Please enter a valid title." 
          onInput={inputHandler}/>

        <Input
          id='description'
          element='textarea'
          label="Description" 
          validators={[VALIDATOR_MINLENGTH(5)]} 
          errorText="Please enter a valid description(atleast five characters)." 
          onInput={inputHandler}/>

        <Input
          id='address'
          element='input'
          label="Address" 
          validators={[VALIDATOR_REQUIRE()]} 
          errorText="Please enter a valid address." 
          onInput={inputHandler}/>

        <ImageUpload id="image" center onInput={inputHandler} errorText="Please provide an image." />

        <Button type="submit" disabled={!formState.isValid} >ADD PLACE</Button>
      </form>
    </React.Fragment>
    
  )
}

export default NewPlace