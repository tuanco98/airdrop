import { ApolloServer } from "apollo-server";
import { config_PORT } from "../config";
import { resolvers } from "./resolvers";
import { typeDefs } from "./typeDefs/schema";
import { successConsoleLog } from "../color-log";

export const initGraphQLServer = async () => {
    try {
        const server = new ApolloServer({
            typeDefs,
            resolvers,
            subscriptions:{
              path:'/'
            },
            debug: true,
        });
        const { url } = await server.listen({ port: config_PORT });
        successConsoleLog(`🚀 Apollo server ready at ${url}`);
    } catch (e) {
        throw e;
    }
};
