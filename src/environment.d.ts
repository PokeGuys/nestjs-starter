import { AppEnvironment, Language } from '@common/enum';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      DEBUG?: 'true' | 'false';

      APP_ENV: AppEnvironment;
      APP_NAME: string;
      APP_PREFIX?: string;
      APP_HOST: string;

      FALLBACK_LANGUAGE?: Language;

      DB_HOST: string;
      DB_PORT?: string;
      DB_USERNAME: string;
      DB_PASSWORD: string;
      DB_DATABASE: string;

      REDIS_HOST: string;
      REDIS_PORT?: string;
      REDIS_PASSWORD?: string;
      REDIS_DATABASE?: string;

      MONGODB_URI: string;

      AWS_S3_ACCESS_KEY_ID: string;
      AWS_S3_SECRET_ACCESS_KEY: string;
      AWS_S3_REGION: string;
      AWS_S3_DEFAULT_BUCKET: string;
      AWS_S3_PUBLIC_URL: string;

      SENDGRID_API_KEY: string;
      SENDGRID_SENDER_NAME: string;
      SENDGRID_SENDER_EMAIL: string;
    }
  }
}

export {};
