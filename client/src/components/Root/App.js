import React, { useState } from 'react';
import { Switch, Route} from 'react-router-dom';

import Auth from '../../services/auth.service';

import './App.scss';

import Navbar from '../Navbar/Navbar';
import BookList from '../Books/BookList';
import CreateBook from '../Books/CreateBook';
import BookDetails from '../Books/BookDetails';
import UserBooks from '../Books/UserBooks';
import Signup from '../Auth/Signup';
import Login from '../Auth/Login';
import Home from './Home'
import Footer from '../Footer/Footer';
import FavBooks from '../Books/FavBooks';

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
              <Route path='/books' render={() => <BookList user={user} />} />
              <Route path='/book/create' exact component={CreateBook} />
              <Route path='/book/read/:id' exact render={({match, history}) => <BookDetails history={history} match={match} user={user} setUser={setUser} />} />
              <Route path='/user/books' render={({history}) => <UserBooks history={history} user={user} />} />
              <Route path='/book/editBook/:id' render={({match, history}) => <CreateBook history={history} match={match} user={user} edit={true} />} />
              <Route path='/user/favourite-books' render={() => <FavBooks user={user} /> } />
            </Switch>
          ) : (
            <Switch>
              <Route path='/books' component={BookList} />
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
