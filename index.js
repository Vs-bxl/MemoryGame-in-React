import express from "express";
import cors from "cors";
import Game from "./models/game.js";
import { connectToDatabase } from "./connection.js";

const app = express();
app.use(cors());
app.use(express.json());

await connectToDatabase();
const PORT = 3000;

app.post("/api/game/start", async (req, res) => {
    try {
        const players = req.body;
        const { _id } = await Game.create({
            players,
        });
        return res.json({ _id });
    } catch (error) {
        return res.status(500).json({ message: "something went wrong" })
    }
});

app.post("/api/game/update", async (req, res) => {
    const { _id, players } = req.body;
    await Game.findByIdAndUpdate(_id, { players });
    return res.json({ message: "updated successfully" });
});

app.post("/api/game/winner", async (req, res) => {
    const { _id, winners } = req.body;

    await Game.findByIdAndUpdate(_id, { winners });
    return res.json({ message: "Winners added" });
});

app.get("/api/game/winners", async (req, res) => {
    try {
        const games = await Game.aggregate([
            { $unwind: "$winners" },
            {
                $sort: {
                    "winners.score": -1,
                    "winners.turns": 1,
                    "winners.name": 1
                },
            },
            { $replaceRoot: { newRoot: "$winners" } }, // Restructure output
        ]);
        return res.json(games);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
