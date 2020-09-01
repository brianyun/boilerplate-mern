const express = require("express");
const app = express();
const port = 5000;
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const config = require("./config/key");
const cookieParser = require("cookie-parser");

const { User } = require("./models/User");
const { auth } = require("./middleware/auth");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

mongoose
	.connect(config.mongoURI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		useFindAndModify: true,
	})
	.then(() => console.log("Mongo DB connected..."))
	.catch((err) => console.log(err));

app.get("/", (req, res) => {
	res.send("Hello World!");
});

app.post("/api/register", (req, res) => {
	const user = new User(req.body);

	//save 전에 암호화
	user.save((err, userInfo) => {
		if (err) return res.json({ success: false, err });
		return res.status(200).json({
			success: true,
		});
	});
});

app.post("/api/users/login", (req, res) => {
	//1. find email in db
	User.findOne({ email: req.body.email }, (err, user) => {
		if (!user) {
			return res.json({
				loginSuccess: false,
				message: "email does not exist",
			});
		}

		//2. check hash==password
		user.comparePassword(req.body.password, (err, isMatch) => {
			if (!isMatch) {
				return res.json({
					loginSuccess: false,
					message: "wrong password",
				});
			}

			//3. create token
			user.generateToken((err, user) => {
				if (err) return res.status(400).send(err);

				//4. save token. where? cookie or localstorage.
				res.cookie("_cury___", user.token).status(200).json({
					loginSuccess: true,
					userId: user._id,
				});
			});
		});
	});
});

app.get("/api/users/auth", auth, (req, res) => {
	//to reach this code, auth must be true
	res.status(200).json({
		_id: req.user.id,
		email: req.user.email,
		name: req.user.name,
		lastname: req.user.lastname,
		image: req.user.image,
		isAdmin: req.user.role === 0 ? false : true,
	});
});

app.get("/api/users/logout", auth, (req, res) => {
	User.findOneAndUpdate({ _id: req.user.id }, { token: "" }, (err, user) => {
		if (err) return res.json({ success: false, err });
		return res.status(200).send({
			success: true,
		});
	});
});

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
