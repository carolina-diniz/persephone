import { resolveMx } from 'dns/promises';
import { ShoppService } from '../shopp';

export const ValidateEmailService = {
  isValidEmail: async (email: string): Promise<boolean> => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const userPartRegex = /^[a-zA-Z0-9._%+-]{1,64}$/;

    if (!emailRegex.test(email) || !userPartRegex.test(email.split('@')[0])) {
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
    const domain = email.split('@')[1];

    return validDomains.includes(domain);
  },
  isNameValid: (name: string): boolean => {
    const nameRegex = /^[a-zA-ZÀ-ÖØ-öø-ÿ'´`^~ ]{1,64}$/;
    return nameRegex.test(name);
  },
};
