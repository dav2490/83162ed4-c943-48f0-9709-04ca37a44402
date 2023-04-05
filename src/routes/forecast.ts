import express, {
  RequestHandler,
  Response,
  Request,
  NextFunction,
  ErrorRequestHandler,
} from "express";
import asyncHandler from "express-async-handler";
import OpenWeatherMapClient from "../lib/OpenWeatherMapClient";
import ForecastController from "../controllers/ForecastController";

const forecastController = new ForecastController();
const router = express.Router();

const rootRequestHandler: RequestHandler = (
  request: Request,
  response: Response
): void => {
  response.send("Root endpoint");
};
const getWeatherForecastHandler: RequestHandler = asyncHandler(
  async (
    _request: Request,
    _response: Response,
    next: NextFunction
  ): Promise<void> => {
    const cityName = _request.query?.cityName?.toString();

    const response = await forecastController.getOpenWeatherMapCurrentForecast(
      cityName
    );

    _response.send(response);
  }
);
const postWeatherForecastHandler: RequestHandler = asyncHandler(
  async (
    _request: Request,
    _response: Response,
    next: NextFunction
  ): Promise<void> => {
    const cityName = _request.body?.cityName;

    const response = await forecastController.postOpenWeatherMapCurrentForecast(
      cityName
    );

    _response.send(response);
  }
);
const pathWeatherForecastHandler: RequestHandler = asyncHandler(
  async (
    _request: Request<{ cityName: string }>,
    _response: Response
  ): Promise<void> => {
    const cityName = _request.params.cityName;

    const response = await forecastController.pathOpenWeatherMapCurrentForecast(
      cityName
    );

    _response.send(response);
  }
);
const getFiveDaysForecastHandler: RequestHandler = asyncHandler(
  async (
    _request: Request<{ cityName: string }>,
    _response: Response
  ): Promise<void> => {
    const cityName = _request.query?.cityName?.toString();

    const response = await forecastController.getOpenWeatherMapFiveDaysForecast(
      cityName
    );

    _response.send(response);
  }
);
const postFiveDaysForecastHandler: RequestHandler = asyncHandler(
  async (
    _request: Request<{ cityName: string }>,
    _response: Response
  ): Promise<void> => {
    const cityName = _request.body?.cityName;

    const response =
      await forecastController.postOpenWeatherMapFiveDaysForecast(cityName);

    _response.send(response);
  }
);
const pathFiveDaysForecastHandler: RequestHandler = asyncHandler(
  async (
    _request: Request<{ cityName: string }>,
    _response: Response
  ): Promise<void> => {
    const cityName = _request.params?.cityName;

    const response =
      await forecastController.pathOpenWeatherMapFiveDaysForecast(cityName);

    _response.send(response);
  }
);
const getGroupedForecastHandler: RequestHandler = asyncHandler(
  async (
    _request: Request,
    _response: Response,
    next: NextFunction
  ): Promise<void> => {
    const response =
      await forecastController.getOpenWeatherMapGroupedForecast();

    _response.send(response);
  }
);
const postGroupedForecastHandler: RequestHandler = asyncHandler(
  async (
    _request: Request,
    _response: Response,
    next: NextFunction
  ): Promise<void> => {
    const response =
      await forecastController.postOpenWeatherMapGroupedForecast();

    _response.send(response);
  }
);

const errorHandler: ErrorRequestHandler = (
  error: any,
  _request: Request,
  _response: Response,
  next
): void => {
  if (OpenWeatherMapClient.isOpenWeatherMapClientError(error))
    _response.status(error.status || 501);
  _response.send(error.message);
};

router.get("/", rootRequestHandler);

router.get("/forecast/today", getWeatherForecastHandler);
router.post("/forecast/today", postWeatherForecastHandler);
router.get("/forecast/today/:cityName", pathWeatherForecastHandler);

router.get("/forecast/five-days", getFiveDaysForecastHandler);
router.post("/forecast/five-days", postFiveDaysForecastHandler);
router.get("/forecast/five-days/:cityName", pathFiveDaysForecastHandler);

router.get("/forecast/grouped", getGroupedForecastHandler);
router.post("/forecast/grouped", postGroupedForecastHandler);

router.use(errorHandler);

export default router;
