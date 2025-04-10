export const appConfig = {
  wordLength: 5,
  maxAttempts: 6,
  tokenSecret: 'your-secret-key', // TODO: Move to .env file
  jwtSecret: 'your-jwt-secret',
  alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
  words: ['apple', 'berry', 'lemon', 'grape', 'mango', 'melon', 'peach'],
};
