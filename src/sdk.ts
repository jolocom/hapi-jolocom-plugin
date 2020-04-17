import { Plugin, Server } from "hapi";
import { JolocomSDK } from "jolocom-sdk";
import { SDKOptions } from "./types";

export const sdkPlugin: Plugin<SDKOptions> = {
  name: "hapiJolocomSDK",
  version: "0.1.0",
  requirements: {
    node: "10",
  },
    const sdk = await JolocomSDK.fromMnemonic(options.mnemonic);
    server.expose("sdk", sdk);
  register: async (server: Server, options) => {
  },
};
