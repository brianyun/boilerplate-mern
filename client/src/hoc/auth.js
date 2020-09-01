import React, { useEffect } from "react";
import Axios from "axios";
import { useDispatch } from "react-redux";
import { auth } from "../_actions/user_action";

export default function (SpecificComponent, option, adminRoute = null) {
	//option (내가 정함)
	//null : 아무나 출입가능한 페이지
	//true: 로그인한 유저만 출입가능한 페이지
	//false: 로그인한 유저는 출입 불가능한 페이지

	function AuthenticationCheck(props) {
		const dispatch = useDispatch();

		useEffect(() => {
			dispatch(auth()).then((response) => {
				console.log(response);

				//로그인 안되어있다면
				if (!response.payload.isAuth) {
					if (option) {
						console.log("auth - login first.");
						props.history.push("/login");
					}
				} else {
					//로그인 되어있다면
					if (adminRoute && !response.payload.isAdmin) {
						console.log("auth - you are not admin.");
						props.history.push("/");
					} else {
						if (option === false) {
							console.log("auth - you are already logged in");
							props.history.push("/");
						}
					}
				}
			});
		}, []);

		return <SpecificComponent />;
	}

	return AuthenticationCheck;
}
