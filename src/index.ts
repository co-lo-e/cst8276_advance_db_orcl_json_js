import cors from "cors";
import express from "express";
import path from "node:path";
import { createHousing, deleteHousing, getAllHousing, getHousingById, queryByJsonQuery, queryHousingByDotNotation, updateHousing } from "./controller";
import { testHR } from "./orcl";

const app = express();
app.use(cors());

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.get("/housing", getAllHousing);
app.get("/housing/id/:id", getHousingById);
app.post("/housing", createHousing);
app.put("/housing/:id", updateHousing);
app.delete("/housing/:id", deleteHousing);
app.get("/housing/dot", queryHousingByDotNotation)
app.get("/housing/jq", queryByJsonQuery)


const port = 8000;

app.listen(port, async () => {
	const user = process.env.ORCL_USER;

	if (user === "hr") {
		console.log("testing hr.")
		await testHR(103);
	}


	console.log("listening on " + port);
});
