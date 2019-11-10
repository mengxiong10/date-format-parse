const modules = process.env.MODULE_TYPE || false;

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        modules,
      },
    ],
    '@babel/preset-typescript',
  ],
  plugins: ['add-module-exports'],
};
