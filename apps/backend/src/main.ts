import "reflect-metadata";
import cookieParser from "cookie-parser";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module.js";

const port = Number.parseInt(process.env.PORT ?? "3000", 10);

const app = await NestFactory.create(AppModule);
app.use(cookieParser());
app.enableCors({
  origin: process.env.FRONTEND_ORIGIN ?? "http://localhost:3001",
  credentials: true
});

await app.listen(port, "0.0.0.0");

