import { resolveMx } from 'dns/promises';
import { ShoppService } from '../shopp';

export const ValidateEmailService = {
  isValidEmail: async (email: string): Promise<boolean> => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return false;
    }

    const domain = email.split('@')[1];

    try {
      const mxRecords = await resolveMx(domain);
      return mxRecords.length > 0;
    } catch (error) {
      return false;
    }
  },
  isValidGloboDomain: async (email: string) => {
    if (!(await ValidateEmailService.isValidEmail(email))) {
      return false;
    }

    const validDomains = ShoppService.globoDomains;
    const domain = email.split('@')[1].toLowerCase();

    return validDomains.includes(domain);
  },
};
