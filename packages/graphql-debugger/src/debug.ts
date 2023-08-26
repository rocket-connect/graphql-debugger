import Debug from 'debug';

const name = 'graphql-debugger';
process.env.DEBUG = process.env.DEBUG || name;

export const debug = Debug(name);
