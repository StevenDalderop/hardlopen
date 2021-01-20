import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import Index from "./index";
import Schedule from "./schedule";
import Competitions from "./competitions";
import Session from "./session";
import Trainingen from "./trainingen"

export default class Homepage extends React.Component {
	constructor(props) {
		super(props);
	}
	
	render() {
		return (
		    <Router>
				<Switch>
				  <Route exact path="/">
					< Index />
				  </Route>
				  <Route path="/schema">
                    < Schedule />
                  </Route>
				  <Route path="/trainingen">
					  <Trainingen />
				  </Route>
				  <Route path="/wedstrijden">
					< Competitions />
				  </Route>
				  < Route path="/session/:session_id" component={Session} />
				</Switch>
			</Router>
			)
	}
}
			