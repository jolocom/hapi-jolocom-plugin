import * as hapi from "hapi";
import { JolocomSDK } from "jolocom-sdk";

export type VerifierOptions = {
  requirements: {};
};

export const verifierPlugin: hapi.Plugin<VerifierOptions> = {
  name: "jolocom-verifier-plugin",
  version: "0.1.0",
  requirements: {
    node: "10",
  },
  dependencies: "hapiJolocomSDK",
  register: async (server, options) => {
    server.route({
      method: "GET",
      path: "henlo",
      handler: async () =>
        // @ts-ignore
        await server.plugins.hapiJolocomSDK.sdk
          .credRequestToken(options.requirements)
          .then((t) => t.encode()),
    });
  },
};
