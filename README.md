# hapi Jolocom Plugins

Hapi plugins which implement common roles for Decentralised Identity systems,
including Issuing, Recieving, Presenting and Verifying Verifiable Credentials.

## Getting Started

Currently these plugins are only supported by Node 10.

For development and testing:

```sh
git clone https://github.com/jolocom/hapi-jolocom-plugin
```

Or via NPM for integration:

```sh
npm i hapi-jolocom-plugin
```

## Examples

Configuring a Verification Server:

```typescript
import * as hapi from 'hapi';
import { sdkPlugin, verifierPlugin } from 'hapi-jolocom-plugin';

const init = async () {
    const server = new hapi.Server({
        host: 'localhost',
        port: process.env.PUBLIC_PORT || 8000,
    })

    await server.register({
        plugin: sdkPlugin,
        options: {
            mnemonic: "your 12 word BIP39 seed phrase"
        }
    })

    await server.register({
        plugin: verifierPlugin,
        options: {
            requirements: [
                {
                    type: ['email'],
                    constraints: []
                }
            ],
            onValid: async (token): Promise<any> => { await console.log("valid") }
        },
        routes: {
            prefix: "/myVerification/"
        }
    })
}
```

This example will register GET and POST routes at `/myVerification/`. GETting
will return a credential request asking for an email credential, while POST
expects a base64 encoded Credential Response token. In the event of a valid
response, the onValid callback will be called with the token.
