import './App.css';
import HandTracker from './components/HandTracker/HandTracker';
import Home from './components/Home/Home';
import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path='/hand-tracker'>
          <HandTracker/>
          <Link className="button" to='/'>Home</Link>
        </Route>

        <Route exact path='/'>
          <Home />
          <Link className="button" to='/hand-tracker'>HandTracker</Link>
        </Route>

        <Route path='/'>
          {()=><h1 style={{textAlign:'center'}}>404 Error: Page not found</h1>}
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
