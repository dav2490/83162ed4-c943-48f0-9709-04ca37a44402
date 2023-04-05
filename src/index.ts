import express, { Application } from "express";
import swaggerUi from "swagger-ui-express";
import morgan from "morgan";
import forecastRouter from "./routes/forecast";

const logger = console;
const expressApplication: Application = express();
const port: string = process.env.PORT;

expressApplication.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(undefined, {
    swaggerOptions: {
      url: "/swagger.json",
    },
  })
);

expressApplication.use(express.json());
expressApplication.use(morgan("tiny"));
expressApplication.use(express.static("docs"));

expressApplication.use(forecastRouter);

expressApplication.listen(port, (): void => {
  logger.log(`Server up on http://localhost:${port}`);
});

module.exports = expressApplication;
