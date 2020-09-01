import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./components/App";
import * as serviceWorker from "./serviceWorker";
import "antd/dist/antd.css";

import { Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import promiseMiddleware from "redux-promise";
import ReduxThunk from "redux-thunk";
import Reducer from "./_reducers";

const createStoreWithMiddleWare = applyMiddleware(
	promiseMiddleware,
	ReduxThunk
)(createStore);

ReactDOM.render(
	<Provider
		store={createStoreWithMiddleWare(
			Reducer,
			window.__REDUX_DEVTOOLS_EXTENSION &&
				window.__REDUX_DEVTOOLS_EXTENSION()
		)}
	>
		<App />
	</Provider>,

	document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
