import * as hapi from "hapi";
import { sdkPlugin } from "./sdk";
import { SDKOptions } from "./types";
import config from "../config.example.json";

export const init = async () => {
  const server = new hapi.Server({
    host: "localhost",
    port: process.env.PUBLIC_PORT || 8000,
  });

  await server.register({
    plugin: sdkPlugin,
    options: (config as unknown) as SDKOptions,
  });

  await server.start();
};

init();
