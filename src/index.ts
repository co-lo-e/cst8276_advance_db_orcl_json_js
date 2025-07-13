import cors from "cors";
import express, { Request, Response } from "express";
import path from "node:path";
import { testHR } from "./orcl";

const app = express();
app.use(cors());

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.get("/hello", (req, resp) => {
	resp.json({ message: "hello world" });
});

app.post("/data", (req: Request, resp: Response) => {
	const body = req.body;
	console.log(body);
});

const port = 8000;
app.listen(port, async () => {
	const user = process.env.ORCL_USER;
	if (user === "hr") {
		console.log("testing hr.")
		await testHR(103);
	}

	console.log("listening on " + port);
});
