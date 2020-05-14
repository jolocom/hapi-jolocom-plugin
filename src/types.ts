import {
  JolocomSDK,
  CredentialRequirements,
  CredentialOffer,
  CredentialDefinition,
  IJolocomSDKConfig,
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

export type EncryptionOptions = {
  name: string;
  toEnc: string;
};

export type SDKOptions = {
  identityData?: IJolocomSDKConfig;
  verifierOptions?: VerifierOptions[];
  issuerOptions?: IssuerOptions[];
  encrypterOptions?: EncryptionOptions[];
  prefix?: string;
};

export type SDKContext = {
  identity: JolocomSDK;
};
