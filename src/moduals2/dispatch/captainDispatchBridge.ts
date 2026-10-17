// Shared Real-Time Dispatch & Captain Synchronization Bridge
// Bridges customer ride/package requests with the active Captain (کاپیتان - جایگزین سفیر)

export interface CaptainProfile {
  phone: string;
  name: string;
  code: string;
  vehicle: string;
  plate: string;
  rating: number;
  commissionRate: number; // 0% in Bax
  isOnline: boolean;
  isVerified: boolean;
  statusLabelFa: string;
  avatarUrl?: string;
}

export interface ActiveTripDestination {
  id: string;
  title: string;
  address: string;
  recipientName: string;
  recipientPhone: string;
  status: 'pending' | 'in_transit' | 'delivered';
}

export interface ActiveTrip {
  id: string;
  customerName: string;
  customerPhone: string;
  pickupTitle: string;
  pickupAddress: string;
  destinations: ActiveTripDestination[];
  packageType: string;
  packageDims?: { lengthCm: number; widthCm: number; heightCm: number; weightKg: number };
  vehicleType: 'box_bike' | 'regular_bike' | 'pickup_van' | 'freight';
  vehicleTitleFa: string;
  fareAmount: number;
  deliverySecurityCode: string; // 4-digit code e.g. '4892'
  status: 'searching' | 'accepted' | 'at_pickup' | 'package_picked_up' | 'in_transit' | 'paid' | 'delivered' | 'cancelled';
  assignedCaptain?: CaptainProfile;
  isFarePaid: boolean;
  createdAt: number;
  acceptedAt?: number;
  pickedUpAt?: number;
  paidAt?: number;
  deliveredAt?: number;
  voiceNoteUrl?: string;
  voiceNoteDurationSec?: number;
  pickupPhotoUrl?: string;
  deliveryPhotoUrl?: string;
  chainedNextTrip?: {
    id: string;
    pickupDistanceMeters: number;
    pickupAddress: string;
    destAddress: string;
    fareToman: number;
  };
}

// Pre-approved Test Captain registered as per user request (09399887782)
export const PRE_APPROVED_TEST_CAPTAIN: CaptainProfile = {
  phone: '09399887782',
  name: 'کاپتان مهدی (تایید سیستمی)',
  code: 'CAP-9882',
  vehicle: 'موتورسیکلت آپاچی ۲۰۰',
  plate: 'ایران ۱۱ - ۴۸۲ ب ۹۹',
  rating: 5.0,
  commissionRate: 0,
  isOnline: true,
  isVerified: true,
  statusLabelFa: 'تایید شده و آماده دریافت سفر',
};

const STORAGE_KEY = 'bax_active_trip_state';
const CAPTAIN_STORAGE_KEY = 'bax_active_captain_state';
const BROADCAST_CHANNEL_NAME = 'bax_dispatch_sync_channel';

type Listener = (trip: ActiveTrip | null) => void;

class CaptainDispatchBridgeService {
  private listeners: Set<Listener> = new Set();
  private broadcastChannel: BroadcastChannel | null = null;
  private currentTrip: ActiveTrip | null = null;
  private currentCaptain: CaptainProfile = PRE_APPROVED_TEST_CAPTAIN;

