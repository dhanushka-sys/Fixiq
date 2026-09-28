import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load monorepo root .env first, then local directory .env
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().default('postgresql://fixiq_user:fixiq_password@localhost:5433/fixiq_dev?schema=public'),
  JWT_SECRET: z.string().default('fixiq_super_secret_jwt_key_for_development_purposes_only_32_chars'),
  JWT_EXPIRES_IN: z.string().default('15m'),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  GEMINI_API_KEY: z.string().optional(),
});

export const env = envSchema.parse(process.env);
process.env.DATABASE_URL = env.DATABASE_URL;
