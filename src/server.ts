import * as hapi from "hapi";

export const init = async() => {
    const server = new hapi.Server({
        host: 'localhost',
        port: process.env.PUBLIC_PORT || 8000,
    })
}
