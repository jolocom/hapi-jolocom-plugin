import { JolocomSDK, CredentialRequirements } from "jolocom-sdk";

export type VerifierOptions = {
  name?: string;
  requirements: CredentialRequirements[];
  integration: string;
};

export type SDKOptions = {
  mnemonic: string;
  verifierOptions?: VerifierOptions[];
  issuerOptions?: never[];
  prefix?: string;
};

export type SDKContext = {
  identity: JolocomSDK;
};
