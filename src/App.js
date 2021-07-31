import './App.css';
import HandTracker from './components/HandTracker/HandTracker';
import Home from './components/Home/Home';
import ErrorPage from './components/ErrorPage/ErrorPage';
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
        <Route exact path='/'>
          <Home />
          <Link className="button" to='/hand-tracker'>HandTracker</Link>
        </Route>

        <Route path='/hand-tracker'>
          <HandTracker />
          <Link className="button" to='/'>Home</Link>
        </Route>

        <Route path='/'>
          <ErrorPage />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
