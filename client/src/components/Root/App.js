import React, { useState } from 'react';
import './App.css';
import Books from '../Books/Books';
import { Switch, Route} from 'react-router-dom'
import Navbar from '../Navbar/Navbar';
import BookDetails from '../Books/BookDetails';
import AddBookForm from '../Books/AddBook';
import Signup from '../Auth/Signup';
import AuthService from '../Services/auth.service';
import Login from '../Auth/Login';


function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const getLoggedInUser = (userObject) => setLoggedInUser(userObject)

  const service = new AuthService();

  const fetchUser = () => {
    if (loggedInUser === null) {
      service
        .isAuthenticated()
        .then((response) => {
          setLoggedInUser(response);
        })
        .catch((err) => {
          setLoggedInUser(false)
        })
    }
  }

  fetchUser();

  return loggedInUser ? (
    <div className="App">
      <h1>Create your adventure</h1>
      <Navbar userInSession={loggedInUser} getUser={getLoggedInUser} />
      <Switch>
        <Route exact path='/books' component={Books} />
        <Route exact path='/book/create' component={AddBookForm} />
        <Route path='/book/:id' exact render={({match, history}) => <BookDetails history={history} match={match} loggedInUser={loggedInUser}/>} />
      </Switch>
    </div>
  ) : (
    <div className="App">
      <h1>Create your adventure</h1>
      <Navbar userInSession={loggedInUser} getUser={getLoggedInUser} />
      <Switch>
        <Route path='/signup' render={() => <Signup getUser={getLoggedInUser} />} />
        <Route path='/login' render={() => <Login getUser={getLoggedInUser} />} />
        <Route exact path='/books' component={Books} />
        <Route exact path='/book/create' component={AddBookForm} />
        <Route path='/book/:id' exact component={BookDetails} />
      </Switch>
    </div>
  )
}

export default App;
