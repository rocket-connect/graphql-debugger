import { Debug, type Debugger, debugRootNamespace } from '@graphql-debugger/utils';

const debugNamespace = 'cli';

export const debug: Debugger = Debug(debugNamespace);

export { debugRootNamespace };
