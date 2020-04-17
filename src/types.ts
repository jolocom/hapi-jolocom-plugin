import { JolocomSDK, CredentialRequirements } from "jolocom-sdk";

export type VerifierOptions = {
  name?: string;
  requirements: CredentialRequirements[];
  onValid: (tokens: string) => Promise<any>;
};

export type SDKOptions = {
  mnemonic: string;
  verifierOptions: VerifierOptions[];
  prefix?: string;
};

export type SDKContext = {
  identity: JolocomSDK;
};
