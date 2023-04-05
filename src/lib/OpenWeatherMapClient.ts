import {
  City,
  OpenWeatherMapClientConfigLanguage,
  OpenWeatherMapClientConfigMap,
  OpenWeatherMapClientConfigMetrics,
  OpenWeatherMapClientError,
  OpenWeatherMapThreeHoursForecastReponse,
  OpenWeatherMapCurrentWeatherResponse,
} from "../models";
import axios, { AxiosError } from "axios";

export default class OpenWeatherMapClient {
  private _apikey: string;
  private _language: OpenWeatherMapClientConfigLanguage;
  private _units: OpenWeatherMapClientConfigMetrics;

  static isOpenWeatherMapClientError(
    response:
      | OpenWeatherMapCurrentWeatherResponse
      | OpenWeatherMapThreeHoursForecastReponse
      | OpenWeatherMapClientError
  ): response is OpenWeatherMapClientError {
    return (response as OpenWeatherMapClientError).status !== undefined;
  }

  constructor(config: OpenWeatherMapClientConfigMap) {
    if (!config?.apiKey) {
      throw new Error("Missing config");
    }
    this._apikey = config.apiKey;
    this._language = config.language;
    this._units = config.units;
  }

  private async retrieveDataFromOpenWeatherMapEndpoint<T>(
    url: string,
    params
  ): Promise<OpenWeatherMapClientError | T> {
    let returnedValue: T | OpenWeatherMapClientError;

    try {
      const axiosResults = await axios.get<T>(url, {
        params,
      });

      returnedValue = axiosResults.data;
    } catch (err) {
      returnedValue = {
        name: (err as AxiosError).name,
        message: (err as AxiosError).message,
        status: (err as AxiosError).status,
        stack: (err as AxiosError).stack,
      };
    }

    return returnedValue;
  }

  async getCurrentWeatherByCity(
    city: City
  ): Promise<OpenWeatherMapCurrentWeatherResponse | OpenWeatherMapClientError> {
    const params = {
      lat: city.lat,
      lon: city.lon,
      appid: this._apikey,
      language: this._language,
      units: this._units,
    };

    return this.retrieveDataFromOpenWeatherMapEndpoint<OpenWeatherMapCurrentWeatherResponse>(
      "https://api.openweathermap.org/data/2.5/weather",
      params
    );
  }

  async getThreeHourForecastByCityName(
    city: City
  ): Promise<
    OpenWeatherMapThreeHoursForecastReponse | OpenWeatherMapClientError
  > {
    const params = {
      lat: city.lat,
      lon: city.lon,
      appid: this._apikey,
      language: this._language,
      units: this._units,
    };

    return this.retrieveDataFromOpenWeatherMapEndpoint<OpenWeatherMapThreeHoursForecastReponse>(
      "https://api.openweathermap.org/data/2.5/forecast",
      params
    );
  }
}
