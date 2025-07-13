import express from "express";
import { testHR } from "./orcl";





const app = express();

app.get("/", (req, resp) => {
	resp.send("Hello world")
})

const port = 8000;
app.listen(port, async () => {

	console.log(process.env.ORCL_USER)
	console.log(process.env.ORCL_PSWD)

	await testHR(103)	;

	console.log("listening on " + port);

});