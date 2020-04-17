import * as hapi from "hapi";
import { sdkPlugin } from "./sdk";

export const init = async () => {
  const server = new hapi.Server({
    host: "localhost",
    port: process.env.PUBLIC_PORT || 8000,
  });

  await server.register({
    plugin: sdkPlugin,
    options: {
      mnemonic:
        "remain cook bonus salad stand tenant shove outdoor scheme cigar tape where",
      verifierOptions: [
        {
          name: "my_route",
          requirements: [
            {
              type: ["email"],
              constraints: [],
            },
          ],
          onValid: async (token: string) => console.log(token),
        },
      ],
    },
  });

  await server.start();
};
