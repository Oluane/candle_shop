import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Switch, Route, Redirect } from "react-router-dom";
import { routes } from "../../services/routes";
import Navbar from "../Navbar/Navbar";
import apiInstance from "../../services/api";
import userActions from "../../redux/actions/userActions";

const PrivateRoute = ({ component: Component, auth, authenticationRequestState, ...rest }) => (
	<Route
		{...rest}
		render={(props) => {
			switch (auth) {
				case true:
					return <Component {...props} />;
				case false:
					switch (authenticationRequestState) {
						case "notYetAsked":
						case "loading":
							return null;
						case "ok":
							return <Component {...props} />;
						case "invalidToken":
						case "noToken":
							return (
								<Redirect
									to={{
										pathname: "/account/login",
										state: { from: props.location.pathname },
									}}
								/>
							);
						default:
							return null;
					}
			}
		}}
	/>
);

const Router = () => {
	const dispatch = useDispatch();

	const isLoggedUser = useSelector((state) => state.user.isLoggedIn);
	const [authenticationRequestState, setAuthenticationRequestState] = useState("notYetAsked");

	useEffect(() => {
		if (!isLoggedUser) {
			let xsrfToken = null;
			xsrfToken = localStorage.getItem("xsrfToken");

			if (xsrfToken !== null) {
				setAuthenticationRequestState("loading");
				apiInstance
					.get("/user")
					.then(({ data }) => {
						dispatch({ ...userActions.USER_LOGIN, payload: data[0] });
						setAuthenticationRequestState("ok");
					})
					.catch((err) => {
						if (err.response.status === 401) {
							setAuthenticationRequestState("invalidToken");
						} else {
							setAuthenticationRequestState("internalError");
						}
					});
			} else {
				setAuthenticationRequestState("noToken");
			}
		}
	}, [isLoggedUser]);

	return (
		<>
			<Navbar />
			<main style={{ marginTop: "65px" }}>
				<Switch>
					{Object.keys(routes).map((route, key) => {
						const { path, component, isPrivate } = routes[route];

						if (!isPrivate) {
							return <Route exact path={path} component={component} key={key} />;
						} else {
							return (
								<PrivateRoute
									exact
									path={path}
									component={component}
									auth={isLoggedUser}
									key={key}
									authenticationRequestState={authenticationRequestState}
								/>
							);
						}
					})}
					<Redirect from="*" to="/" />
				</Switch>
			</main>
		</>
	);
};

export default Router;
