import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import {
  axiosErrorResponse,
  bolognaFiveDaysForecastAxiosResponseSample,
  bolognaTodayForecastAxiosResponseSample,
} from "./resources/outputs";
import proxyquire from "proxyquire";
import sinon from "sinon";
import ForecastController from "../src/controllers/ForecastController";

const axiosStub = sinon.stub();
const mockedOpenWeatherMapClient = proxyquire(
  "../src/lib/OpenWeatherMapClient",
  {
    axios: {
      get: axiosStub,
    },
  }
);
const mockedForecastController = proxyquire(
  "../src/controllers/ForecastController.ts",
  {
    "../lib/OpenWeatherMapClient": mockedOpenWeatherMapClient,
  }
);
const mockedRouter = proxyquire("../src/routes/forecast.ts", {
  "../controllers/ForecastController": mockedForecastController,
});

const mockedApp = proxyquire("../src/index.ts", {
  "./routes/forecast.ts": mockedRouter,
});

chai.use(chaiHttp);

describe("CurrentForecast call", () => {
  beforeEach(() => {
    axiosStub.reset();
  });
  it("should correctly respond for an available city", (done) => {
    axiosStub.resolves({ data: bolognaTodayForecastAxiosResponseSample });
    chai
      .request(mockedApp)
      .get("/forecast/today/Bologna")
      .end((err, response) => {
        if (err) done(err);
        expect(response).to.have.status(200);
        expect(response).to.have.header("Content-Type", /json/);
        expect(response.body.coord.lon).equal(
          bolognaTodayForecastAxiosResponseSample.coord.lon
        );
        expect(response.body.coord.lat).equal(
          bolognaTodayForecastAxiosResponseSample.coord.lat
        );
        done();
      });
  });

  it("should respond with a list of available cities if called with an unavailable one", (done) => {
    axiosStub.resolves({ data: bolognaTodayForecastAxiosResponseSample });
    chai
      .request(mockedApp)
      .get("/forecast/today/Faenza")
      .end((err, response) => {
        if (err) done(err);
        expect(response).to.have.status(400);
        expect(response.error.text).equal(
          ForecastController.ERROR_WRONG_CITY.message
        );
        done();
      });
  });

  it("should manage an axios error", (done) => {
    axiosStub.rejects(axiosErrorResponse);
    chai
      .request(mockedApp)
      .get("/forecast/today/Bologna")
      .end((err, response) => {
        if (err) done(err);
        expect(response).to.have.status(axiosErrorResponse.status);
        expect(response.error.text).equal(axiosErrorResponse.message);
        done();
      });
  });
});

describe("FiveDaysForecast call", () => {
  beforeEach(() => {
    axiosStub.reset();
  });
  it("should correctly respond for an available city", (done) => {
    axiosStub.resolves({ data: bolognaFiveDaysForecastAxiosResponseSample });
    chai
      .request(mockedApp)
      .get("/forecast/five-days/Bologna")
      .end((err, response) => {
        if (err) done(err);
        expect(response).to.have.status(200);
        expect(response).to.have.header("Content-Type", /json/);
        expect(Object.keys(response.body).length).equal(40);
        for (let timeslot in response.body) {
          expect(response.body[timeslot].humidity).not.to.be.undefined;
          expect(response.body[timeslot].pressure).not.to.be.undefined;
          expect(response.body[timeslot].temp).not.to.be.undefined;
        }
        done();
      });
  });

  it("should respond with a list of available cities if called with an unavailable one", (done) => {
    axiosStub.resolves({ data: bolognaFiveDaysForecastAxiosResponseSample });
    chai
      .request(mockedApp)
      .get("/forecast/five-days/Faenza")
      .end((err, response) => {
        if (err) done(err);
        expect(response).to.have.status(400);
        expect(response.error.text).equal(
          ForecastController.ERROR_WRONG_CITY.message
        );
        done();
      });
  });

  it("should manage an axios error", (done) => {
    axiosStub.rejects(axiosErrorResponse);
    chai
      .request(mockedApp)
      .get("/forecast/five-days/Bologna")
      .end((err, response) => {
        if (err) done(err);
        expect(response).to.have.status(axiosErrorResponse.status);
        expect(response.error.text).deep.equal(axiosErrorResponse.message);
        done();
      });
  });
});

describe("GroupedForecast call", () => {
  beforeEach(() => {
    axiosStub.reset();
  });
  it("should correctly respond for an available city", (done) => {
    axiosStub.resolves({ data: bolognaTodayForecastAxiosResponseSample });
    chai
      .request(mockedApp)
      .get("/forecast/grouped")
      .end((err, response) => {
        if (err) done(err);
        expect(response).to.have.header("Content-Type", /json/);
        expect(response.body.highestHumidity).not.to.be.undefined;
        expect(response.body.highestHumidity.cityName).not.to.be.undefined;
        expect(response.body.highestHumidity.value).not.to.be.undefined;
        expect(response.body.highestTemperature).not.to.be.undefined;
        expect(response.body.highestTemperature.cityName).not.to.be.undefined;
        expect(response.body.highestTemperature.value).not.to.be.undefined;
        expect(response.body.meanTemp).not.to.be.undefined;
        done();
      });
  });

  it("should manage an axios error", (done) => {
    axiosStub.rejects(axiosErrorResponse);
    chai
      .request(mockedApp)
      .get("/forecast/five-days/Bologna")
      .end((err, response) => {
        if (err) done(err);
        expect(response).to.have.status(axiosErrorResponse.status);
        expect(response.error.text).deep.equal(axiosErrorResponse.message);
        done();
      });
  });
});
