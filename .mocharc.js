process.env.OPEN_WEATHER_API_KEY = "da8a7ea7017bf6ca8b2097ed61d77f5b";
process.env.PORT = "9999";

module.exports = {
  extension: ["ts"],
  spec: ["test/**/*.spec.ts"],
  require: "ts-node/register"
};
