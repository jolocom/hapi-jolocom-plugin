import { Plugin, Server, Request, ResponseToolkit } from "@hapi/hapi";
import * as WebSocket from "ws";
import { JolocomSDK } from "@jolocom/sdk";
import { SDKOptions } from "./types";

export { SDKOptions };

export const sdkPlugin: Plugin<SDKOptions> = {
  name: "hapiJolocomSDK",
  version: "0.1.0",
  requirements: {
    node: "10",
  },
  register: async (server: Server, options: SDKOptions) => {
    // TODO
    const sdk = new JolocomSDK(options.identityData!);
    await sdk.init();

    if (options.verifierOptions)
      options.verifierOptions.map((opts) => {
        const path = `/${opts.name || opts.requirements[0].type[0]}/`;
        server.route({
          method: "GET",
          path,
          handler: verificationRequestHandler,
          options: {
            bind: {
              identity: sdk,
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
              identity: sdk,
              requirements: opts.requirements,
            },
          },
        });
      });

    if (options.issuerOptions)
      options.issuerOptions.map((opts) => {
        const path = `/${opts.name || opts.offers[0].type[1]}`;
        server.route({
          method: "GET",
          path,
          handler: offerRequestHandler,
          options: {
            bind: {
              identity: sdk,
              offers: opts.offers,
            },
          },
        });
        server.route({
          method: "POST",
          path,
          handler: offerResponseHandler,
          options: {
            bind: {
              identity: sdk,
              offers: opts.offers,
            },
          },
        });
      });

    if (options.encrypterOptions)
      options.encrypterOptions.map((opts) => {
        const path = `ws//{opts.name}`;
        const wss = new WebSocket.Server({ server: server.listener });
        wss.on("connection", (ws) => {
          ws.on("message", (message) => {
            console.log(`received: ${message}`);
          });
          identity
            .rpcEncRequest({
              toEncrypt: "hello",
              callbackURL: "path",
            })
            .then((t) => {
              console.log(`sending req: ${t}`);
              ws.send(t);
            });
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

  const res = await h.context.identity.tokenReceived(p.token);
  // TODO POST cred info to integration endpoint
  return res;
}

async function offerRequestHandler(request: Request, h: ResponseToolkit) {
  const callbackUrl = request.url.href;
  return await h.context.identiy.credOfferToken({
    callbackUrl,
    offeredCredentials: h.context.offers,
  });
}

async function offerResponseHandler(request: Request, h: ResponseToolkit) {
  const p = request.payload as { token: string };
  if (!p.token) return false;

  const res = await h.context.identity.tokenReceived(p.token);
  if (res)
    return h.context.identity.credIssuanceToken(
      {
        signedCredentials: h.context.creds,
      },
      p.token
    );

  return false;
}
