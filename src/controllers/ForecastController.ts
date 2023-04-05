import { BodyProp, Controller, Get, Path, Post, Query, Route } from "tsoa";
import {
  FiveDaysForecastResponse,
  GroupedForecastResponse,
  AvailableCities,
  OpenWeatherMapClientConfigLanguage,
  OpenWeatherMapClientConfigMetrics,
  CurrentWeatherResponse,
  OpenWeatherMapClientError,
} from "../models";
import OpenWeatherMapClient from "../lib/OpenWeatherMapClient";

const cities: AvailableCities = {
  Bologna: {
    lat: 44.467,
    lon: 11.433,
  },
  Seattle: {
    lat: 47.606,
    lon: -122.332,
  },
  Canberra: {
    lat: -35.283,
    lon: 149.128,
  },
};
const openWeatherMapClient: OpenWeatherMapClient = new OpenWeatherMapClient({
  apiKey: process.env.OPEN_WEATHER_API_KEY,
  language: OpenWeatherMapClientConfigLanguage.IT,
  units: OpenWeatherMapClientConfigMetrics.METRIC,
});
const parseOpenWeatherMapClientError = (
  error: OpenWeatherMapClientError
): OpenWeatherMapClientError => {
  return error;
};

@Route("forecast")
export default class ForecastController extends Controller {
  public static ERROR_WRONG_CITY: OpenWeatherMapClientError = {
    name: "Wrong city input",
    message: `User has not entered one of the available cities: ${Object.keys(
      cities
    ).join(",")}`,
    status: 400,
  };

  @Get("/today")
  public async getOpenWeatherMapCurrentForecast(
    @Query() cityName: string
  ): Promise<CurrentWeatherResponse | OpenWeatherMapClientError> {
    if (!Object.keys(cities).includes(cityName))
      throw ForecastController.ERROR_WRONG_CITY;

    const results = await openWeatherMapClient.getCurrentWeatherByCity(
      cities[cityName]
    );

    if (OpenWeatherMapClient.isOpenWeatherMapClientError(results))
      throw parseOpenWeatherMapClientError(results);

    return results;
  }

  @Post("/today")
  public async postOpenWeatherMapCurrentForecast(
    @BodyProp() cityName: string
  ): Promise<CurrentWeatherResponse | OpenWeatherMapClientError> {
    if (!Object.keys(cities).includes(cityName))
      throw ForecastController.ERROR_WRONG_CITY;

    const results = await openWeatherMapClient.getCurrentWeatherByCity(
      cities[cityName]
    );

    if (OpenWeatherMapClient.isOpenWeatherMapClientError(results))
      throw parseOpenWeatherMapClientError(results);

    return results;
  }

  @Get("/today/{cityName}")
  public async pathOpenWeatherMapCurrentForecast(
    @Path() cityName: string
  ): Promise<CurrentWeatherResponse | OpenWeatherMapClientError> {
    if (!Object.keys(cities).includes(cityName))
      throw ForecastController.ERROR_WRONG_CITY;

    const results = await openWeatherMapClient.getCurrentWeatherByCity(
      cities[cityName]
    );

    if (OpenWeatherMapClient.isOpenWeatherMapClientError(results))
      throw parseOpenWeatherMapClientError(results);

    return results;
  }

