import { Debug, type Debugger } from '@graphql-debugger/utils';

const debugNamespace = 'collector-proxy';

export const debug: Debugger = Debug(debugNamespace);
