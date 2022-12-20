import App from "./app";
import { SeatsController } from "./controller/seat-controller";
import "source-map-support/register";
import { MongoDBConnection } from "./api/mongodb-connection";

const mongoDbConnection: MongoDBConnection = new MongoDBConnection();

async function initializeAnalyticCommon() {
    await mongoDbConnection.initMongoDB();
}

initializeAnalyticCommon();
const app = new App([new SeatsController(mongoDbConnection)]);

app.listen();
