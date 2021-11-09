import * as express from "express";
import * as mongoose from "mongoose";

class App {
  public app: express.Application;
  public port: number;

  constructor(controllers) {
    this.app = express();
    this.port = parseInt(process.env.PORT, 10);

    this.connectToTheDatabase();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }

  private initializeMiddlewares() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private initializeControllers(controllers) {
    controllers.forEach((controller) => {
      this.app.use("/", controller.router);
    });
  }

  private connectToTheDatabase() {
    const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH } = process.env;
    mongoose
      .connect(`mongodb://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`)
      .catch((error) => console.log(error));
  }
}

export default App;
