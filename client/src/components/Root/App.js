import React, { useState } from 'react';
import { Switch, Route} from 'react-router-dom';

import Auth from '../../services/auth.service';

import './App.scss';

import Navbar from '../Navbar/Navbar';
import BooksList from '../Books/BooksList';
import BookForm from '../Books/BookForm';
import BookDetails from '../Books/BookDetails';
import Signup from '../Auth/Signup';
import Login from '../Auth/Login';
import Home from './Home'
import Footer from '../Footer/Footer';

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
    <div className="App is-flex is-flex-direction-column">
      <Navbar user={user} setUser={setUser} />
      <div className='main'>
        <div className='container p-4'>
          <Switch>
            <Route path='/' exact render={() => <Home user={user} />} />
          </Switch>
          { user ? (
            <Switch>
              <Route path='/books' render={({match}) => <BooksList publicBooks={true} match={match} user={user} />} />
              <Route path='/book/create' exact component={BookForm} />
              <Route path='/book/read/:id' exact render={({match, history}) => <BookDetails history={history} match={match} user={user} setUser={setUser} />} />
              <Route path='/user/books' render={({match, history}) => <BooksList userBooks={true} match={match} history={history} user={user} />} />
              <Route path='/book/editBook/:id' render={({match, history}) => <BookForm history={history} match={match} user={user} />} />
              <Route path='/user/favourite-books' render={({match}) => <BooksList favBooks={true} match={match} user={user} /> } />
            </Switch>
          ) : (
            <Switch>
              <Route path='/books' component={BooksList} />
              <Route path='/signup' render={({ history}) => <Signup history={history} setUser={setUser} />} />
              <Route path='/login' render={({ history}) => <Login history={history} setUser={setUser} />} />
              <Route path='/book/read/:id' exact component={BookDetails} />
            </Switch>
          ) }
        </div>
      </div>
      <Footer /> 
    </div>
  );
}

export default App;
