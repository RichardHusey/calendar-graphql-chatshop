import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fs from "fs";

const port = process.env.PORT || 9000;
const app = express();

app.use(cors(), bodyParser.json());
app.listen(port, () => console.log(`Now browse to http://localhost:9000`));