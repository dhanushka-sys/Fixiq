import { createApp } from './app.js';
import { env } from './config/env.js';

const app = createApp();

app.listen(env.PORT, () => {
  console.log(`[Fixiq API] Server running on http://localhost:${env.PORT} in ${env.NODE_ENV} mode`);
});
