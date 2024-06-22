import React, { Suspense } from 'react';
import { BrowserRouter as Router,Route,Redirect,Switch} from 'react-router-dom';
import MainNavigation from './shared/components/Navigation/MainNavigation'
import { AuthContext } from './shared/context/auth-context';
import { useAuthentication } from './shared/hooks/auth-hook';
import LoadingSpinner from './shared/components/UIelements/LoadingSpinner';
// import NewPlace from './places/pages/NewPlace';
// import Users from './user/pages/Usrs';
// import UserPlaces from './places/pages/UserPlaces';
// import UpdatePlace from './places/pages/UpdatePlace';
// import Auth from './user/pages/Auth';

//code splitting/ lazy loading
const Users = React.lazy(() => import('./user/pages/Usrs'));
const NewPlace = React.lazy(() => import('./places/pages/NewPlace'));
const UserPlaces = React.lazy(() => import('./places/pages/UserPlaces'));
const UpdatePlace = React.lazy(() => import('./places/pages/UpdatePlace'));
const Auth = React.lazy(() => import('./user/pages/Auth'));

const App = () => {           
                     //or function App(){} ...
  const { token, login, logout, userId} = useAuthentication();                                                     //dependency array -empty => this function will run only once

  let routes;

  if(token){
    routes = (
      <Switch>

        <Route path='/' exact>
          <Users />
        </Route>

        <Route path="/:userId/places">
          <UserPlaces/>
        </Route>

        <Route path='/places/new' exact>
            <NewPlace />
        </Route>    

        <Route path="/places/:placeId">
          <UpdatePlace />
        </Route>

        <Redirect to='/' />
      </Switch>
    );
  }else{
    routes = (
      <Switch>
        <Route path='/' exact>
          <Users />
        </Route>

        <Route path="/:userId/places">
          <UserPlaces/>
        </Route>

        <Route to='/auth' >
            <Auth />
        </Route>

        <Redirect to='/auth' />
      </Switch>
    );
  }

  return (
  <AuthContext.Provider 
    value={{
      isLoggedIn : !!token,
      token: token,
      userId : userId, 
      login: login, 
      logout: logout
    }}
  >        {/*the Provider property that converts th object into the react component */}


    <Router>              
      <MainNavigation/>
      <main>                
          <Suspense fallback={<div className='center'>
            <LoadingSpinner/>
            </div>}>{routes}</Suspense>
      </main>
    </Router>
  </AuthContext.Provider>
  )
}

export default App;
