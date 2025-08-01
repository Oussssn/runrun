const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname);

// Minimize file watching
config.watchFolders = [];
config.resolver.sourceExts = ['js', 'jsx', 'ts', 'tsx'];
config.resolver.assetExts = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'];

// Reduce file watching
config.watcher = {
  healthCheck: {
    enabled: false,
  },
  additionalExts: [],
};

module.exports = config;
