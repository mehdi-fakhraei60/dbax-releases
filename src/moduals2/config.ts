/**
 * Moduals2 Integration & Configuration
 * Repository: https://github.com/mehdi-fakhraei60/moduals2
 * Provides shared adapters, business logic, APIs, and gateways for Bax ecosystem.
 */

export interface Moduals2Config {
  repoUrl: string;
  apiBaseUrl: string;
  apiVersion: string;
  kavenegar: {
    templateName: string;
    senderNumber: string;
  };
  neshan: {
    serviceUrl: string;
    searchUrl: string;
    directionUrl: string;
  };
  payment: {
    gatewayName: 'shaparak_saman' | 'shaparak_sadad' | 'zarinpal';
    callbackUrl: string;
  };
}

export const MODUALS2_CONFIG: Moduals2Config = {
  repoUrl: 'https://github.com/mehdi-fakhraei60/moduals2',
  apiBaseUrl: import.meta.env.VITE_MODUALS2_API_URL || 'https://api.dbax.ir/v1',
  apiVersion: 'v1.0.0-preview5',
  kavenegar: {
    templateName: 'bax-otp-verify',
    senderNumber: '20006601',
  },
  neshan: {
    serviceUrl: 'https://api.neshan.org/v5/reverse',
    searchUrl: 'https://api.neshan.org/v1/search',
    directionUrl: 'https://api.neshan.org/v4/direction',
  },
  payment: {
    gatewayName: 'shaparak_saman',
    callbackUrl: 'bax://payment/verify',
  },
};
