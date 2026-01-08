jest.mock('@scalar/express-api-reference', () => ({
    apiReference: () => (req, res, next) => next(),
}));

jest.setTimeout(30000); // Increase timeout for slower environments
