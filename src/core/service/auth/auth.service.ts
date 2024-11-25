const authCache = new Map();

type Auth = { code: string; messageId: string };

export const Auth = {
  set: (key: string, value: Auth): void => {
    authCache.set(key, value);
  },
  get: (key: string): Auth => {
    return authCache.get(key);
  },
  verifyCode: (key: string, code: string): boolean => {
    const value = authCache.get(key);
    return value.code === code;
  },
  delete: (key: string): Auth => {
    const value = authCache.get(key);
    authCache.delete(key);
    return value;
  },
  updateMessageId: (key: string, messageId: string): Auth => {
    const value = authCache.get(key);
    value.messageId = messageId;
    authCache.set(key, value);
    return value;
  },
};
