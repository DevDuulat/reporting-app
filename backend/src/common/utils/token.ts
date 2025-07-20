import * as crypto from 'crypto';

export function generateAccessToken(): string {
  return crypto.randomBytes(16).toString('hex');
}
