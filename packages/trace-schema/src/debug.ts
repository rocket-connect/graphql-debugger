import { Debug, type Debugger } from '@graphql-debugger/utils';

const debugNamespace = 'trace-schema';

export const debug: Debugger = Debug(debugNamespace);
