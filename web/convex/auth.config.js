
export default {
    providers: [
        {
            type: "customJwt",
            issuer: `https://${process.env.AUTH_KIT_API_HOSTNAME}`,
            jwks: `${process.env.AUTH_KIT_DOMAIN}/oauth2/jwks`,
            algorithm: "RS256",
        }
    ],
};
