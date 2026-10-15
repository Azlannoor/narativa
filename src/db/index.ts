import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://user:password@ep-sample.ap-southeast-1.aws.neon.tech/narativa?sslmode=require";

// In serverless / edge or Node environments, neon-http client is optimal
export const sql = neon(connectionString);
export const db = drizzle(sql, { schema });
