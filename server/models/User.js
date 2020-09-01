const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
	name: {
		type: String,
		maxlength: 50,
	},
	email: {
		type: String,
		trim: true,
		unique: 1,
	},
	password: {
		type: String,
		minlength: 5,
	},
	lastname: {
		type: String,
		maxlength: 50,
	},
	role: {
		type: Number,
		default: 0,
	},
	image: String,
	token: {
		type: String,
	},
	tokenExp: {
		type: Number,
	},
});

//save 전에 조작 가할 수 있음. 암호화 미리.
userSchema.pre("save", function (next) {
	var user = this;

	if (user.isModified("password")) {
		//password가 바뀌었을 때만 이렇게 새로 암호화 해야됨.

		bcrypt.genSalt(saltRounds, function (err, salt) {
			if (err) return next(err);

			bcrypt.hash(user.password, salt, function (err, hash) {
				//store
				if (err) return next(err);
				user.password = hash;
				next();
			});
		});
	} else {
		next();
	}
});

userSchema.methods.comparePassword = function (plainPassword, cb) {
	bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
		if (err) return cb(err);
		cb(null, isMatch);
	});
};

userSchema.methods.generateToken = function (cb) {
	var user = this;

	//3. create token
	var token = jwt.sign(user._id.toHexString(), "mysecretkey");
	user.token = token;
	user.save(function (err, user) {
		if (err) return cb(err);
		cb(null, user);
	});
};

userSchema.statics.findByToken = function (token, cb) {
	var user = this;

	jwt.verify(token, "mysecretkey", function (err, decoded) {
		//find user from userId,
		user.findOne({ _id: decoded, token: token }, function (err, user) {
			if (err) return cb(err);
			cb(null, user);
		});
		//compare client token with DB saved token
	});
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
