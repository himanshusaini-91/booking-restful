import bodyParser from "body-parser";
import config from "config";
import cors from "cors";
import express from "express";
import expressValidator from "express-validator";
import IController from "./common/controller-interface";
import errorHandler from "./error/error-handler";

class App {
    public app: express.Application;

    constructor(controllers: IController[]) {
        this.app = express();
        this.initializeMiddlewares();
        this.initializeControllers(controllers);
        this.initializeErrorHandler();
    }

    public listen(): void {
        this.app.listen(5000, () => {
            console.log("App is running");
        });
    }

    public getServer(): express.Application {
        return this.app;
    }

    private initializeMiddlewares() {
        const corsOptions = {
            origin: config.get<string>("cors.origin")
        };
        // Middleware for CORS
        this.app.use(cors(corsOptions));

        // Middlewares for bodyparsing using both json and urlencoding
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.json());
    }

    private initializeControllers(controllers: IController[]) {
        controllers.forEach((controller) => {
            this.app.use("/", controller.router);
        });
    }

    private initializeErrorHandler() {
        this.app.use(errorHandler);
    }
}


export default App;
