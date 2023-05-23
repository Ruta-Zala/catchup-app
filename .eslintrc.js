const mode = process.env.NODE_ENV

const allowedToReassignParams = [
  'Vue', // adding plugins & instance methods
  'result', // Array.prototype.reduce accumulator value
  'acc', // Array.prototype.reduce accumulator value
  'state', // Vuex mutations
]

module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
  extends: [
    '@vue/airbnb',
    'plugin:vue/essential',
    'plugin:vue/recommended',
    'plugin:vue/strongly-recommended',
    '@vue/typescript/recommended',
    '@vue/prettier',
    '@vue/prettier/@typescript-eslint',
    'prettier',
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: false,
    },
  },
  plugins: ['import', 'prettier', 'vue'],
  rules: {
    '@typescript-eslint/explicit-module-boundary-types': 'off', // this rule forces having boilerplate code, which is not so needed on frontend
    '@typescript-eslint/member-delimiter-style': 'off',
    '@typescript-eslint/no-shadow': ['error'],
    '@typescript-eslint/no-unused-vars': ['error', { args: 'after-used', argsIgnorePattern: '^_' }],

    'array-bracket-spacing': ['error', 'never'],
    'arrow-parens': ['error', 'always'],
    'class-methods-use-this': 'off', // because of empty emit methods :(
    'comma-dangle': [
      'error',
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'always-multiline',
      },
    ],
    complexity: ['error', { max: 20 }], // to be tested though
    curly: 'error',
    'eol-last': ['error', 'always'],
    'import/newline-after-import': ['error', { count: 1 }],
    'import/order': [
      'error',
      {
        alphabetize: {
          order: 'asc',
        },
        'newlines-between': 'always',
        groups: ['builtin', 'external', 'internal', 'parent', 'index'],
        pathGroups: [
          {
            pattern: '@/**',
            group: 'internal',
          },
          {
            pattern: '../**',
            group: 'parent',
          },
          {
            pattern: './**',
            group: 'index',
          },
        ],
      },
    ],

    /**
     * * Used instead of typescipt-eslint/indent rule
     * see https://github.com/typescript-eslint/typescript-eslint/issues/1824
     */
    // indent: ['error', 2, { SwitchCase: 1 }],

    'linebreak-style': ['error', 'unix'],
    'max-len': ['error', { code: 100, comments: 100, ignoreTrailingComments: true }],
    'max-params': ['error', 4], // MIND YOU: if you need more than 4 argument, the 4th needs to be a rest param
    'max-classes-per-file': ['error', 1],
    'max-depth': ['error', 2],
    'max-lines-per-function': [
      'error',
      { max: 50, skipComments: true, skipBlankLines: true }, // do we really need this?
    ],
    'max-nested-callbacks': ['error', 3], // just, just don't... will you?
    'newline-after-var': ['error', 'always'],
    'newline-before-return': ['error'],
    'no-alert': 'error', // What year is it, again ?
    'no-console': mode === 'production' ? 'error' : 'warn',
    'no-debugger': mode === 'production' ? 'error' : 'warn',
    'no-fallthrough': 'error', // use the break; please?
    'no-multiple-empty-lines': ['error', { max: 1 }],
    'no-param-reassign': [
      'error',
      {
        props: true,
        ignorePropertyModificationsFor: allowedToReassignParams,
      },
    ],
    'no-shadow': 'off',
    'prefer-destructuring': 'error',
    semi: ['error', 'never'], // kinda sad
    'vue/attribute-hyphenation': ['error', 'always'],
    'vue/html-closing-bracket-newline': ['error', { singleline: 'never', multiline: 'always' }],
    'vue/padding-line-between-blocks': ['error', 'always'],
  },
  overrides: [
    {
      files: ['**/__tests__/*.{j,t}s?(x)', '**/tests/unit/**/*.spec.{j,t}s?(x)'],
      env: {
        mocha: true,
      },
    },
  ],
}
