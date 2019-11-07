const path = require('path');

module.exports = {
  env: {
    browser: true,
    es6: true,
    jest: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2018,
    ecmaFeatures: {
      jsx: true,
    },
    project: './tsconfig.json',
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.ts'],
      },
    },
    'import/extensions': ['.js', '.ts'],
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'prettier/@typescript-eslint',
  ],
  rules: {
    // 对象声明都必须用解构: 关闭
    'prefer-destructuring': 0,
    // 禁止for of: 关闭
    'no-restricted-syntax': 0,
    // 禁止++ 主要是不加分号可能语法混乱, 这里都加分号直接关闭.
    'no-plusplus': 0,

    'no-restricted-globals': 0,

    'no-useless-escape': 0,

    'no-unused-expressions': [2, { allowShortCircuit: true, allowTernary: true }],

    'no-param-reassign': 0,

    // 每个函数需要明确的返回的type: 关闭
    '@typescript-eslint/explicit-function-return-type': 0,

    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-non-null-assertion': 0,
    '@typescript-eslint/no-empty-interface': 0,
    '@typescript-eslint/explicit-member-accessibility': 0,
    '@typescript-eslint/interface-name-prefix': 0,

    // 必须是package.json里面的包: 关闭
    'import/no-extraneous-dependencies': 0,
    'import/prefer-default-export': 0,
  },
};
