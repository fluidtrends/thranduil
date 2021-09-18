import crypto from 'crypto';

export const newHash = (x: string) => crypto.createHash('sha256').update(x, 'utf8').digest('hex');
