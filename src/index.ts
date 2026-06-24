import { app } from "./app";
import dotenv from "dotenv";
import UsuarioRouter from "./routes/UsuarioRouter";
import { authRouter } from "./routes/AuthRouter";
import { AuthMiddleware } from './middlewares/AuthMiddleware';

app.use('/users', AuthMiddleware.authenticate, UsuarioRouter)

app.use('/auth', authRouter)


dotenv.config();

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
