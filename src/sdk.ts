import * as hapi from "hapi";
import { JolocomSDK } from "jolocom-sdk";
import { SDKOptions } from "./types";


export const sdkPlugin: hapi.Plugin<SDKOptions> = {
  name: "hapiJolocomSDK",
  version: "0.1.0",
  requirements: {
    node: "10",
  },
  register: async (server: hapi.Server, options) => {
    const sdk = await JolocomSDK.fromMnemonic(options.mnemonic);
    server.expose("sdk", sdk);
  },
};
