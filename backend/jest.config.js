module.exports = {
    testEnvironment: 'node',
    setupFilesAfterEnv: ['./tests/jest.setup.js'],
    verbose: true,
    // Ignore scalar lib transforming
    transformIgnorePatterns: [
        "node_modules/(?!@scalar)"
    ]
};
