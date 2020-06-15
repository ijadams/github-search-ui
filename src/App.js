import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";

import "./App.sass";
import HomeView from './views/Home'

export default class App extends React.Component {

    render() {
        return (
            <Router>
                <Switch>
                    <Route path="/">
                        <HomeView></HomeView>
                    </Route>
                </Switch>
            </Router>
        );
    }
}