  @Get("/grouped")
  public async getOpenWeatherMapGroupedForecast(): Promise<
    GroupedForecastResponse | OpenWeatherMapClientError
  > {
    const response: GroupedForecastResponse = {
      meanTemp: null,
      highestHumidity: {
        cityName: null,
        value: -999,
      },
      highestTemperature: {
        cityName: null,
        value: -999,
      },
    };
    const temperatures: number[] = [];

    for (const city in cities) {
      const cityForecast = await openWeatherMapClient.getCurrentWeatherByCity(
        cities[city]
      );

      if (OpenWeatherMapClient.isOpenWeatherMapClientError(cityForecast))
        throw parseOpenWeatherMapClientError(cityForecast);

      temperatures.push(cityForecast.main.temp);

      response.highestHumidity =
        cityForecast.main.humidity > response.highestHumidity.value
          ? {
              cityName: cityForecast.name,
              value: cityForecast.main.humidity,
            }
          : response.highestHumidity;

      response.highestTemperature =
        cityForecast.main.temp > response.highestTemperature.value
          ? {
              cityName: cityForecast.name,
              value: cityForecast.main.temp,
            }
          : response.highestTemperature;
    }

    response.meanTemp =
      temperatures.reduce((a, b) => a + b, 0) / temperatures.length;

    return response;
  }
  @Post("/grouped")
  public async postOpenWeatherMapGroupedForecast(): Promise<
    GroupedForecastResponse | OpenWeatherMapClientError
  > {
    const response: GroupedForecastResponse = {
      meanTemp: null,
      highestHumidity: {
        cityName: null,
        value: -999,
      },
      highestTemperature: {
        cityName: null,
        value: -999,
      },
    };
    const temperatures: number[] = [];

    for (const city in cities) {
      const cityForecast = await openWeatherMapClient.getCurrentWeatherByCity(
        cities[city]
      );

      if (OpenWeatherMapClient.isOpenWeatherMapClientError(cityForecast))
        throw parseOpenWeatherMapClientError(cityForecast);

      temperatures.push(cityForecast.main.temp);

      response.highestHumidity =
        cityForecast.main.humidity > response.highestHumidity.value
          ? {
              cityName: cityForecast.name,
              value: cityForecast.main.humidity,
            }
          : response.highestHumidity;

      response.highestTemperature =
        cityForecast.main.temp > response.highestTemperature.value
          ? {
              cityName: cityForecast.name,
              value: cityForecast.main.temp,
            }
          : response.highestTemperature;
    }

    response.meanTemp =
      temperatures.reduce((a, b) => a + b, 0) / temperatures.length;

    return response;
  }

  @Get("/five-days")
  public async getOpenWeatherMapFiveDaysForecast(
    @Query() cityName: string
  ): Promise<FiveDaysForecastResponse | OpenWeatherMapClientError> {
    if (!Object.keys(cities).includes(cityName))
      throw ForecastController.ERROR_WRONG_CITY;

    const results = await openWeatherMapClient.getThreeHourForecastByCityName(
      cities[cityName]
    );

    if (OpenWeatherMapClient.isOpenWeatherMapClientError(results))
      throw parseOpenWeatherMapClientError(results);

    const response: FiveDaysForecastResponse = {};

    for (const threeHoursTimeslot of results.list) {
      response[threeHoursTimeslot.dt_txt] = {
        temp: threeHoursTimeslot.main.temp,
        pressure: threeHoursTimeslot.main.pressure,
        humidity: threeHoursTimeslot.main.humidity,
      };
    }
    return response;
  }

  @Get("/five-days/{cityName}")
  public async pathOpenWeatherMapFiveDaysForecast(
    @Path() cityName: string
  ): Promise<FiveDaysForecastResponse | OpenWeatherMapClientError> {
    if (!Object.keys(cities).includes(cityName))
      throw ForecastController.ERROR_WRONG_CITY;

    const results = await openWeatherMapClient.getThreeHourForecastByCityName(
      cities[cityName]
    );

    if (OpenWeatherMapClient.isOpenWeatherMapClientError(results))
      throw parseOpenWeatherMapClientError(results);

    const response: FiveDaysForecastResponse = {};

    for (const threeHoursTimeslot of results.list) {
      response[threeHoursTimeslot.dt_txt] = {
        temp: threeHoursTimeslot.main.temp,
        pressure: threeHoursTimeslot.main.pressure,
        humidity: threeHoursTimeslot.main.humidity,
      };
    }
    return response;
  }

  @Post("/five-days")
  public async postOpenWeatherMapFiveDaysForecast(
    @BodyProp() cityName: string
  ): Promise<FiveDaysForecastResponse | OpenWeatherMapClientError> {
    if (!Object.keys(cities).includes(cityName))
      throw ForecastController.ERROR_WRONG_CITY;

    const results = await openWeatherMapClient.getThreeHourForecastByCityName(
      cities[cityName]
    );

    if (OpenWeatherMapClient.isOpenWeatherMapClientError(results))
      throw parseOpenWeatherMapClientError(results);

    const response: FiveDaysForecastResponse = {};

    for (const threeHoursTimeslot of results.list) {
      response[threeHoursTimeslot.dt_txt] = {
        temp: threeHoursTimeslot.main.temp,
        pressure: threeHoursTimeslot.main.pressure,
        humidity: threeHoursTimeslot.main.humidity,
      };
    }
    return response;
  }
}
