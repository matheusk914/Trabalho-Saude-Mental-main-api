import express from "express";
import cors from "cors";

import { avaliacaoRouter } from "./routes/AvaliacaoRouter";
import { createServicosRouter } from "./routes/ServicosRouter";
import usuarioRouter from "./routes/UsuarioRouter";
import funcionarioRouter from "./routes/FuncionarioRouter";
import { authRouter } from "./routes/AuthRouter";

import dotenv from "dotenv";
import { ServicosData } from "./data/ServicosData";
import { GeoService } from "./services/APIlocalizacao";

dotenv.config();

export const app = express();

app.use(express.json());
app.use(cors());

const servicosData = new ServicosData();
const geoService = new GeoService();
const servicosRouter = createServicosRouter(servicosData, geoService);

app.use("/avaliacoes", avaliacaoRouter);
app.use("/servicos", servicosRouter);
app.use("/usuarios", usuarioRouter);
app.use("/funcionarios", funcionarioRouter);
app.use("/auth", authRouter);
