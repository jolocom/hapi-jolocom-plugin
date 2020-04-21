import { Plugin, Server, Request, ResponseToolkit, Lifecycle } from "hapi";
import { JolocomSDK } from "jolocom-sdk";
import { SDKOptions, VerifierOptions } from "./types";

export const sdkPlugin: Plugin<SDKOptions> = {
  name: "hapiJolocomSDK",
  version: "0.1.0",
  requirements: {
    node: "10",
  },
  register: async (server: Server, options: SDKOptions) => {
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
