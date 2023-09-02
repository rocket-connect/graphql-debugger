import { Debug, type Debugger } from '@graphql-debugger/utils';

const debugNamespace = 'cli';

export const debug: Debugger = Debug(debugNamespace);
