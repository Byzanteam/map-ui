module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
  },
  extends: [
    'plugin:vue/recommended',
    'airbnb-base', // introduce airbnb lint
  ],
  globals: {
    AMap: true,
    AMapUI: true,
  },
  plugins: ['vue'],
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module',
  },
  rules: {
    indent: [
      'error',
      2,
      {
        SwitchCase: 1,
        VariableDeclarator: {
          var: 2,
          let: 2,
          const: 3,
        },
      },
    ],
    'linebreak-style': [
      'error',
      'unix',
    ],
    quotes: [
      'error',
      'single',
    ],
    semi: [
      'error',
      'always',
    ],
    'no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
      },
    ],
    'comma-dangle': [
      'error',
      'always-multiline',
    ],
    'max-len': [
      'error',
      {
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true,
      },
    ],
    'no-underscore-dangle': [
      'off',
    ],
    'func-names': [
      'error',
      'as-needed',
    ],
    'no-multi-spaces': [
      'error',
      {
        exceptions: {
          VariableDeclarator: true,
        },
      },
    ],
    'one-var': [
      'off',
    ],
    'no-param-reassign': [
      'error',
      {
        props: false,
      },
    ],
    'consistent-return': [
      'off',
    ],
    'no-unused-expressions': [
      'error',
      {
        allowShortCircuit: true,
        allowTernary: true,
      },
    ],
    radix: [
      'off',
    ],
    'space-before-function-paren': [
      'error',
      'always',
    ],
    camelcase: [
      'off',
    ],
    'function-paren-newline': [
      'error',
      'consistent',
    ],

    'import/no-unresolved': [
      'off',
    ],
    'import/no-extraneous-dependencies': [
      'off',
    ],
  },
  overrides: [{
    files: ['*-test.js', '*.spec.js'],
    rules: {
      'no-unused-expressions': 'off',
      'no-undef': 'off',
    },
  }],
};
