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

    // const prefix = options.prefix;

    if (options.verifierOptions)
      options.verifierOptions.map((opts) => {
        const path = `/${opts.name || opts.requirements[0].type[0]}/`;
        server.route({
          method: "GET",
          path,
          handler: verificationRequestHandler,
          options: {
            bind: {
              identity,
              requirements: opts.requirements,
            },
          },
        });
        server.route({
          method: "POST",
          path,
          handler: verificationResponseHandler,
          options: {
            bind: {
              identity,
              requirements: opts.requirements,
            },
          },
        });
      });
  },
};

async function verificationRequestHandler(
  request: Request,
  h: ResponseToolkit
) {
  const callbackUrl = request.url.href;
  return await h.context.identity.credRequestToken({
    callbackUrl,
    credentialRequirements: h.context.requirements,
  });
}

async function verificationResponseHandler(
  request: Request,
  h: ResponseToolkit
) {
  const p = request.payload as { token: string };
  if (!p.token) return false;

  const token: string = p.token;
  const res = await h.context.identity.tokenReceived(token);
  return res;
}
