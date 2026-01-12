declare global {
  namespace NodeJS {
    interface ProcessEnv {
      JWT_SECRET: string;
      JWT_EXPIRES_IN: string;
      DATABASE_URL: string;
      NODE_ENV: "development" | "production" | "test";
    }
  }
}

// If this file has no imports/exports, turn it into a module
export {};
