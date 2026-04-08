import './loadEnv.js';
import express from "express";
import cors from 'cors'
import { signInController } from "./controllers/authControllers/signInController.js";
import { loginController } from "./controllers/authControllers/logInController.js";
import cookieParser from "cookie-parser";
import {authMiddleware} from "./middlewares/authMiddleware.js";
import {quizzesController} from "./controllers/quizzesControllers/quizzesController.js";
import {startQuizController} from "./controllers/quizzesControllers/startQuizController.js";

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.post("/auth/signin", signInController);
app.post('/auth/login', loginController);
app.get('/quizzes', authMiddleware, quizzesController);
app.get('/quizzes/start', authMiddleware, startQuizController);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