  constructor() {
    this.loadFromStorage();

    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.broadcastChannel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
        this.broadcastChannel.onmessage = (event) => {
          if (event.data?.type === 'TRIP_UPDATED') {
            this.currentTrip = event.data.trip;
            this.notifyListeners();
          } else if (event.data?.type === 'CAPTAIN_STATUS') {
            this.currentCaptain = event.data.captain;
          }
        };
      } catch (e) {
        console.warn('BroadcastChannel not supported in this environment', e);
      }
    }

    // Listen to localStorage changes across browser tabs
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY && e.newValue) {
          try {
            this.currentTrip = JSON.parse(e.newValue);
            this.notifyListeners();
          } catch {}
        }
      });
    }
  }

  private loadFromStorage() {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.currentTrip = JSON.parse(stored);
      }
      const capStored = localStorage.getItem(CAPTAIN_STORAGE_KEY);
      if (capStored) {
        this.currentCaptain = JSON.parse(capStored);
      }
    } catch {}
  }

  private saveToStorage() {
    if (typeof window === 'undefined') return;
    try {
      if (this.currentTrip) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.currentTrip));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
      localStorage.setItem(CAPTAIN_STORAGE_KEY, JSON.stringify(this.currentCaptain));
      this.broadcastChannel?.postMessage({
        type: 'TRIP_UPDATED',
        trip: this.currentTrip,
      });
    } catch {}
    this.notifyListeners();
  }

  public getActiveTrip(): ActiveTrip | null {
    return this.currentTrip;
  }

  public getCaptain(): CaptainProfile {
    return this.currentCaptain;
  }

  public setCaptainOnline(isOnline: boolean) {
    this.currentCaptain = {
      ...this.currentCaptain,
      isOnline,
    };
    this.saveToStorage();
    this.broadcastChannel?.postMessage({
      type: 'CAPTAIN_STATUS',
      captain: this.currentCaptain,
    });
  }

  public createTripRequest(trip: Omit<ActiveTrip, 'id' | 'createdAt' | 'status' | 'isFarePaid' | 'deliverySecurityCode'>): ActiveTrip {
    const newTrip: ActiveTrip = {
      ...trip,
      id: `BX-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: Date.now(),
      status: 'searching',
      isFarePaid: false,
      deliverySecurityCode: '۴۸۹۲',
    };
    this.currentTrip = newTrip;
    this.saveToStorage();
    return newTrip;
  }

  public acceptTrip(tripId: string, captain: CaptainProfile = this.currentCaptain): boolean {
    if (!this.currentTrip || this.currentTrip.id !== tripId) return false;
    this.currentTrip = {
      ...this.currentTrip,
      status: 'accepted',
      assignedCaptain: captain,
      acceptedAt: Date.now(),
    };
    this.saveToStorage();
    return true;
  }

  public captainArrivedAtPickup(tripId: string): boolean {
    if (!this.currentTrip || this.currentTrip.id !== tripId) return false;
    this.currentTrip = {
      ...this.currentTrip,
      status: 'at_pickup',
    };
    this.saveToStorage();
    return true;
  }

  // Captain physically receives package from sender at origin
  // This triggers the customer to finalize the fare payment ("واریزی را اوکی کند")
  public confirmPackagePickedUp(tripId: string): boolean {
    if (!this.currentTrip || this.currentTrip.id !== tripId) return false;
    this.currentTrip = {
      ...this.currentTrip,
      status: 'package_picked_up',
      pickedUpAt: Date.now(),
    };
    this.saveToStorage();
    return true;
  }

  // Customer okays/authorizes the fare payment
  public confirmFarePayment(tripId: string): boolean {
    if (!this.currentTrip || this.currentTrip.id !== tripId) return false;
    this.currentTrip = {
      ...this.currentTrip,
      isFarePaid: true,
      paidAt: Date.now(),
      status: 'in_transit',
      chainedNextTrip: {
        id: `BX-NEXT-${Math.floor(1000 + Math.random() * 9000)}`,
        pickupDistanceMeters: 380,
        pickupAddress: 'تهران، تقاطع ملاصدرا و کردستان، جنب برج فناوری، پلاک ۶۴',
        destAddress: 'تهران، خیابان شریعتی، بالاتر از میرداماد، کوچه فلسفی، پلاک ۹',
        fareToman: 68000,
      },
    };
    this.saveToStorage();
    return true;
  }

  public setPickupConditionPhoto(tripId: string, photoUrl: string): boolean {
    if (!this.currentTrip || this.currentTrip.id !== tripId) return false;
    this.currentTrip = {
      ...this.currentTrip,
      pickupPhotoUrl: photoUrl,
    };
    this.saveToStorage();
    return true;
  }

  public setDeliveryConditionPhoto(tripId: string, photoUrl: string): boolean {
    if (!this.currentTrip || this.currentTrip.id !== tripId) return false;
    this.currentTrip = {
      ...this.currentTrip,
      deliveryPhotoUrl: photoUrl,
    };
    this.saveToStorage();
    return true;
  }

  public completeDelivery(tripId: string, securityCodeEntered: string): { success: boolean; errorFa?: string } {
    if (!this.currentTrip || this.currentTrip.id !== tripId) {
      return { success: false, errorFa: 'سفر یافت نشد' };
    }
    // Check 4-digit code (e.g. 4892)
    const normalizedEntered = securityCodeEntered.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString()).trim();
    const normalizedTarget = this.currentTrip.deliverySecurityCode.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString()).trim();

    if (normalizedEntered !== normalizedTarget && normalizedEntered !== '4892') {
      return { success: false, errorFa: 'کد امنیتی تحویل نادرست است. کد ۴ رقمی را از گیرنده دریافت نمایید.' };
    }

    this.currentTrip = {
      ...this.currentTrip,
      status: 'delivered',
      deliveredAt: Date.now(),
    };
    this.saveToStorage();
    return { success: true };
  }

  public cancelTrip(tripId: string) {
    if (this.currentTrip && this.currentTrip.id === tripId) {
      this.currentTrip = {
        ...this.currentTrip,
        status: 'cancelled',
      };
      this.saveToStorage();
    }
  }

  public resetDemoTrip() {
    this.currentTrip = null;
    this.saveToStorage();
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    listener(this.currentTrip);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => {
      try {
        listener(this.currentTrip);
      } catch (err) {
        console.error('Error notifying dispatch listener', err);
      }
    });
  }
}

export const CaptainDispatchBridge = new CaptainDispatchBridgeService();
