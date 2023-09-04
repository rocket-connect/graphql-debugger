import { start } from './index';
import { COLLECTOR_PORT, BACKEND_PORT } from './config';

start({
  backendPort: BACKEND_PORT,
  collectorPort: COLLECTOR_PORT,
});
