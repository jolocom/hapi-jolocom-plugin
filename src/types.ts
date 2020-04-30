import {
  JolocomSDK,
  CredentialRequirements,
  CredentialOffer,
  CredentialDefinition,
} from "jolocom-sdk";

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

type IdentityData = {
  mnemonic: string;
};

export type SDKOptions = {
  identityData?: IdentityData;
  verifierOptions?: VerifierOptions[];
  issuerOptions?: IssuerOptions[];
  prefix?: string;
};

export type SDKContext = {
  identity: JolocomSDK;
};
