import * as dotenv from 'dotenv';
dotenv.config();

export const HTTP_PORT = process.env.HTTP_PORT || 16686;

export const NODE_ENV = process.env.NODE_ENV;

export const STATIC_FOLDER = '../../ui/build';
