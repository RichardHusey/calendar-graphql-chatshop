import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fs from "fs";
import { ApolloServer, gql } from "apollo-server-express";
import resolvers from "./resolvers";
const typeDefs = fs.readFileSync('./src/schema.graphql',{encoding:'utf-8'});
const port = process.env.PORT || 9000;

const server = new ApolloServer({ typeDefs, resolvers});
const app = express();

app.use(cors(), bodyParser.json());

const startServer = async () => {
    try {
      await server.start();
      server.applyMiddleware({app});
      app.listen(port, () => console.log(`Now browse to http://localhost:9000${server.graphqlPath}`));
    } catch(err) {
      console.log(err);
    }
  }
  
  startServer();