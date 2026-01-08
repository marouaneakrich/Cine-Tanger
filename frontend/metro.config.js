const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for SVG files
config.resolver.assetExts.push(
  // Added for lottie files
  'json'
);

module.exports = config;
