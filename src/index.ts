import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import http from "http";
import cors from "cors";
import pkg from "body-parser";
import { readFileSync } from "fs";
import { connect, ConnectOptions } from "mongoose";

const typeDefs = readFileSync("./src/generated/schema.graphql", {
  encoding: "utf-8",
});
import resolvers from "./resolvers/index.js";
import { MONGODB } from "./config.js";

const { json } = pkg;

const app = express();
const httpServer = http.createServer(app);

interface MyContext {
  token?: String;
}

const server = new ApolloServer<MyContext>({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

app.use(
  "/graphql",
  cors<cors.CorsRequest>(),
  json(),
  expressMiddleware(server, {
    context: async ({ req }) => ({ token: req.headers.token }),
  })
);

await new Promise<void>((resolve) =>
  httpServer.listen({ port: 4000 }, resolve)
);

await connect(MONGODB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as ConnectOptions)
  .then(async () => {
    console.log("MongoDB Connected");
    return 4000;
  })
  .then((res) => {
    console.log(`Server running at ${res}`);
  })
  .catch((err) => {
    console.error(err);
  });

console.log(`🚀 Server ready at http://localhost:4000/graphql`);
