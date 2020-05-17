import {
  JolocomSDK,
  CredentialRequirements,
  CredentialOffer,
  CredentialDefinition,
} from '@jolocom/sdk';

export type VerifierOptions = {
  name?: string;
  requirements: CredentialRequirements[];
  integration: string;
};

export type IssuerOptions = {
  name?: string;
  offers: CredentialOffer[];
  creds: CredentialDefinition[];
};

export type PluginOptions = {
  sdk: JolocomSDK,
  verifierConfig?: VerifierOptions[];
  issuerConfig?: IssuerOptions[];
};