import dotenv from "dotenv";

dotenv.config();

const required = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

const optional = (key: string, fallback: string): string => {
  return process.env[key] ?? fallback;
};

const toNumber = (value: string, fallback: number): number => {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? fallback : parsed;
};

const clientOrigins = optional("CLIENT_URL", "http://localhost:5173")
  .split(",")
  .map((url) => url.trim())
  .filter(Boolean);

export const env = {
  NODE_ENV: optional("NODE_ENV", "development"),
  PORT: toNumber(optional("PORT", "5000"), 5000),
  DATABASE_URL: required("DATABASE_URL"),
  JWT_SECRET: required("JWT_SECRET"),
  REFRESH_SECRET: required("REFRESH_SECRET"),
  CLIENT_ORIGINS: clientOrigins,
};
