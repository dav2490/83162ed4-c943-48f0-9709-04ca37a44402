const environment = process.env.NODE_ENV;

function isProduction() {
  return environment === "production";
}

const generalRules = {
  "prettier/prettier": ["error", { endOfLine: "auto" }],
  "no-restricted-imports": [
    "error",
    {
      name: "aws-sdk",
      message: "Please import from aws-sdk subpath",
    },
  ],
  "no-console": isProduction() ? "warn" : "warn",
  "no-debugger": isProduction() ? "error" : "warn",
  "no-extra-parens": [
    "off",
    "all",
    {
      conditionalAssign: true,
      nestedBinaryExpressions: false,
      returnAssign: false,
      ignoreJSX: "all", // delegate to eslint-plugin-react
      enforceForArrowConditionals: false,
    },
  ],
  "no-shadow": [
    "error",
    { builtinGlobals: false, hoist: "functions", allow: [] },
  ],
  "eol-last": "off",
  "padding-line-between-statements": [
    "warn",
    {
      blankLine: "always",
      prev: ["const", "let", "var"],
      next: "*",
    },
    {
      blankLine: "any",
      prev: ["const", "let", "var"],
      next: ["const", "let", "var"],
    },
  ],
  "no-return-await": "warn",
  // "new-cap": "error", // Conflict with class-transformer
  "no-duplicate-imports": [
    "error",
    {
      includeExports: true,
    },
  ],
  "no-return-assign": ["error", "except-parens"],
  "no-undef-init": "warn",
  "no-new-object": "error",
  "no-array-constructor": "error",
  "no-new-wrappers": "error",
  "object-shorthand": "warn",
  "max-statements": [
    "warn",
    54,
    {
      ignoreTopLevelFunctions: true,
    },
  ],
  "spaced-comment": "error",
  "prefer-const": [
    "error",
    {
      destructuring: "any",
      ignoreReadBeforeAssign: false,
    },
  ],
  "no-async-promise-executor": "error",
  "no-var": "error",
  "no-unused-vars": ["warn", { args: "after-used" }],
  "no-undef": "error",
  "require-await": "warn",
  "no-warning-comments": "warn",
  "promise/param-names": "warn",
  "promise/catch-or-return": "error",
  "no-case-declarations": "error",
  "no-prototype-builtins": "error",
  "no-useless-catch": "error",
  "no-empty": "error",
  "no-useless-escape": "error",
  "no-unsafe-optional-chaining": "warn",
};

const tsRules = {
  ...generalRules,
  "@typescript-eslint/ban-ts-comment": "off",
  // All the @typescript-eslint/* rules here...
  "@typescript-eslint/no-var-requires": "warn",
  "@typescript-eslint/no-unnecessary-type-arguments": "error",
  "no-shadow": "off", // replaced by ts-eslint rule below
  "@typescript-eslint/no-shadow": "warn",
  "require-await": "off", // replaced by ts-eslint rule below
  "@typescript-eslint/require-await": "warn",
  "no-unused-vars": "off",
  "@typescript-eslint/await-thenable": "error",
  "@typescript-eslint/prefer-optional-chain": "error",
  "@typescript-eslint/no-floating-promises": "error",
  "no-async-promise-executor": "error",
  "@typescript-eslint/no-misused-promises": [
    "error",
    {
      checksVoidReturn: false,
    },
  ],
  "@typescript-eslint/unbound-method": ["error", { ignoreStatic: true }],
  "@typescript-eslint/no-empty-function": "warn",
  "@typescript-eslint/no-unnecessary-type-assertion": "error",
  "promise/always-return": "warn", // TODO: to evaluate to increase the level
  "@typescript-eslint/restrict-plus-operands": "warn", // TODO: to evaluate to increase the level
  "@typescript-eslint/ban-types": "warn", // TODO: to evaluate to increase the level
  "@typescript-eslint/no-for-in-array": "warn", // TODO: to evaluate to increase the level
  "@typescript-eslint/restrict-template-expressions": "off", // TODO: temporarily disabled
  "@typescript-eslint/no-unsafe-call": "off", // TODO: temporarily disabled
  "@typescript-eslint/no-unsafe-return": "off", // TODO: temporarily disabled
  "@typescript-eslint/no-unsafe-assignment": "off", // TODO: temporarily disabled
  "@typescript-eslint/no-unsafe-member-access": "off", // TODO: temporarily disabled
  "@typescript-eslint/no-explicit-any": "off", // TODO: temporarily disabled
  "@typescript-eslint/no-unsafe-argument": "off", // TODO: temporarily disabled
  "@typescript-eslint/no-unused-vars": "off", // TODO: temporarily disabled
};

module.exports = {
  env: {
    jest: true,
    commonjs: true,
    es2020: true,
    node: true,
  },
  ignorePatterns: [
    "node_modules",
    "**/node_modules",
    "dist",
    "**/dist",
    "node_modules_prod",
    "**/node_modules_prod",
    ".serverless",
    "**/.serverless",
    ".idea",
    "**/.idea",
    "test",
    "**/test",
    "debug",
    "**/debug",
  ],
  extends: ["eslint:recommended", "prettier", "plugin:prettier/recommended"],
  parserOptions: {
    ecmaVersion: 11, // Allows for the parsing of modern ECMAScript features
    sourceType: "module", // Allows for the use of imports
  },
  rules: { ...generalRules },
  overrides: [
    {
      parserOptions: {
        project: ["./tsconfig.eslint.json"],
        tsconfigRootDir: __dirname,
      },
      files: ["./**/*.{ts,tsx}"],
      parser: "@typescript-eslint/parser",
      plugins: ["@typescript-eslint"],
      extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "plugin:promise/recommended",
        "prettier", // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
        "plugin:prettier/recommended", // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
      ],
      rules: {
        ...tsRules,
      },
    },
  ],
};
