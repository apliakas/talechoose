import React, { useState } from 'react';
import { Switch, Route} from 'react-router-dom';

import Auth from '../../services/auth.service';

import './App.css';

import Navbar from '../Navbar/Navbar';
import BookList from '../Books/BookList';
import CreateBook from '../Books/CreateBook';
import BookDetails from '../Books/BookDetails';
import Signup from '../Auth/Signup';
import Login from '../Auth/Login';

const isUserAuthenticated = (setUser) => {
  Auth
    .isAuthenticated()
    .then((response) => {
      setUser(response);
    })
    .catch((err) => console.log(err));
};

function App() {
  const [user, setUser] = useState(null);

  if (user === null) {
    isUserAuthenticated(setUser);
  }

  return (
    <div className="App">
      <h1>Create your adventure</h1>
      <Navbar user={user} setUser={setUser} />
      <Switch>
        <Route path='/books' component={BookList} />
      </Switch>
      { user ? (
        <Switch>
          <Route exact path='/book/create' component={CreateBook} />
          <Route exact path='/book/:id' render={({match, history}) => <BookDetails history={history} match={match} user={user}/>} />
        </Switch>
      ) : (
        <Switch>
          <Route path='/signup' render={() => <Signup setUser={setUser} />} />
          <Route path='/login' render={() => <Login setUser={setUser} />} />
          <Route path='/book/:id' exact component={BookDetails} />
        </Switch>
      ) }
    </div>
  );
}

export default App;
