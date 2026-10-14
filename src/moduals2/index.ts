/**
 * Moduals2 Master Entry Point
 * Repository: https://github.com/mehdi-fakhraei60/moduals2
 * All adapters, business logic, APIs, and gateways connected here.
 */

export * from './config';
export * from './kavenegar/kavenegarAdapter';
export * from './neshan/neshanAdapter';
export * from './payment/paymentGatewayAdapter';
export * from './camera/cameraArAdapter';
export * from './updater/updaterAdapter';
export * from './call/maskedCallAdapter';
export * from './notifications/pushNotificationAdapter';
export * from './legal/termsAndConditions';
export * from './realtime/courierStreamer';
export * from './promo/promoAdapter';
export * from './chat/inAppChatAdapter';
export * from './sms/smsTemplates';
export * from './audio/soundEffects';
export * from './dispatch/dispatchScheduler';
export * from './dispatch/captainDispatchBridge';
export * from './pod/proofOfDelivery';
export * from './security/fraudDetector';
export * from './support/supportChatAdapter';

// New Enterprise & Logistics Ecosystem Modules
export * from './b2b/bulkDispatchAdapter';
export * from './tracking/liveWebTrackingAdapter';
export * from './cod/cashOnDeliveryAdapter';
export * from './freight/freightFleetAdapter';
export * from './addressbook/addressBookAdapter';
export * from './invoicing/corporateInvoiceAdapter';
