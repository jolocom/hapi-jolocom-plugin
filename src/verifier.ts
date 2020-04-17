import { Plugin } from "hapi";
import { VerifierOptions } from "./types";

export const verifierPlugin: Plugin<VerifierOptions> = {
  name: "jolocom-verifier-plugin",
  version: "0.1.0",
  requirements: {
    node: "10",
  },
  dependencies: "hapiJolocomSDK",
  register: async (server, options) => {
    const path = `/${options.name || options.requirements[0].type[1]}/`;

    server.route({
      method: "GET",
      path,
      handler: async (request, h) => {
        const callbackURL = request.url;
        console.log(callbackURL);
        return await h.context.identity.credRequestToken({
          callbackURL,
          credentialRequirements: options.requirements,
        });
      },
    });

    server.route({
      method: "POST",
      path,
      handler: async (request, h) => {
        // @ts-ignore
        const token = request.payload.token;
        console.log(token);
        const res = h.context.identity.tokenReceived(token);

        if (res) options.onValid(token);
      },
    });
  },
};
