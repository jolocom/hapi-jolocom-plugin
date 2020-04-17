import { Plugin, Server } from "hapi";
import { JolocomSDK } from "jolocom-sdk";
import { SDKOptions } from "./types";
import { verifierPlugin } from "./verifier";

export const sdkPlugin: Plugin<SDKOptions> = {
  name: "hapiJolocomSDK",
  version: "0.1.0",
  requirements: {
    node: "10",
  },
  register: async (server: Server, options) => {
    const identity = await JolocomSDK.fromMnemonic(options.mnemonic);

    const bind = {
      identity,
    };
    // const prefix = options.prefix;

    server.bind(bind);

    options.verifierOptions.map(
      async (verificationOptions) =>
        await server.register({
          plugin: verifierPlugin,
          options: verificationOptions,
        })
    );
  },
};
