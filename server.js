import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import homeRoutes from "./src/routes/home.js";
import projectRoutes from "./src/routes/projects.js";

dotenv.config({ quiet: true });

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

// routes
app.use("/api/home", homeRoutes);
app.use("/api/projects", projectRoutes);

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
