import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import LandingPage from "./views/LandingPage/LandingPage";
import LoginPage from "./views/LoginPage/LoginPage";
import RegisterPage from "./views/RegisterPage/RegisterPage";

import Auth from "../hoc/auth";

const App = () => {
	return (
		<Router>
			<div>
				{/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
				<Switch>
					<Route exact path="/" component={Auth(LandingPage, null)} />
					<Route
						exact
						path="/register"
						component={Auth(RegisterPage, false)}
					/>
					<Route
						exact
						path="/login"
						component={Auth(LoginPage, false)}
					/>
				</Switch>
			</div>
		</Router>
	);
};

export default App;
