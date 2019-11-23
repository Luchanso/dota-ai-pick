import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { HeroPicker } from '../HeroPicker/HeroPicker';

export const App = () => (
  <Router>
    <Switch>
        <Route path="/ai-picker">
            <HeroPicker />
          </Route>
          <Route path="/">
            <h1>Hello world</h1>
          </Route>
        </Switch>
    </Router>
);
