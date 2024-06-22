import React, { useState,useContext } from 'react';

import'./Auth.css'
import Card from '../../shared/components/UIelements/Card';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import LoadingSpinner from '../../shared/components/UIelements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIelements/ErrorModal'
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';

const Auth = () => {
  const auth = useContext(AuthContext);
  const[isLoginMode, setIsLoginMode] = useState(true);

  // const[isLoading, setIsLoading] = useState(false);
  // const[error, setError] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [formState,inputHandler,setFormData] = useForm({
    email:{
        value:'',
        isValid:false
    },
    password:{
        value:'',
        isValid: false
    }
  },false)

  const switchModeHandler = () =>{
    if(!isLoginMode){
        setFormData({
            ...formState.inputs,
            name:undefined,
            image: undefined
        },
        formState.inputs.email.isValid,formState.inputs.password.isValid);
    }else{
        setFormData({
            ...formState.inputs,
            name:{
                value:'',
                isValid: false
            },
            image: {
              value: null,
              isValid: false
            }
        },false)
    }
    setIsLoginMode(prevMode => !prevMode)
  }

  const authSubmitHandler = async event =>{
    event.preventDefault();
    // setIsLoading(true);
    console.log(formState.inputs);
    // if(isLoginMode){
    //   try{
    //     const response = await fetch('http://localhost:4000/api/users/login',{      
    //       method: 'POST' ,
    //       headers: {
    //         'Content-Type': 'application/json'
    //       },
    //       body: JSON.stringify({
    //         email: formState.inputs.email.value,
    //         password: formState.inputs.password.value
    //       })  
    //     });

    //     const responseData = await response.json();

    //     if(!response.ok){      
    //         throw new Error(responseData.message);
    //     }

    //     console.log(responseData);
    //     setIsLoading(false);

    //     auth.login();                    
    //   }catch(err){
    //       console.error(err);
    //       setIsLoading(false);           
    //       setError(err.message || 'Something went wrong, please try again.');
    //   }
    // }else{
    //   try{
    //     const response = await fetch('http://localhost:4000/api/users/signup',{      //fetch method does not consider error code 404,500 (from backend) as it send a req and gets a res -- so we declare a new method for it.
    //       method: 'POST' ,
    //       headers: {
    //         'Content-Type': 'application/json'
    //       },
    //       body: JSON.stringify({
    //         name: formState.inputs.name.value,
    //         email: formState.inputs.email.value,
    //         password: formState.inputs.password.value
    //       })  // takes regular js data like an array or like an object and it will convert it to JSON.
    //     });

    //     const responseData = await response.json();

    //     if(!response.ok){      //true if status code of 200 not 4xx or 5xx
    //         throw new Error(responseData.message);
    //     }

    //     console.log(responseData);
    //     setIsLoading(false);

    //     auth.login();                    //done if error not occurs
    //   }catch(err){
    //       console.error(err);
    //       setIsLoading(false);           //if error also occurs -- loading should be stopped
    //       setError(err.message || 'Something went wrong, please try again.');
    //   }
    // }

    // using custom hook:

    if(isLoginMode){
      try{
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + '/users/login', 
          'POST', 
          JSON.stringify({
              email: formState.inputs.email.value,
              password: formState.inputs.password.value
          }),
          {
               'Content-Type': 'application/json'
          }
        );
        auth.login(responseData.userId,responseData.token);
      }catch(err){};
    }
    else{
      try{
        const formData = new FormData();
        formData.append('email',formState.inputs.email.value)
        formData.append('name',formState.inputs.name.value)
        formData.append('password',formState.inputs.password.value)
        formData.append('image',formState.inputs.image.value)

        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL  +'/users/signup', 
          'POST', 
          formData
          // JSON.stringify({
          //     name: formState.inputs.name.value,
          //     email: formState.inputs.email.value,
          //     password: formState.inputs.password.value
          // }),
          // {
          //      'Content-Type': 'application/json'
          // }
        );

        auth.login(responseData.userId,responseData.token);
      }catch(err){};
    }
  };

  // const errorHandlder = () => {     --> clearError(); 
  //   // setError(null);
  // }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError}/>  
      {isLoading && <LoadingSpinner asOverlay={true}/>}
      <Card className="authentication" >
          <h2>Login Reqiuired</h2>
          <hr/>
          <form onSubmit={authSubmitHandler}>
            {!isLoginMode && <Input 
              element='input'
              id='name'
              type='text'
              label='NAME'
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a name."
              onInput={inputHandler}
              />}

            {!isLoginMode && <ImageUpload center id="image" onInput={inputHandler} errorText="Please provide an image." />}

            <Input 
              element='input'
              id='email'
              type='email'
              label='E-MAIL'
              validators={[VALIDATOR_EMAIL()]}
              errorText="Please enter a valid email address."
              onInput={inputHandler}
            />
            <Input 
              element='input'
              id='password'
              type='password'
              label='PASSWORD'
              validators={[VALIDATOR_MINLENGTH(6)]}
              errorText="Please enter a valid paswword atleast 6 characters)."
              onInput={inputHandler}
            />
            <Button type="submit" disabled={!formState.isValid}>
              {isLoginMode ? 'LOGIN' : 'SIGNUP'}
            </Button>
          </form>
          <Button inverse onClick={switchModeHandler}>
              SWITCH TO {isLoginMode ? 'SIGNUP' : 'LOGIN'}</Button>
      </Card>
    </React.Fragment>
  
  );
}

export default Auth;
