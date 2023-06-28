import { initGraphQLServer } from "./apollo";
import { config_MONGO_URI } from "./config";
import { connectMongo } from "./mongodb";

(async () => {
    try {
        await Promise.all([
            connectMongo(config_MONGO_URI),
            initGraphQLServer(),
        ])
    } catch (e) {
        throw e
    }
})();