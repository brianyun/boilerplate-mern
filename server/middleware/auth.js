const { User } = require("../models/User");

let auth = (req, res, next) => {
	//인증 처리를 하는 곳
	//1. get token from client
	let token = req.cookies._cury___;

	//2. decode token and find user
	User.findByToken(token, (err, user) => {
		if (err) throw err;
		if (!user) return res.json({ isAuth: false, error: true });

		req.token = token;
		req.user = user;
		next();
	});
	//3. user existence --> auth
};

module.exports = { auth };
