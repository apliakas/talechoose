import './App.css';
import Books from '../Books/Books';
import { Switch, Route} from 'react-router-dom'
import Navbar from '../Navbar/Navbar'
import BookDetails from '../Books/BookDetails'
import AddBookForm from '../Books/AddBook';
import Signup from '../Signup/Signup';


function App() {
  return (
    <div className="App">
      <h1>Create your adventure</h1>
      <Navbar />
      <Switch>
        <Route path='/signup' component={Signup} />
        <Route exact path='/books' component={Books} />
        <Route exact path='/book/create' component={AddBookForm} />
        <Route path='/book/:id' exact component={BookDetails} />
      </Switch>
    </div>
  );
}

export default App;
