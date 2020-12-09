import React, { useState } from 'react';
import { Switch, Route} from 'react-router-dom';

import Auth from '../../services/auth.service';

import './App.css';

import Navbar from '../Navbar/Navbar';
import BookList from '../Books/BookList';
import CreateBook from '../Books/CreateBook';
import BookDetails from '../Books/BookDetails';
import UserBooks from '../Books/UserBooks';
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
      <Navbar user={user} setUser={setUser} />
      <Switch>
        <Route path='/books' component={BookList} />
      </Switch>
      { user ? (
        <Switch>
          <Route path='/book/create' exact component={CreateBook} />
          <Route path='/book/read/:id' exact render={({match, history}) => <BookDetails history={history} match={match} user={user}/>} />
          <Route path='/user/books' render={() => <UserBooks user={user}/>} />
        </Switch>
      ) : (
        <Switch>
          <Route path='/signup' render={({ history}) => <Signup history={history} setUser={setUser} />} />
          <Route path='/login' render={({ history}) => <Login history={history} setUser={setUser} />} />
          <Route path='/book/read/:id' exact component={BookDetails} />
        </Switch>
      ) }
    </div>
  );
}

export default App;
