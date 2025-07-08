import express from "express";

const app = express();

app.get("/", (req, resp) => {
	resp.send("Hello world")
})

const port = 8000;
app.listen(port, () => {
	console.log("listening on " + port);
});