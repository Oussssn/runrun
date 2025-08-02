const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Dosya izleme sistemini minimize et
config.watchFolders = [];
config.maxWorkers = 1;

// Cache ayarlarını optimize et
config.cacheStores = [];

module.exports = config;
