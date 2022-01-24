import CameraView from './components/CameraView';
import Home from './components/Home';
import ErrorPage from './components/ErrorPage/ErrorPage';
import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';
import AssessmentPage from './components/AssessmentPage';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path='/'>
          <Home />
          <Link className="button" to='/hand-tracker'>HandTracker</Link>
        </Route>

        <Route path='/hand-tracker'>
          <AssessmentPage />
        </Route>

        <Route path='/'>
          <ErrorPage />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
