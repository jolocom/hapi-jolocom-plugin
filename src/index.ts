import { Plugin, Server, Request, ResponseToolkit } from '@hapi/hapi';
import { PluginOptions } from "./types";
import { JolocomSDK } from '@jolocom/sdk';
export { PluginOptions };

export const issueAndVerifiyPlugin: Plugin<PluginOptions> = {
  name: "hapiVerifierAndIssuer",
  version: "0.1.0",
  requirements: {
    node: "10",
  },
  register: async (server: Server, { sdk, verifierConfig, issuerConfig }: PluginOptions) => {
    // TODO
    if (verifierConfig) {
      debug(`${verifierConfig.length} verifier configuration sections found`)

      console.log(server.route)
      verifierConfig.map(({name, requirements}) => {
        const path = `/${name}/${requirements[0].type[0]}/`;
        debug(`verifier, registering route: ${path}, GET and POST`)

        server.route({
          method: "GET",
          path,
          handler: verificationRequestHandler,
          options: {
            bind: { sdk, requirements },
          },
        });

        server.route({
          method: "POST",
          path,
          handler: verificationResponseHandler,
          options: {
            bind: { sdk, requirements, },
          },
        });
      });
    }

    if (issuerConfig) {
      debug(`${issuerConfig.length} issuer configuration sections found`)

      issuerConfig.map(({name, offers}) => {
        const path = `/${name || offers[0].type[1]}`;
        debug(`issuer, registering route: ${path}, GET and POST`)

        server.route({
          method: "GET",
          path,
          handler: offerRequestHandler,
          options: {
            bind: {
              identity: sdk,
              offers: offers,
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
              offers: offers,
            },
          },
        });
      });
    }
  },
};
const authRequestToken = async (sdk: JolocomSDK, callbackURL: string) => {
  return sdk.idw.create.interactionTokens.request.auth({
    callbackURL
  }, await sdk.bemw.keyChainLib.getPassword())
}

async function verificationRequestHandler(
  request: Request,
  h: ResponseToolkit
) {
  const sdk: JolocomSDK = h.context.sdk

  return sdk.({
    callbackURL: request.url.href, // TODO Investigate, attack possible?
    credentialRequirements: h.context.requirements,
  })
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


const debug = (message: any) => process.env.DEBUG && console.log(message)