const express = require("express");
const app = express();
const port = 5000;
const mongoose = require("mongoose");

mongoose
	.connect(
		"mongodb+srv://hsyun:cristiano7!@boilerplate-mern.dxc3p.mongodb.net/test?retryWrites=true&w=majority",
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
			useFindAndModify: true,
		}
	)
	.then(() => console.log("Mongo DB connected..."))
	.catch((err) => console.log(err));

app.get("/", (req, res) => {
	res.send("Hello World!");
});

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
