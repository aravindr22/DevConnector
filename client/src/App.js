import React, {Fragment, useEffect} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import './App.css'
import Navbar from './components/layout/Navbar';
import Landing from "./components/layout/Landing";
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Alert from './components/layout/Alert';
import Dashboard from './components/dashboard/Dashboard';
import CreatProfile from './components/profile-form/CreatProfile';
import PrivateRoute from './components/routing/PrivateRoute';
import EditProfile from './components/profile-form/Edit-Profile';

//Redux
import {Provider} from 'react-redux';
import store from './store';
import {loadUSer} from './actions/auth';
import setAuthToken from './utils/setAuthToken';

if(localStorage.token){
  setAuthToken(localStorage.token);
}

const App = () => {

  useEffect(() => {
    store.dispatch(loadUSer());
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Route exact path="/" component={Landing} />
          <section className="container">
            <Alert />
            <Switch>
              <Route exact path="/login" component={Login} />
              <Route exact path="/register" component={Register} />
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
              <PrivateRoute exact path="/create-profile" component={CreatProfile} />
              <PrivateRoute exact path="/edit-profile" component={EditProfile} />
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
  );
}

  

export default App;
