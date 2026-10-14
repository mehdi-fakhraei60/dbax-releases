import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  MapPin,
  Map,
  LocateFixed,
  Crosshair,
  Search,
  Navigation,
  Camera,
  ShieldCheck,
  CreditCard,
  Bike,
  Package,
  User,
  Phone,
  CheckCircle2,
  Clock,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  QrCode,
  Download,
  AlertCircle,
  Sparkles,
  Sliders,
  DollarSign,
  Maximize2,
  Bell,
  Check,
  RotateCcw,
  FileText,
  X,
  Banknote,
  MessageSquare,
  Send,
  Tag,
  AlertTriangle,
  Building,
  Plus,
  Volume2,
  VolumeX,
  Mail,
  Calendar,
  CloudRain,
  Sun,
  CloudSnow,
  PenTool,
  UserCheck,
  HelpCircle,
  FileCheck,
  Trash2,
  ChevronDown,
  Globe,
  Coins,
  Truck,
  Building2,
  Receipt,
  FileSpreadsheet,
} from 'lucide-react';
import { APPS, CURRENT_RELEASE } from '../data/releases';
import { QrModal } from './QrModal';
import {
  KavenegarAdapter,
  NeshanAdapter,
  NeshanLocation,
  MapHubQuickSelect,
  PaymentGatewayAdapter,
  PaymentMethod,
  CameraArAdapter,
  ParcelDimensions,
  IRAN_STANDARD_PARCEL_PRESETS,
  StandardParcelPreset,
  UpdaterAdapter,
  UpdateCheckResult,
  MaskedCallAdapter,
  PushNotificationAdapter,
  PushMessage,
  MODUALS2_CONFIG,
  OfficialInvoice,
  BAX_TERMS_AND_CONDITIONS,
  CourierStreamer,
  CourierGeoPoint,
  PromoAdapter,
  PromoValidationResult,
  InAppChatAdapter,
  ChatMessage,
  BAX_SMS_TEMPLATES,
  BaxSmsTemplate,
  SoundEffects,
  DispatchScheduler,
  MultiDropDestination,
  DeliveryScheduleOption,
  PricingBreakdown,
  ProofOfDeliveryAdapter,
  ProofOfDeliveryRecord,
  FraudDetector,
  SecurityStatus,
  SupportChatAdapter,
  SupportMessage,
  LiveWebTrackingAdapter,
  LiveTrackingTelemetry,
  CashOnDeliveryAdapter,
  CodTransaction,
  FreightFleetAdapter,
  FreightVehicleOption,
  AddressBookAdapter,
  SavedAddressRecord,
  CorporateInvoiceAdapter,
  BulkDispatchAdapter,
  CaptainDispatchBridge,
  PRE_APPROVED_TEST_CAPTAIN,
} from '../moduals2';

export const CustomerAppSimulator: React.FC = () => {
  const customerApp = APPS.find((a) => a.id === 'customer')!;

  // Current active screen in simulator:
  const [currentScreen, setCurrentScreen] = useState<string>('C05_map');

  // Push notifications state from moduals2
  const [activePush, setActivePush] = useState<PushMessage | null>(null);

  // Audio effects state
  const [soundOn, setSoundOn] = useState(true);

  // Terms and conditions modal
  const [showTermsModal, setShowTermsModal] = useState(false);

  // SMS log modal
  const [showSmsModal, setShowSmsModal] = useState(false);

  // In-App Chat & Support Desk Modal state (C20)
  const [showChatModal, setShowChatModal] = useState(false);
  const [activeChatTab, setActiveChatTab] = useState<'courier' | 'support'>('courier');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(InAppChatAdapter.getInitialMessages());
  const [chatInputText, setChatInputText] = useState('');
  const [supportMessages, setSupportMessages] = useState<SupportMessage[]>(SupportChatAdapter.getInitialMessages());
  const [supportInputText, setSupportInputText] = useState('');

  // Official Invoice modal (C13)
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  // PoD Modal (Proof of Delivery C30/C31)
  const [showPodModal, setShowPodModal] = useState(false);

  // Enterprise & Logistics Modals
  const [showWebTrackingModal, setShowWebTrackingModal] = useState(false);
  const [showAddressBookModal, setShowAddressBookModal] = useState(false);
  const [showCodModal, setShowCodModal] = useState(false);
  const [isCodEnabled, setIsCodEnabled] = useState(false);
  const [codAmountToman, setCodAmountToman] = useState<number>(1850000);
  const [savedAddressesList, setSavedAddressesList] = useState<SavedAddressRecord[]>(AddressBookAdapter.getSavedAddresses());

  useEffect(() => {
    SoundEffects.soundEnabled = soundOn;
  }, [soundOn]);

  useEffect(() => {
    const unsubscribe = PushNotificationAdapter.subscribe((msg) => {
      setActivePush(msg);
      SoundEffects.playChime();
      setTimeout(() => setActivePush(null), 4000);
    });
    return unsubscribe;
  }, []);

  // Auth state (C02/C03 via moduals2 KavenegarAdapter)
  const [phoneNumber, setPhoneNumber] = useState('09121234567');
  const [otpInput, setOtpInput] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCooldown, setOtpCooldown] = useState(0);
  const [authError, setAuthError] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(true);

  // Address & Neshan state (C05/C06 via moduals2 NeshanAdapter)
  // Requirement: First priority is interactive Map selection. If user desires, they can open saved addresses modal.
  const [showSavedAddressesSheet, setShowSavedAddressesSheet] = useState(false);
  const [mapTargetMode, setMapTargetMode] = useState<'pickup' | 'destination'>('pickup');
  const [activeDestinationIdx, setActiveDestinationIdx] = useState<number>(0);
  const [mapPinCoords, setMapPinCoords] = useState<{ lat: number; lng: number }>({
    lat: 35.7005,
    lng: 51.3912,
  });
  const [isResolvingAddress, setIsResolvingAddress] = useState(false);
  const [isGpsActive, setIsGpsActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mapSearchSuggestions, setMapSearchSuggestions] = useState<NeshanLocation[]>([]);
  const [showMapSuggestions, setShowMapSuggestions] = useState(false);
  const [routeSummary, setRouteSummary] = useState<RouteResult>(
    NeshanAdapter.calculateRoute(
      { lat: 35.7005, lng: 51.3912, title: 'انقلاب', address: 'میدان انقلاب' },
      { lat: 35.7878, lng: 51.3732, title: 'سعادت‌آباد', address: 'سعادت‌آباد' }
    )
  );
  const [selectedPickup, setSelectedPickup] = useState<NeshanLocation>({
    lat: 35.7005,
    lng: 51.3912,
    title: 'میدان انقلاب',
    address: 'تهران، میدان انقلاب اسلامی، ابتدای کارگر شمالی، پلاک ۱۲',
  });
  const [pickupUnit, setPickupUnit] = useState('واحد ۴، طبقه ۲');

  // Multi-Drop Destinations state (C06 / DispatchScheduler)
  const [destinations, setDestinations] = useState<MultiDropDestination[]>([
    {
      id: 'dest-1',
      location: {
        lat: 35.7878,
        lng: 51.3732,
        title: 'سعادت‌آباد (مقصد ۱)',
        address: 'تهران، سعادت‌آباد، بلوار فرهنگ، کوچه باغ بهشت، پلاک ۸',
      },
      recipientName: 'سعید رضوانی',
      recipientPhone: '۰۹۱۲۹۹۸۸۷۷۶',
      unitNotes: 'زنگ ۸، لابی',
      status: 'pending',
    },
  ]);

  // Delivery Scheduling state (DispatchScheduler)
  const [scheduleType, setScheduleType] = useState<'immediate' | 'scheduled'>('immediate');
  const [selectedSlotId, setSelectedSlotId] = useState<string>('today_16_18');
  const timeSlots = DispatchScheduler.getScheduledTimeSlots();
  const activeSlot = timeSlots.find((s) => s.id === selectedSlotId);

  // Dynamic / Surge Weather and Traffic simulation
  const [weatherCondition, setWeatherCondition] = useState<'clear' | 'rain' | 'snow'>('clear');
  const [trafficCondition, setTrafficCondition] = useState<'smooth' | 'heavy'>('smooth');

  // Security Integrity state (FraudDetector)
  const [securityStatus] = useState<SecurityStatus>(FraudDetector.assessSecurity());

  // Nearby Couriers (C05 via CourierStreamer)
  const [nearbyCouriers, setNearbyCouriers] = useState<CourierGeoPoint[]>([]);
  useEffect(() => {
    const list = CourierStreamer.findNearbyCouriers(selectedPickup.lat, selectedPickup.lng, 2.5);
    setNearbyCouriers(list);
  }, [selectedPickup]);

  // Camera AR, Standard Presets & Manual fallback state (C07 via moduals2 CameraArAdapter)
  const [c07Tab, setC07Tab] = useState<'presets' | 'camera_ai' | 'manual'>('presets');
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>('post_size_4');
  const [lengthInput, setLengthInput] = useState(30);
  const [widthInput, setWidthInput] = useState(20);
  const [heightInput, setHeightInput] = useState(20);
  const [parcelAnalysis, setParcelAnalysis] = useState<ParcelDimensions>(
    CameraArAdapter.calculateFromDimensions(30, 20, 20, 'post_size_4')
  );
  const [isScanningAr, setIsScanningAr] = useState(false);
  const [isRealCameraActive, setIsRealCameraActive] = useState(false);
  const [realCameraError, setRealCameraError] = useState<string | null>(null);
  const [cardCalibrationActive, setCardCalibrationActive] = useState(true);
  const [isCardDetected, setIsCardDetected] = useState(false);
  const [parcelValue, setParcelValue] = useState('۲,۵۰۰,۰۰۰ تومان');
  const [isFragile, setIsFragile] = useState(false);
  const [parcelNotes, setParcelNotes] = useState('کارتن استاندارد پستی سایز ۴');
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const streamRef = React.useRef<MediaStream | null>(null);

  // Vehicle & pricing state (C08/C10)
  const [selectedVehicle, setSelectedVehicle] = useState<'box_bike' | 'regular_bike' | 'pickup_van'>('box_bike');
  const [isGuaranteed, setIsGuaranteed] = useState(true);
  const [hasReturnTrip, setHasReturnTrip] = useState(false);
  const [stopDurationMinutes, setStopDurationMinutes] = useState<number>(0);

  // Promo Code Voucher (C11)
  const [promoCodeInput, setPromoCodeInput] = useState('BAXFIRST');
  const [appliedPromo, setAppliedPromo] = useState<PromoValidationResult | null>(null);

  // Pricing calculations using DispatchScheduler
  const distanceKm = destinations.length === 1 ? 6.2 : destinations.length === 2 ? 10.4 : 14.8;
  const scheduleOption: DeliveryScheduleOption = {
    type: scheduleType,
    dateLabel: scheduleType === 'immediate' ? 'هم‌اکنون (فوری)' : activeSlot?.label,
    timeSlot: activeSlot?.period,
  };

  const dispatchPricing = DispatchScheduler.calculatePricing(
    distanceKm,
    destinations.length,
    scheduleOption,
    weatherCondition,
    trafficCondition
  );

  // Vehicle multiplier
  const vehicleMultiplier = selectedVehicle === 'box_bike' ? 1.0 : selectedVehicle === 'regular_bike' ? 0.9 : 2.1;
  const baseVehiclePrice = Math.round(dispatchPricing.totalFinalPrice * vehicleMultiplier);
  const guaranteePrice = isGuaranteed ? 18000 : 0;
  const returnTripPrice = hasReturnTrip ? Math.round(baseVehiclePrice * 0.7) : 0;
  const stopPrice = stopDurationMinutes > 0 ? (stopDurationMinutes / 5) * 12000 : 0;
  const subtotalBeforeDiscount = baseVehiclePrice + guaranteePrice + returnTripPrice + stopPrice;
  const discountAmount = appliedPromo?.valid ? appliedPromo.discountToman : 0;
  const totalPrice = Math.max(25000, subtotalBeforeDiscount - discountAmount);

  // Payment state: NO ONLINE IPG. Options: 'wallet_credit' | 'cash_on_delivery' | 'card_to_card'
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('cash_on_delivery');
  const [payerType, setPayerType] = useState<'sender' | 'receiver'>('sender');
  const [creditBalance, setCreditBalance] = useState(PaymentGatewayAdapter.getWalletCreditBalance());
  const [officialInvoice, setOfficialInvoice] = useState<OfficialInvoice | null>(null);

  // User Requirement: Payment must NOT happen before finding courier.
  // Workflow: 1. Request dispatched -> 2. Courier found & confirmed -> 3. Package physically picked up -> 4. Confirm payment (واریزی را اوکی کند).
  const [courierAssigned, setCourierAssigned] = useState(false);
  const [packageReceivedByCourier, setPackageReceivedByCourier] = useState(false);
  const [isFarePaid, setIsFarePaid] = useState(false);

  // Tracking state (C18)
  const [trackProgress, setTrackProgress] = useState(35);
  const [maskedCallOpen, setMaskedCallOpen] = useState(false);

  // Proof of Delivery Record (C30/C31)
  const [podRecord] = useState<ProofOfDeliveryRecord>(
    ProofOfDeliveryAdapter.createRecord({
      destinationAddress: destinations[0]?.location.address,
      recipientName: destinations[0]?.recipientName,
      recipientPhone: destinations[0]?.recipientPhone,
      securityCodeConfirmed: true,
    })
  );
  const [signatureSigned, setSignatureSigned] = useState(true);

  // In-App Auto-Updater state (C38 via moduals2 UpdaterAdapter)
  // Current official release version running on user's device is v1.0.0-preview6 (versionCode 6)
  const [installedVersion, setInstalledVersion] = useState('1.0.0-preview6');
  const [updateInfo, setUpdateInfo] = useState<UpdateCheckResult>({
    hasUpdate: false,
    latestVersion: '1.0.0-preview6',
    latestVersionCode: 6,
    currentVersion: '1.0.0-preview6',
    currentVersionCode: 6,
    releaseDateFa: '۱۴۰۳/۰۷/۲۴',
    downloadUrl:
      'https://github.com/mehdi-fakhraei60/dbax-releases/releases/latest/download/bax-customer.apk',
    arm64DownloadUrl:
      'https://github.com/mehdi-fakhraei60/dbax-releases/releases/latest/download/bax-customer-arm64.apk',
    changelogHighlights: [
      'امکان ثبت سفارش چند مقصده با توقف‌های دلخواه (Multi-Stop Delivery)',
      'سفارش زمان‌بندی‌شده و رزرو قطعی ساعت مراجعه کاپتان (Scheduled Delivery)',
      'اضافه شدن ناوگان بارهای سنگین، نیسان، خاور و کارگر باربری (Freight & Porter)',
      'سامانه امانت‌داری و تسویه آنی بهای کالا در محل تحویل (Goods COD Escrow)',
      'پنل سازمانی اختصاصی B2B با قابلیت ایمپورت فایل اکسل/CSV سفارشات گروهی',
      'لینک ردیابی زنده تحت وب بدون نیاز به نصب اپ برای گیرندگان مرسوله',
      'صدور صورتحساب رسمی مالیاتی مودیان با ۱۰٪ مالیات بر ارزش افزوده',
    ],
    forceUpdate: false,
    isAutomaticDetection: true,
    detectedAt: 'نسخه رسمی نصب‌شده: v1.0.0-preview6 (بروز)',
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateProgress, setUpdateProgress] = useState(0);
  const [updateInstalled, setUpdateInstalled] = useState(false);
  const [emailSentNotice, setEmailSentNotice] = useState(false);

  useEffect(() => {
    let active = true;
    UpdaterAdapter.autoCheckInBackground(installedVersion).then((res) => {
      if (active && res) {
        setUpdateInfo(res);
      }
    });

    const unsubscribe = UpdaterAdapter.subscribeToUpdateAlerts((info) => {
      if (active && info) {
        setUpdateInfo(info);
      }
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [installedVersion]);

  // QR Modal
  const [qrOpen, setQrOpen] = useState(false);
  const [selectedArch, setSelectedArch] = useState<'universal' | 'arm64'>('arm64');

  // Multi-Drop Handlers
  const handleAddDestination = () => {
    if (destinations.length >= 3) {
      alert('حداکثر ۳ مقصد مجزا در هر سفارش قابل ثبت است.');
      return;
    }
    const nextId = `dest-${destinations.length + 1}`;
    const nextLoc: NeshanLocation =
      destinations.length === 1
        ? {
            lat: 35.8052,
            lng: 51.4284,
            title: 'میدان تجریش (مقصد ۲)',
            address: 'تهران، میدان تجریش، خیابان فناخسرو، پلاک ۲',
          }
        : {
            lat: 35.7312,
            lng: 51.5312,
            title: 'تهرانپارس (مقصد ۳)',
            address: 'تهران، فلکه اول تهرانپارس، خیابان بهار، پلاک ۷۶',
          };

    setDestinations([
      ...destinations,
      {
        id: nextId,
        location: nextLoc,
        recipientName: destinations.length === 1 ? 'رضا کریمی' : 'مریم سعادتی',
        recipientPhone: destinations.length === 1 ? '۰۹۱۹۴۴۵۵۶۶۷' : '۰۹۳۵۱۲۳۹۸۷۶',
        unitNotes: 'واحد ۱، طبقه همکف',
        status: 'pending',
      },
    ]);
    SoundEffects.playPop();
    PushNotificationAdapter.dispatch(
      'مقصد جدید اضافه شد',
      `مسیر سفر به ${destinations.length + 1} مقصد بروزرسانی شد.`,
      'C06_destination'
    );
  };

  const handleRemoveDestination = (id: string) => {
    if (destinations.length <= 1) return;
    setDestinations(destinations.filter((d) => d.id !== id));
    SoundEffects.playPop();
  };

  // Route & Search live effects
  useEffect(() => {
    if (destinations[0]?.location) {
      const res = NeshanAdapter.calculateRoute(selectedPickup, destinations[0].location);
      setRouteSummary(res);
    }
  }, [selectedPickup, destinations]);

  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      NeshanAdapter.searchPlaces(searchQuery).then((results) => {
        setMapSearchSuggestions(results);
        setShowMapSuggestions(true);
      });
    } else {
      setMapSearchSuggestions([]);
      setShowMapSuggestions(false);
    }
  }, [searchQuery]);

  // Handlers for Map Interactive Selection (Priority 1)
  const handleMapPinMove = async (lat: number, lng: number, target = mapTargetMode, destIdx = activeDestinationIdx) => {
    setMapPinCoords({ lat, lng });
    setIsResolvingAddress(true);
    SoundEffects.playPop();
    const loc = await NeshanAdapter.reverseGeocode(lat, lng);
    setIsResolvingAddress(false);

    if (target === 'pickup') {
      setSelectedPickup(loc);
    } else {
      setDestinations((prev) =>
        prev.map((d, i) => (i === destIdx ? { ...d, location: loc } : d))
      );
    }
  };

  const handleSelectHubOnMap = (hubLocation: NeshanLocation) => {
    setMapPinCoords({ lat: hubLocation.lat, lng: hubLocation.lng });
    SoundEffects.playPop();
    if (mapTargetMode === 'pickup') {
      setSelectedPickup(hubLocation);
    } else {
      setDestinations((prev) =>
        prev.map((d, i) => (i === activeDestinationIdx ? { ...d, location: hubLocation } : d))
      );
    }
  };

  const handleConfirmCurrentMapSelection = () => {
    SoundEffects.playPop();
    if (mapTargetMode === 'pickup') {
      setMapTargetMode('destination');
      setActiveDestinationIdx(0);
      const firstDest = destinations[0]?.location || { lat: 35.7878, lng: 51.3732 };
      setMapPinCoords({ lat: firstDest.lat, lng: firstDest.lng });
      PushNotificationAdapter.dispatch(
        'مبدا روی نقشه ثبت شد',
        `مبدا: ${selectedPickup.title}. اکنون مقصد ۱ را روی نقشه مشخص کنید.`,
        'C05_map'
      );
    } else {
      PushNotificationAdapter.dispatch(
        'مقصد روی نقشه ثبت شد',
        `مقصد ${activeDestinationIdx + 1} (${destinations[activeDestinationIdx]?.location.title || 'مقصد'}) تایید شد.`,
        'C05_map'
      );
    }
  };

  const handleSimulateGps = async () => {
    setIsGpsActive(true);
    SoundEffects.playPop();
    const gpsLoc = { lat: 35.7005, lng: 51.3912 };
    setMapPinCoords(gpsLoc);
    const loc = await NeshanAdapter.reverseGeocode(gpsLoc.lat, gpsLoc.lng);
    if (mapTargetMode === 'pickup') {
      setSelectedPickup(loc);
    } else {
      setDestinations((prev) =>
        prev.map((d, i) => (i === activeDestinationIdx ? { ...d, location: loc } : d))
      );
    }
    setTimeout(() => setIsGpsActive(false), 500);
  };

  // Real Camera Lifecycle & Handlers
  const startRealCamera = async () => {
    setRealCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('عدم پشتیبانی مرورگر از وب‌کم');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
      setIsRealCameraActive(true);
      SoundEffects.playPop();
    } catch (err: any) {
      console.warn('Real camera error:', err);
      setRealCameraError('دسترسی مستقیم به سخت‌افزار دوربین مسدود یا در دسترس نیست. شبیه‌ساز لیزری فعال است.');
      setIsRealCameraActive(false);
    }
  };

  const stopRealCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsRealCameraActive(false);
  };

  // Turn off camera when leaving C07
  useEffect(() => {
    if (currentScreen !== 'C07_camera') {
      stopRealCamera();
    }
  }, [currentScreen]);

  const handleSelectPreset = (preset: StandardParcelPreset) => {
    setSelectedPresetId(preset.id);
    setLengthInput(preset.lengthCm);
    setWidthInput(preset.widthCm);
    setHeightInput(preset.heightCm);
    const res = CameraArAdapter.calculateFromDimensions(preset.lengthCm, preset.widthCm, preset.heightCm, preset.id);
    setParcelAnalysis(res);
    setSelectedVehicle(res.recommendedFleet);
    setParcelNotes(preset.nameFa);
    SoundEffects.playPop();
    PushNotificationAdapter.dispatch(
      'کارتن استاندارد انتخاب شد',
      `${preset.nameFa} (${preset.dimensionsFa}) - ناوگان: ${preset.recommendedFleetLabelFa}`,
      'C07_camera'
    );
  };

  const handleScanWithCardReference = () => {
    setIsScanningAr(true);
    SoundEffects.playBeep();
    setTimeout(() => {
      // Calculate box size calibrated against Shetab Card (8.56cm x 5.4cm)
      const mockCardResult = CameraArAdapter.calculateFromCardReference(260, 195, 65, 41);
      setLengthInput(mockCardResult.lengthCm);
      setWidthInput(mockCardResult.widthCm);
      setHeightInput(mockCardResult.heightCm);
      setParcelAnalysis(mockCardResult);
      setSelectedPresetId(null);
      setIsScanningAr(false);
      setIsCardDetected(true);
      setSelectedVehicle(mockCardResult.recommendedFleet);
      SoundEffects.playSuccess();
      PushNotificationAdapter.dispatch(
        'کالیبراسیون با کارت شتاب انجام شد',
        `ابعاد کارتن: ${mockCardResult.lengthCm}×${mockCardResult.widthCm}×${mockCardResult.heightCm} سانتی‌متر (دقت ۹۷٪) | ناوگان: ${mockCardResult.recommendedFleetLabelFa}`,
        'C07_camera'
      );
    }, 1200);
  };

  const handleDimensionChange = (l: number, w: number, h: number, presetId?: string) => {
    setLengthInput(l);
    setWidthInput(w);
    setHeightInput(h);
    const res = CameraArAdapter.calculateFromDimensions(l, w, h, presetId);
    setParcelAnalysis(res);
    setSelectedVehicle(res.recommendedFleet);
  };

  // Auth Handlers (KavenegarAdapter)
  const handleSendOtp = async () => {
    setAuthError(null);
    if (!termsAccepted) {
      setAuthError('لطفاً شرایط و قوانین استفاده از خدمات باکس را تایید کنید.');
      return;
    }
    const rateCheck = FraudDetector.checkOtpAllowed();
    if (!rateCheck.allowed) {
      setAuthError(`تعداد درخواست پیامک بیش از حد مجاز است. لطفاً ${rateCheck.waitSeconds} ثانیه صبر کنید.`);
      return;
    }

    const res = await KavenegarAdapter.sendOtp(phoneNumber);
    if (res.success) {
      setOtpSent(true);
      setOtpCooldown(res.remainingCooldownSeconds);
      PushNotificationAdapter.dispatch('کاوه‌نگار (OTP)', 'کد تایید ۴ رقمی ارسال شد: ۴۸۹۲', 'C03_otp');
    } else {
      setAuthError(res.messageFa);
    }
  };

  const handleVerifyOtp = async () => {
    setAuthError(null);
    const res = await KavenegarAdapter.verifyOtp(phoneNumber, otpInput);
    if (res.success) {
      PushNotificationAdapter.dispatch('ورود موفق', 'احراز هویت پیامکی با موفقیت تایید شد.', 'C05_map');
      setCurrentScreen('C05_map');
    } else {
      setAuthError(res.messageFa);
    }
  };

  const handleApplyPromo = () => {
    const res = PromoAdapter.validatePromo(promoCodeInput, subtotalBeforeDiscount);
    setAppliedPromo(res);
    if (res.valid) {
      SoundEffects.playPop();
      PushNotificationAdapter.dispatch('کد تخفیف اعمال شد', res.messageFa, 'C10_checkout');
    } else {
      alert(res.messageFa);
    }
  };

  // Chat & Support Messaging
  const handleSendMessage = () => {
    if (!chatInputText.trim()) return;
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'customer',
      text: chatInputText.trim(),
      timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
    };
    setChatMessages((prev) => [...prev, newMsg]);
    setChatInputText('');
    SoundEffects.playPop();

    // Simulated reply from courier after 1.5s
    setTimeout(() => {
      const replyMsg: ChatMessage = {
        id: `reply-${Date.now()}`,
        sender: 'courier',
        text: 'پیام دریافت شد. من دقیقاً در آدرس اعلام‌شده تحویل می‌گیرم.',
        timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
        status: 'delivered',
      };
      setChatMessages((prev) => [...prev, replyMsg]);
      SoundEffects.playChime();
    }, 1500);
  };

  const handleSendSupportMessage = () => {
    if (!supportInputText.trim()) return;
    const userMsg: SupportMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: supportInputText.trim(),
      time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
    };
    setSupportMessages((prev) => [...prev, userMsg]);
    const prompt = supportInputText.trim();
    setSupportInputText('');
    SoundEffects.playPop();

    setTimeout(() => {
      const agentReply = SupportChatAdapter.generateAgentReply(prompt);
      setSupportMessages((prev) => [...prev, agentReply]);
      SoundEffects.playChime();
    }, 1200);
  };

  // Synchronize with Captain App via real-time bridge
  useEffect(() => {
    const unsub = CaptainDispatchBridge.subscribe((trip) => {
      if (!trip) return;
      if (trip.status === 'accepted') {
        setCourierAssigned(true);
        if (currentScreen === 'C15_finding') {
          setCurrentScreen('C18_tracking');
          PushNotificationAdapter.dispatch(
            'کاپتان مهدی سفر را پذیرفت!',
            'کاپتان مهدی (۰۹۳۹۹۸۸۷۷۸۲ با موتور آپاچی ۲۰۰) درخواست را پذیرفت و در حال حرکت به سمت مبدا جهت دریافت بسته است.',
            'C18_tracking'
          );
          SoundEffects.playSuccess();
        }
      } else if (trip.status === 'package_picked_up') {
        setPackageReceivedByCourier(true);
        PushNotificationAdapter.dispatch(
          'بسته توسط کاپتان دریافت شد',
          'کاپتان بسته را رویت و دریافت کرد. اکنون لطفاً واریزی کرایه سفر را اوکی فرمایید.',
          'C18_tracking'
        );
        SoundEffects.playSuccess();
      } else if (trip.status === 'paid' || trip.status === 'in_transit') {
        setIsFarePaid(true);
      } else if (trip.status === 'delivered') {
        setCurrentScreen('C30_delivered');
      }
    });
    return () => unsub();
  }, [currentScreen]);

  const handleStartCourierSearch = () => {
    setCourierAssigned(false);
    setPackageReceivedByCourier(false);
    setIsFarePaid(false);
    SoundEffects.playPop();

    // Broadcast live trip request to Captain App (09399887782)
    CaptainDispatchBridge.createTripRequest({
      customerName: 'مهدی فخرایی',
      customerPhone: '09121112233',
      pickupTitle: selectedPickup.title,
      pickupAddress: selectedPickup.address,
      destinations: destinations.map((d) => ({
        id: d.id,
        title: d.title,
        address: d.address,
        recipientName: d.recipientName || 'گیرنده مرسوله',
        recipientPhone: d.recipientPhone || '09350000000',
        status: 'pending',
      })),
      packageType:
        selectedPackageCategory === 'box'
          ? `کارتن ابعاد (${packageDims.lengthCm}×${packageDims.widthCm}×${packageDims.heightCm} سانتی‌متر)`
          : selectedPackageCategory === 'envelope'
          ? 'پاکت نامه / مدارک'
          : 'بسته اختصاصی',
      packageDims: packageDims,
      vehicleType: selectedVehicle,
      vehicleTitleFa: currentVehicleObj.title,
      fareAmount: totalPrice,
    });

    PushNotificationAdapter.dispatch(
      'درخواست به کاپتان (۰۹۳۹۹۸۸۷۷۸۲) ارسال شد',
      'سیستم در حال اعلام درخواست به کاپتان مهدی است. کرایه در این مرحله کسر نمی‌شود و پس از تحویل فیزیکی بسته به کاپتان در مبدا واریز می‌گردد.',
      'C15_finding'
    );
    setCurrentScreen('C15_finding');
  };

  const handleCourierAccepted = () => {
    setCourierAssigned(true);
    setPackageReceivedByCourier(false);
    setIsFarePaid(false);
    SoundEffects.playSuccess();

    const activeTrip = CaptainDispatchBridge.getActiveTrip();
    if (activeTrip) {
      CaptainDispatchBridge.acceptTrip(activeTrip.id, PRE_APPROVED_TEST_CAPTAIN);
    }

    PushNotificationAdapter.dispatch(
      'کاپتان مهدی تایید شد!',
      'کاپتان مهدی (۰۹۳۹۹۸۸۷۷۸۲ با موتور آپاچی ۲۰۰) درخواست را پذیرفت و در حال حرکت به سمت مبدا جهت دریافت بسته است.',
      'C18_tracking'
    );
    setCurrentScreen('C18_tracking');
  };

  const handleConfirmPackageReceived = () => {
    setPackageReceivedByCourier(true);
    SoundEffects.playSuccess();

    const activeTrip = CaptainDispatchBridge.getActiveTrip();
    if (activeTrip) {
      CaptainDispatchBridge.confirmPackagePickedUp(activeTrip.id);
    }

    PushNotificationAdapter.dispatch(
      'بسته توسط کاپتان تحویل گرفته شد',
      'رویت فیزیکی بسته در مبدا تایید گردید. اکنون لطفاً واریزی کرایه سفر را اوکی نمایید.',
      'C18_tracking'
    );
  };

  const handlePayOrder = () => {
    if (selectedPaymentMethod === 'wallet_credit') {
      const res = PaymentGatewayAdapter.payWithCredit(totalPrice);
      if (!res.success) {
        alert(res.errorFa);
        return;
      }
      setCreditBalance(res.newBalance);
    }

    const inv = PaymentGatewayAdapter.generateOfficialInvoice(
      'مهدی فخرایی',
      `ORD-${Date.now().toString().slice(-6)}`,
      totalPrice,
      isGuaranteed,
      selectedPaymentMethod,
      payerType
    );
    setOfficialInvoice(inv);
    setIsFarePaid(true);

    const activeTrip = CaptainDispatchBridge.getActiveTrip();
    if (activeTrip) {
      CaptainDispatchBridge.confirmFarePayment(activeTrip.id);
    }

    SoundEffects.playSuccess();
    PushNotificationAdapter.dispatch(
      'واریزی کرایه با موفقیت تایید شد',
      `مبلغ ${new Intl.NumberFormat('fa-IR').format(totalPrice)} تومان تسویه شد. کاپتان با مرسوله شما در حال حرکت به سمت مقصد است.`,
      'C18_tracking'
    );
    setCurrentScreen('C18_tracking');
  };

  const handleTriggerUpdater = () => {
    setIsUpdating(true);
    UpdaterAdapter.simulateDownload(
      (pct) => setUpdateProgress(pct),
      () => {
        setIsUpdating(false);
        setUpdateInstalled(true);
        const newVer = updateInfo?.latestVersion || '1.0.0-preview6';
        setInstalledVersion(newVer);
        setUpdateInfo((prev) =>
          prev
            ? {
                ...prev,
                hasUpdate: false,
                currentVersion: newVer,
              }
            : null
        );
        SoundEffects.playSuccess();
        PushNotificationAdapter.dispatch(
          'بروزرسانی با موفقیت نصب شد',
          `اپلیکیشن به نسخه جدید ${newVer} ارتقا یافت. تمام امکانات فعال شدند.`,
          'C38_account'
        );
      }
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Customer Hero Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-950/70 via-indigo-950/50 to-slate-900 border border-indigo-500/30 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2.5 mb-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-indigo-400" />
                <span>اپلیکیشن مشتری (Bax Customer)</span>
              </span>
              <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-slate-900 text-slate-300 border border-slate-700/80">
                {customerApp.packageName}
              </span>
              <span className="text-xs px-2.5 py-1 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold flex items-center gap-1">
                <Check className="w-3 h-3" />
                <span>نسخه کامل عملیاتی (C01-C38)</span>
              </span>
              <span className="text-xs px-2.5 py-1 rounded-md bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>ضد تقلب (Mock GPS Shield) فعال</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              سامانه هوشمند حمل بار و پیک موتوری باکس
            </h1>
            <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-2xl leading-relaxed">
              پوشش کامل صفحات <strong>C01 تا C38</strong> مجهز به سفارش چند مقصده، سفارش زمان‌بندی‌شده، اثبات تحویل و امضای دیجیتال (PoD)، پشتیبانی ۲۴ ساعته، نقشه نشان و پیامک کاوه‌نگار.
            </p>
          </div>

          {/* Quick APK Downloads & Utilities */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0 w-full sm:w-auto">
            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setSelectedArch('arm64')}
                className={`flex-1 py-1.5 px-3 rounded-lg font-medium transition-colors ${
                  selectedArch === 'arm64' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                arm64 (سبک)
              </button>
              <button
                onClick={() => setSelectedArch('universal')}
                className={`flex-1 py-1.5 px-3 rounded-lg font-medium transition-colors ${
                  selectedArch === 'universal' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Universal
              </button>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={selectedArch === 'arm64' ? customerApp.arm64Apk.downloadUrl : customerApp.universalApk.downloadUrl}
                download
                className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-indigo-600/30"
              >
                <Download className="w-4 h-4" />
                <span>دانلود APK مستقیم</span>
              </a>
              <button
                onClick={() => setQrOpen(true)}
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors"
                title="اسکن بارکد QR"
              >
                <QrCode className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Simulator Master Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Controller Panel (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Active Screen Navigator */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                <span>انتخاب صفحه شبیه‌ساز (C01-C38)</span>
              </span>
              <button
                onClick={() => setSoundOn(!soundOn)}
                className="text-slate-400 hover:text-white p-1 rounded"
                title={soundOn ? 'قطع صدا' : 'وصل صدا'}
              >
                {soundOn ? <Volume2 className="w-3.5 h-3.5 text-indigo-400" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="space-y-1.5">
              {[
                { id: 'C05_map', label: 'C05 • نقشه، مبدا/مقصد و سفارش چند مقصده' },
                { id: 'C07_camera', label: 'C07 • اسکن دوربین ابعاد و مشخصات مرسوله' },
                { id: 'C08_service', label: 'C08/09 • انتخاب ناوگان و سفارش زمان‌بندی‌شده' },
                { id: 'C10_checkout', label: 'C10/12 • پیش‌فاکتور، کد تخفیف و تسویه' },
                { id: 'C15_finding', label: 'C15 • رادار اعزام و جستجوی کاپتان' },
                { id: 'C18_tracking', label: 'C18 • رهگیری زنده، تماس امن و چت' },
                { id: 'C30_delivered', label: 'C30/31 • تحویل موفق، اثبات PoD و امضا' },
                { id: 'C02_login', label: 'C02/03 • ورود پیامکی کاوه‌نگار (OTP)' },
                { id: 'C38_account', label: 'C38 • حساب کاربری و آپدیتر درون‌برنامه‌ای' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setCurrentScreen(s.id)}
                  className={`w-full text-right p-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                    currentScreen === s.id
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'bg-slate-950/60 text-slate-300 hover:bg-slate-800/80 hover:text-white border border-slate-800/60'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <span>{s.label}</span>
                    {s.id === 'C38_account' && updateInfo?.hasUpdate && !updateInstalled && (
                      <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] font-bold animate-pulse">
                        ⚡ آپدیت جدید
                      </span>
                    )}
                  </span>
                  {currentScreen === s.id ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  ) : s.id === 'C38_account' && updateInfo?.hasUpdate && !updateInstalled ? (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  ) : null}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Weather & Traffic Simulation Surcharges */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>موتور قیمت‌گذاری پویا (Dynamic Surge)</span>
              </span>
              <span className="text-[10px] text-amber-400 font-mono">
                {dispatchPricing.surgeMultiplier > 1.0 ? `×${dispatchPricing.surgeMultiplier}` : 'عادی'}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">شرایط جوی:</label>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    onClick={() => setWeatherCondition('clear')}
                    className={`py-1.5 px-2 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 border transition-all ${
                      weatherCondition === 'clear'
                        ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <Sun className="w-3 h-3 text-amber-400" />
                    <span>آفتابی</span>
                  </button>
                  <button
                    onClick={() => setWeatherCondition('rain')}
                    className={`py-1.5 px-2 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 border transition-all ${
                      weatherCondition === 'rain'
                        ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <CloudRain className="w-3 h-3 text-cyan-400" />
                    <span>بارانی (+۲۰٪)</span>
                  </button>
                  <button
                    onClick={() => setWeatherCondition('snow')}
                    className={`py-1.5 px-2 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 border transition-all ${
                      weatherCondition === 'snow'
                        ? 'bg-cyan-600/30 border-cyan-500 text-cyan-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <CloudSnow className="w-3 h-3 text-cyan-200" />
                    <span>برفی (+۳۵٪)</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">وضعیت ترافیک معابر:</label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => setTrafficCondition('smooth')}
                    className={`py-1.5 px-2 rounded-lg text-[10px] font-bold border transition-all ${
                      trafficCondition === 'smooth'
                        ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    تردد روان
                  </button>
                  <button
                    onClick={() => setTrafficCondition('heavy')}
                    className={`py-1.5 px-2 rounded-lg text-[10px] font-bold border transition-all ${
                      trafficCondition === 'heavy'
                        ? 'bg-amber-600/30 border-amber-500 text-amber-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    ترافیک سنگین (+۱۵٪)
                  </button>
                </div>
              </div>

              {dispatchPricing.surgeReason && (
                <div className="p-2 rounded-lg bg-amber-950/40 border border-amber-500/30 text-[10px] text-amber-300 leading-relaxed">
                  {dispatchPricing.surgeReason}
                </div>
              )}
            </div>
          </div>

          {/* Anti-Fraud and Security Shield Card */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>سپر امنیتی و ضد تقلب (FraudDetector)</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-400">امتیاز: ۹۸/۱۰۰</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">تشخیص Mock GPS:</span>
                <span className="text-emerald-400 font-bold">منفی (پاک)</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">یکپارچگی دستگاه:</span>
                <span className="text-emerald-400 font-bold">تایید شده</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">سهمیه SMS Rate:</span>
                <span className="text-emerald-400 font-bold">مجاز</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">SSL Pinning:</span>
                <span className="text-emerald-400 font-bold">فعال</span>
              </div>
            </div>
          </div>

          {/* Modals trigger buttons */}
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setShowWebTrackingModal(true)}
                className="py-2 px-3 rounded-xl bg-purple-950/40 border border-purple-500/40 text-[11px] text-purple-300 hover:text-white flex items-center justify-center gap-1.5 transition-colors font-bold"
              >
                <Globe className="w-3 h-3 text-purple-400" />
                <span>رهگیری زنده وب (بدون نصب)</span>
              </button>
              <button
                onClick={() => setShowAddressBookModal(true)}
                className="py-2 px-3 rounded-xl bg-indigo-950/40 border border-indigo-500/40 text-[11px] text-indigo-300 hover:text-white flex items-center justify-center gap-1.5 transition-colors font-bold"
              >
                <Building2 className="w-3 h-3 text-indigo-400" />
                <span>دفترچه آدرس و شعب</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setShowCodModal(true)}
                className="py-2 px-3 rounded-xl bg-amber-950/40 border border-amber-500/40 text-[11px] text-amber-300 hover:text-white flex items-center justify-center gap-1.5 transition-colors font-bold"
              >
                <Coins className="w-3 h-3 text-amber-400" />
                <span>وجه کالا در محل (COD)</span>
              </button>
              <button
                onClick={() => setShowInvoiceModal(true)}
                className="py-2 px-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-[11px] text-emerald-300 hover:text-white flex items-center justify-center gap-1.5 transition-colors font-bold"
              >
                <Receipt className="w-3 h-3 text-emerald-400" />
                <span>فاکتور رسمی دارایی</span>
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowTermsModal(true)}
                className="flex-1 py-1.5 px-3 rounded-xl bg-slate-900 border border-slate-800 text-[10px] text-slate-400 hover:text-white flex items-center justify-center gap-1.5 transition-colors"
              >
                <FileText className="w-3 h-3 text-indigo-400" />
                <span>قوانین خدمات باکس</span>
              </button>
              <button
                onClick={() => setShowSmsModal(true)}
                className="flex-1 py-1.5 px-3 rounded-xl bg-slate-900 border border-slate-800 text-[10px] text-slate-400 hover:text-white flex items-center justify-center gap-1.5 transition-colors"
              >
                <Mail className="w-3 h-3 text-emerald-400" />
                <span>الگوهای پیامک</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Phone Emulator (8 cols) */}
        <div className="lg:col-span-8 flex justify-center">
          {/* Smartphone Frame */}
          <div className="w-full max-w-sm sm:max-w-md rounded-[44px] bg-slate-900 border-[8px] border-slate-800 shadow-2xl p-3 relative overflow-hidden">
            {/* Phone Speaker & Notch */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-4 bg-slate-800 rounded-full z-30 flex items-center justify-center">
              <div className="w-12 h-1 bg-slate-700 rounded-full" />
            </div>

            {/* Internal Screen Content */}
            <div className="rounded-[36px] bg-slate-950 min-h-[660px] flex flex-col justify-between overflow-hidden relative border border-slate-800/80">
              {/* Status Bar */}
              <div className="pt-6 px-6 pb-2 flex items-center justify-between text-[11px] text-slate-400 font-mono border-b border-slate-900 select-none">
                <div className="flex items-center gap-2">
                  <span>۹:۴۱</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 flex items-center gap-0.5">
                    <ShieldCheck className="w-2.5 h-2.5" />
                    <span>Safe GPS</span>
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span>LTE</span>
                  <div className="w-4 h-2 border border-slate-500 rounded-sm p-0.5 flex items-center">
                    <div className="w-2.5 h-1 bg-emerald-400 rounded-xs" />
                  </div>
                </div>
              </div>

              {/* Dynamic Push Notification Banner */}
              {activePush && (
                <div className="mx-3 mt-2 p-2.5 rounded-2xl bg-indigo-900/90 border border-indigo-400/40 text-xs shadow-xl animate-in slide-in-from-top-3 flex items-center gap-2.5 z-40">
                  <div className="p-1.5 rounded-lg bg-indigo-500/30 text-indigo-300 shrink-0">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-white text-[11px] flex justify-between">
                      <span>{activePush.titleFa}</span>
                      <span className="text-[9px] text-slate-300 font-mono">{activePush.timestamp}</span>
                    </div>
                    <div className="text-[10px] text-slate-200 mt-0.5">{activePush.bodyFa}</div>
                  </div>
                </div>
              )}

              {/* Automatic Background Update Detection Alert Banner */}
              {updateInfo?.hasUpdate && !updateInstalled && currentScreen !== 'C38_account' && (
                <div
                  onClick={() => {
                    setCurrentScreen('C38_account');
                    SoundEffects.playPop();
                  }}
                  className="mx-3 mt-2 p-2.5 rounded-2xl bg-gradient-to-r from-amber-600 via-orange-600 to-indigo-600 border border-amber-300 text-xs shadow-xl shadow-amber-950/40 animate-in slide-in-from-top-3 flex items-center justify-between cursor-pointer hover:brightness-110 transition-all z-40"
                >
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-200 opacity-80"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-100"></span>
                    </span>
                    <div>
                      <div className="font-bold text-white text-[11px] flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                        <span>نسخه جدید {updateInfo.latestVersion} شناسایی شد!</span>
                      </div>
                      <div className="text-[9px] text-amber-100">
                        شناسایی خودکار در پس‌زمینه • برای دریافت لمس کنید
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-lg bg-slate-950/80 border border-amber-300 text-amber-300 font-bold font-mono">
                    نصب سریع
                  </span>
                </div>
              )}

              {/* SCREEN: C05_map (Home / Full-Bleed Map-First Screen with Primary Map Selection & Optional Saved Addresses) */}
              {currentScreen === 'C05_map' && (() => {
                const pickupPin = {
                  x: Math.max(6, Math.min(94, ((selectedPickup.lng - 51.30) / 0.22) * 100)),
                  y: Math.max(8, Math.min(92, ((35.83 - selectedPickup.lat) / 0.18) * 100)),
                };
                const firstDestLoc = destinations[0]?.location || { lat: 35.7878, lng: 51.3732 };
                const destPin = {
                  x: Math.max(6, Math.min(94, ((firstDestLoc.lng - 51.30) / 0.22) * 100)),
                  y: Math.max(8, Math.min(92, ((35.83 - firstDestLoc.lat) / 0.18) * 100)),
                };
                const targetPin = {
                  x: Math.max(6, Math.min(94, ((mapPinCoords.lng - 51.30) / 0.22) * 100)),
                  y: Math.max(8, Math.min(92, ((35.83 - mapPinCoords.lat) / 0.18) * 100)),
                };

                return (
                  <div className="relative flex-1 w-full h-full overflow-hidden flex flex-col justify-between select-none bg-slate-950">
                    {/* FULL-BLEED INTERACTIVE NESHAN MAP (PRIMARY VIEWPORT) */}
                    <div
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const relX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                        const relY = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
                        // Map coordinates translation for Tehran
                        const clickedLng = 51.30 + relX * 0.22;
                        const clickedLat = 35.83 - relY * 0.18;
                        handleMapPinMove(clickedLat, clickedLng);
                      }}
                      className="absolute inset-0 w-full h-full cursor-crosshair group overflow-hidden"
                      title="روی هر نقطه از نقشه کلیک یا لمس کنید تا موقعیت پین تنظیم شود"
                    >
                      {/* Grid Background Pattern */}
                      <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:20px_20px]" />

                      {/* Map Vector Roads, Avenues & Waterways */}
                      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                        {/* Major Tehran Expressways */}
                        <path d="M 0 25 L 100 25" stroke="#1e293b" strokeWidth="2.5" fill="none" />
                        <path d="M 0 45 L 100 45" stroke="#334155" strokeWidth="3" fill="none" />
                        <path d="M 0 65 L 100 65" stroke="#1e293b" strokeWidth="2.5" fill="none" />
                        <path d="M 0 82 L 100 80" stroke="#1e293b" strokeWidth="2" fill="none" />
                        <path d="M 52 0 L 52 100" stroke="#334155" strokeWidth="3.5" fill="none" />
                        <path d="M 28 0 L 32 100" stroke="#1e293b" strokeWidth="2.5" fill="none" />
                        <path d="M 74 0 L 70 100" stroke="#1e293b" strokeWidth="2.5" fill="none" />

                        {/* Diagonal Avenues */}
                        <path d="M 10 10 L 90 90" stroke="#1e293b" strokeWidth="1.5" strokeDasharray="4 2" fill="none" />
                        <path d="M 10 85 L 90 15" stroke="#1e293b" strokeWidth="1.5" strokeDasharray="4 2" fill="none" />

                        {/* Route Polyline connecting Origin to Destination */}
                        <path
                          d={`M ${pickupPin.x} ${pickupPin.y} Q ${(pickupPin.x + destPin.x) / 2 + 10} ${(pickupPin.y + destPin.y) / 2 - 10} ${destPin.x} ${destPin.y}`}
                          stroke="#6366f1"
                          strokeWidth="3"
                          strokeDasharray="4 3"
                          fill="none"
                        />

                        {/* Live Moving Captains (Motorcycles / Couriers) */}
                        {nearbyCouriers.slice(0, 5).map((c, i) => (
                          <g key={c.id} transform={`translate(${18 + i * 19}, ${22 + (i % 3) * 26})`}>
                            <circle r="3" fill="#10b981" />
                            <circle r="6" fill="#10b981" fillOpacity="0.25" className="animate-ping" />
                          </g>
                        ))}
                      </svg>

                      {/* Fixed Origin Marker Pin */}
                      <div
                        style={{ left: `${pickupPin.x}%`, top: `${pickupPin.y}%` }}
                        className="absolute -translate-x-1/2 -translate-y-full pointer-events-none z-10 transition-all duration-300 flex flex-col items-center"
                      >
                        <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/80 text-[9px] text-emerald-300 font-bold shadow-lg whitespace-nowrap mb-0.5">
                          مبدا
                        </span>
                        <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-xl" />
                      </div>

                      {/* Fixed Destination Marker Pin */}
                      {mapTargetMode === 'destination' && (
                        <div
                          style={{ left: `${destPin.x}%`, top: `${destPin.y}%` }}
                          className="absolute -translate-x-1/2 -translate-y-full pointer-events-none z-10 transition-all duration-300 flex flex-col items-center"
                        >
                          <span className="px-2 py-0.5 rounded-full bg-rose-950 border border-rose-500/80 text-[9px] text-rose-300 font-bold shadow-lg whitespace-nowrap mb-0.5">
                            مقصد ۱
                          </span>
                          <div className="w-3.5 h-3.5 rounded-full bg-rose-500 border-2 border-white shadow-xl" />
                        </div>
                      )}

                      {/* Animated Center Targeting Pin (Moves with Tap/Click) */}
                      <div
                        style={{ left: `${targetPin.x}%`, top: `${targetPin.y}%` }}
                        className="absolute -translate-x-1/2 -translate-y-full pointer-events-none z-20 transition-all duration-200 flex flex-col items-center animate-bounce"
                      >
                        <div
                          className={`px-3 py-1 rounded-full text-[10px] font-black shadow-2xl border mb-1 flex items-center gap-1.5 backdrop-blur-md ${
                            mapTargetMode === 'pickup'
                              ? 'bg-emerald-900/95 border-emerald-400 text-white'
                              : 'bg-rose-900/95 border-rose-400 text-white'
                          }`}
                        >
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{mapTargetMode === 'pickup' ? 'مبدا مرسوله روی نقشه' : `مقصد ${activeDestinationIdx + 1} روی نقشه`}</span>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full border-2 border-white shadow-2xl flex items-center justify-center ${
                            mapTargetMode === 'pickup' ? 'bg-emerald-500' : 'bg-rose-500'
                          }`}
                        >
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      </div>

                      {/* Floating GPS Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSimulateGps();
                        }}
                        className={`absolute top-28 left-3 z-30 p-2.5 rounded-2xl border shadow-xl flex items-center gap-1.5 text-xs font-bold transition-all backdrop-blur-md ${
                          isGpsActive
                            ? 'bg-cyan-600 text-white border-cyan-400 ring-2 ring-cyan-400/50'
                            : 'bg-slate-900/90 border-slate-700 text-cyan-300 hover:text-white hover:bg-slate-800'
                        }`}
                        title="موقعیت فعلی من (GPS)"
                      >
                        <LocateFixed className="w-4 h-4 text-cyan-400" />
                        <span className="text-[10px]">موقعیت من</span>
                      </button>
                    </div>

                    {/* FLOATING TOP BAR & GUIDANCE */}
                    <div className="relative z-20 p-3 space-y-2 pointer-events-none">
                      {/* Top Header Card */}
                      <div className="flex items-center justify-between p-2 rounded-2xl bg-slate-900/90 border border-slate-800/80 backdrop-blur-md shadow-lg pointer-events-auto">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-xs shadow-md shadow-indigo-600/30">
                            B
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white flex items-center gap-1.5">
                              <span>باکس • انتخاب روی نقشه</span>
                              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                زنده
                              </span>
                            </div>
                            <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              <span>{nearbyCouriers.length} کاپتان فعال در اطراف شما</span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => setCurrentScreen('C38_account')}
                          className="p-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white relative"
                          title="پروفایل و به‌روزرسانی"
                        >
                          <Package className="w-4 h-4" />
                          {updateInfo?.hasUpdate && !updateInstalled && (
                            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500 border border-slate-900"></span>
                            </span>
                          )}
                        </button>
                      </div>

                      {/* Step Guidance Pill */}
                      <div className="p-2 rounded-2xl bg-slate-900/95 border border-slate-750 backdrop-blur-md shadow-lg flex items-center justify-between pointer-events-auto">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2.5 h-2.5 rounded-full animate-pulse ${
                              mapTargetMode === 'pickup' ? 'bg-emerald-400' : 'bg-rose-500'
                            }`}
                          />
                          <div>
                            <div className="text-xs font-bold text-white">
                              {mapTargetMode === 'pickup'
                                ? 'مرحله ۱ از ۲: انتخاب مبدا روی نقشه'
                                : `مرحله ۲ از ۲: انتخاب مقصد ${activeDestinationIdx + 1} روی نقشه`}
                            </div>
                            <p className="text-[9px] text-slate-400">
                              روی هر نقطه از نقشه لمس کنید تا نشانگر جابجا شود
                            </p>
                          </div>
                        </div>

                        {mapTargetMode === 'destination' && (
                          <button
                            onClick={() => {
                              setMapTargetMode('pickup');
                              setMapPinCoords({ lat: selectedPickup.lat, lng: selectedPickup.lng });
                              SoundEffects.playPop();
                            }}
                            className="px-2 py-1 rounded-xl bg-slate-950 text-slate-300 hover:text-white border border-slate-800 text-[10px] font-bold"
                          >
                            ویرایش مبدا
                          </button>
                        )}
                      </div>

                      {/* Search Places Input (Collapsible/Floating) */}
                      <div className="relative pointer-events-auto">
                        <Search className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="جستجوی خیابان یا محله در نقشه..."
                          className="w-full pr-8 pl-8 py-1.5 rounded-xl bg-slate-900/95 border border-slate-750 backdrop-blur-md text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 shadow-md"
                        />
                        {searchQuery && (
                          <button
                            onClick={() => setSearchQuery('')}
                            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Search Suggestions Dropdown */}
                        {showMapSuggestions && mapSearchSuggestions.length > 0 && (
                          <div className="absolute top-full right-0 left-0 mt-1 z-50 bg-slate-900 border border-slate-750 rounded-xl shadow-2xl overflow-hidden max-h-40 overflow-y-auto">
                            {mapSearchSuggestions.map((item, idx) => (
                              <button
                                key={idx}
                                onClick={() => {
                                  handleSelectHubOnMap(item);
                                  setSearchQuery('');
                                  setShowMapSuggestions(false);
                                }}
                                className="w-full text-right p-2 border-b border-slate-800 hover:bg-slate-800 text-xs flex items-center justify-between"
                              >
                                <div>
                                  <div className="font-bold text-white text-[11px]">{item.title}</div>
                                  <div className="text-[9px] text-slate-400 line-clamp-1">{item.address}</div>
                                </div>
                                <MapPin className="w-3 h-3 text-indigo-400 shrink-0" />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* FLOATING BOTTOM DRAWER / ACTION CARD OVER THE MAP */}
                    <div className="relative z-20 p-3 pointer-events-auto">
                      <div className="p-3.5 rounded-3xl bg-slate-900/95 border border-slate-750 backdrop-blur-md shadow-2xl space-y-2.5">
                        {/* Selected Address Display */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-bold text-white flex items-center gap-1.5">
                              <span
                                className={`w-2.5 h-2.5 rounded-full ${
                                  mapTargetMode === 'pickup' ? 'bg-emerald-400' : 'bg-rose-500'
                                }`}
                              />
                              <span>
                                {mapTargetMode === 'pickup'
                                  ? `مبدا روی نقشه: ${selectedPickup.title}`
                                  : `مقصد ${activeDestinationIdx + 1} روی نقشه: ${
                                      destinations[activeDestinationIdx]?.location.title || 'مقصد'
                                    }`}
                              </span>
                            </span>
                            <span className="text-[9px] font-mono text-indigo-400 bg-indigo-950/60 px-1.5 py-0.5 rounded border border-indigo-500/30">
                              ژئوکدینگ نشان
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-300 leading-snug line-clamp-2 bg-slate-950/60 p-2 rounded-xl border border-slate-800/80">
                            {isResolvingAddress ? (
                              <span className="text-amber-400 animate-pulse">در حال استخراج نام معبر و آدرس از نقشه...</span>
                            ) : mapTargetMode === 'pickup' ? (
                              selectedPickup.address
                            ) : (
                              destinations[activeDestinationIdx]?.location.address || 'آدرس تایید شد'
                            )}
                          </p>
                        </div>

                        {/* Extra Details Inputs */}
                        {mapTargetMode === 'pickup' ? (
                          <div className="flex items-center gap-2 pt-0.5">
                            <span className="text-[10px] text-slate-400 shrink-0">پلاک / واحد مبدا:</span>
                            <input
                              type="text"
                              value={pickupUnit}
                              onChange={(e) => setPickupUnit(e.target.value)}
                              placeholder="مثال: واحد ۴، زنگ ۳"
                              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1 text-xs text-white placeholder-slate-500"
                            />
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-2 pt-0.5">
                            <input
                              type="text"
                              value={destinations[activeDestinationIdx]?.recipientName || ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                setDestinations(
                                  destinations.map((d, i) =>
                                    i === activeDestinationIdx ? { ...d, recipientName: val } : d
                                  )
                                );
                              }}
                              placeholder="نام گیرنده"
                              className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1 text-xs text-white placeholder-slate-500"
                            />
                            <input
                              type="text"
                              value={destinations[activeDestinationIdx]?.recipientPhone || ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                setDestinations(
                                  destinations.map((d, i) =>
                                    i === activeDestinationIdx ? { ...d, recipientPhone: val } : d
                                  )
                                );
                              }}
                              placeholder="شماره موبایل گیرنده"
                              className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1 text-xs text-white placeholder-slate-500 font-mono text-left"
                            />
                          </div>
                        )}

                        {/* PRIMARY ACTION BUTTON (CONFIRM ON MAP) */}
                        <div className="space-y-2 pt-1">
                          {mapTargetMode === 'pickup' ? (
                            <button
                              onClick={handleConfirmCurrentMapSelection}
                              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transform active:scale-98 transition-all"
                            >
                              <Check className="w-4 h-4" />
                              <span>تایید مبدا روی نقشه و انتخاب مقصد ⬅️</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => setCurrentScreen('C08_service')}
                              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-rose-600 via-indigo-600 to-purple-600 hover:from-rose-500 hover:to-indigo-500 text-white font-black text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transform active:scale-98 transition-all"
                            >
                              <Check className="w-4 h-4" />
                              <span>تایید مقصد روی نقشه و انتخاب ناوگان (C08) ⬅️</span>
                            </button>
                          )}

                          {/* SECONDARY OPTIONAL LINK: SAVED ADDRESSES */}
                          <div className="flex items-center justify-between pt-1.5 border-t border-slate-800 text-[10px]">
                            <button
                              onClick={() => {
                                setShowSavedAddressesSheet(true);
                                SoundEffects.playPop();
                              }}
                              className="px-2.5 py-1 rounded-xl bg-indigo-950/70 hover:bg-indigo-900 border border-indigo-500/40 text-indigo-300 font-bold flex items-center gap-1.5 transition-colors"
                            >
                              <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                              <span>استفاده از آدرس‌های ذخیره‌شده (اختیاری)</span>
                            </button>

                            {mapTargetMode === 'destination' && destinations.length < 3 && (
                              <button
                                onClick={handleAddDestination}
                                className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
                              >
                                <Plus className="w-3 h-3" />
                                <span>افزودن مقصد ۲</span>
                              </button>
                            )}

                            <button
                              onClick={() => setCurrentScreen('C07_camera')}
                              className="text-slate-400 hover:text-slate-200 flex items-center gap-1"
                            >
                              <Camera className="w-3 h-3 text-cyan-400" />
                              <span>دوربین</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* MODAL / SHEET: SAVED ADDRESSES (ON DEMAND ONLY) */}
                    {showSavedAddressesSheet && (
                      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 bg-slate-950/85 backdrop-blur-sm animate-in fade-in">
                        <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-3xl p-4 text-slate-100 max-h-[80vh] overflow-y-auto space-y-3 shadow-2xl">
                          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                            <div className="flex items-center gap-2">
                              <Building2 className="w-4 h-4 text-indigo-400" />
                              <span className="text-xs font-bold text-white">انتخاب از بین آدرس‌های ذخیره‌شده:</span>
                            </div>
                            <button
                              onClick={() => setShowSavedAddressesSheet(false)}
                              className="text-slate-400 hover:text-white p-1"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>

                          <p className="text-[10px] text-slate-400">
                            انتخاب روی نقشه پیش‌فرض است؛ در صورت تمایل می‌توانید یکی از آدرس‌های قبلی را انتخاب کنید:
                          </p>

                          <div className="space-y-2 max-h-60 overflow-y-auto">
                            {savedAddressesList.map((addr) => (
                              <div
                                key={addr.id}
                                className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 transition-all space-y-1.5"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-white text-xs">{addr.titleFa}</span>
                                  <span className="text-[9px] text-slate-500 font-mono">
                                    {addr.orderCountUsed} سفارش قبلی
                                  </span>
                                </div>
                                <p className="text-[10px] text-slate-300 line-clamp-1">{addr.fullAddressFa}</p>
                                <div className="flex items-center gap-2 pt-1 border-t border-slate-850">
                                  <button
                                    onClick={() => {
                                      setSelectedPickup({
                                        lat: addr.location.lat,
                                        lng: addr.location.lng,
                                        title: addr.titleFa,
                                        address: addr.fullAddressFa,
                                      });
                                      setPickupUnit(addr.unitNotesFa || 'واحد اصلی');
                                      setMapPinCoords({ lat: addr.location.lat, lng: addr.location.lng });
                                      setShowSavedAddressesSheet(false);
                                      SoundEffects.playPop();
                                      PushNotificationAdapter.dispatch(
                                        'مبدا از آدرس ذخیره‌شده انتخاب شد',
                                        addr.titleFa,
                                        'C05_map'
                                      );
                                    }}
                                    className="flex-1 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 text-[10px] font-bold text-center transition-all"
                                  >
                                    🟢 تنظیم به عنوان مبدا
                                  </button>
                                  <button
                                    onClick={() => {
                                      setDestinations((prev) =>
                                        prev.map((d, i) =>
                                          i === activeDestinationIdx
                                            ? {
                                                ...d,
                                                location: {
                                                  lat: addr.location.lat,
                                                  lng: addr.location.lng,
                                                  title: addr.titleFa,
                                                  address: addr.fullAddressFa,
                                                },
                                                recipientName: addr.contactName,
                                                recipientPhone: addr.contactPhone,
                                                unitNotes: addr.unitNotesFa,
                                              }
                                            : d
                                        )
                                      );
                                      setMapPinCoords({ lat: addr.location.lat, lng: addr.location.lng });
                                      setShowSavedAddressesSheet(false);
                                      SoundEffects.playPop();
                                      PushNotificationAdapter.dispatch(
                                        `مقصد ${activeDestinationIdx + 1} از آدرس ذخیره‌شده انتخاب شد`,
                                        addr.titleFa,
                                        'C05_map'
                                      );
                                    }}
                                    className="flex-1 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 text-[10px] font-bold text-center transition-all"
                                  >
                                    🔴 تنظیم به عنوان مقصد
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                            <button
                              onClick={() => {
                                setShowSavedAddressesSheet(false);
                                setShowAddressBookModal(true);
                              }}
                              className="text-[10px] text-indigo-400 hover:underline flex items-center gap-1 font-bold"
                            >
                              <Plus className="w-3 h-3" />
                              <span>مدیریت کامل دفترچه آدرس‌ها</span>
                            </button>
                            <button
                              onClick={() => setShowSavedAddressesSheet(false)}
                              className="px-3 py-1 rounded-xl bg-slate-800 text-slate-300 text-[10px]"
                            >
                              بستن
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* SCREEN: C07_camera (Camera AR, Standard Presets & Shetab Card Calibration) */}
              {currentScreen === 'C07_camera' && (
                <div className="flex-1 flex flex-col justify-between p-3.5 space-y-2.5 overflow-y-auto">
                  {/* Top Bar */}
                  <div className="flex items-center justify-between pb-2 border-b border-slate-850">
                    <button
                      onClick={() => setCurrentScreen('C05_map')}
                      className="p-1 rounded-lg text-slate-400 hover:text-white"
                      title="بازگشت به نقشه"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <div className="text-center">
                      <span className="text-xs font-bold text-white block">تعیین ابعاد و مشخصات مرسوله</span>
                      <span className="text-[9px] text-indigo-300">ساده‌ترین، سریع‌ترین و دقیق‌ترین روش لجستیک</span>
                    </div>
                    <button
                      onClick={() => {
                        SoundEffects.playPop();
                        PushNotificationAdapter.dispatch(
                          'راهنمای تعیین ابعاد مرسوله',
                          'بهترین روش: انتخاب کارتن‌های استاندارد است. برای کارتن‌های متفرقه، کارت عابربانک شتاب را روی جعبه بگذارید و اسکن کنید.',
                          'C07_camera'
                        );
                      }}
                      className="p-1 rounded-lg text-slate-400 hover:text-indigo-400"
                      title="راهنما"
                    >
                      <HelpCircle className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Mode Selector Tabs (3 Strategies) */}
                  <div className="grid grid-cols-3 gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-[10px] font-bold">
                    <button
                      onClick={() => {
                        setC07Tab('presets');
                        SoundEffects.playPop();
                      }}
                      className={`py-1.5 px-1 rounded-lg flex items-center justify-center gap-1 transition-all ${
                        c07Tab === 'presets'
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Package className="w-3 h-3" />
                      <span>کارتن استاندارد</span>
                    </button>

                    <button
                      onClick={() => {
                        setC07Tab('camera_ai');
                        SoundEffects.playPop();
                      }}
                      className={`py-1.5 px-1 rounded-lg flex items-center justify-center gap-1 transition-all ${
                        c07Tab === 'camera_ai'
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Camera className="w-3 h-3" />
                      <span>دوربین و هوش AR</span>
                    </button>

                    <button
                      onClick={() => {
                        setC07Tab('manual');
                        SoundEffects.playPop();
                      }}
                      className={`py-1.5 px-1 rounded-lg flex items-center justify-center gap-1 transition-all ${
                        c07Tab === 'manual'
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Sliders className="w-3 h-3" />
                      <span>دستی (L×W×H)</span>
                    </button>
                  </div>

                  {/* TAB 1: Fast Presets (Most popular & fastest in practice) */}
                  {c07Tab === 'presets' && (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between px-1">
                        <span className="text-[10px] font-bold text-slate-300">سایزهای استاندارد پستی و بازاری:</span>
                        <span className="text-[9px] text-emerald-400 font-medium">⚡ انتخاب با ۱ کلیک</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-0.5">
                        {IRAN_STANDARD_PARCEL_PRESETS.map((preset) => {
                          const isSelected = selectedPresetId === preset.id;
                          return (
                            <button
                              key={preset.id}
                              onClick={() => handleSelectPreset(preset)}
                              className={`p-2 rounded-xl border text-right transition-all flex flex-col justify-between ${
                                isSelected
                                  ? 'bg-indigo-950/80 border-indigo-500 shadow-sm shadow-indigo-500/20 ring-1 ring-indigo-500'
                                  : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 text-slate-300'
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                <span className={`text-[10px] font-bold ${isSelected ? 'text-indigo-300' : 'text-white'}`}>
                                  {preset.nameFa}
                                </span>
                                {isSelected ? (
                                  <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                                ) : (
                                  <Package className="w-3 h-3 text-slate-500 shrink-0" />
                                )}
                              </div>
                              <span className="text-[9px] text-slate-400 font-mono mt-0.5 block">
                                {preset.dimensionsFa}
                              </span>
                              <div className="mt-1 pt-1 border-t border-slate-800/60 flex items-center justify-between text-[8px]">
                                <span className="text-slate-400">{preset.recommendedFleetLabelFa}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* TAB 2: Camera & Shetab Card Reference Calibration */}
                  {c07Tab === 'camera_ai' && (
                    <div className="space-y-2">
                      {/* Viewfinder View */}
                      <div className="relative h-36 rounded-2xl bg-slate-950 border-2 border-indigo-500/40 overflow-hidden flex items-center justify-center">
                        {/* Live Video Feed or Laser Canvas */}
                        {isRealCameraActive ? (
                          <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-indigo-950/30 to-slate-900 flex items-center justify-center">
                            <div className="text-center space-y-1">
                              <div className="w-10 h-10 mx-auto rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center">
                                <Camera className="w-5 h-5 text-indigo-400" />
                              </div>
                              <p className="text-[9px] text-slate-400">دوربین مجازی AR آماده اسکن است</p>
                            </div>
                          </div>
                        )}

                        {/* AR Reticle Overlay & Box Wireframe */}
                        <div className="absolute inset-3 border border-dashed border-indigo-400/60 rounded-xl pointer-events-none flex items-center justify-center">
                          {/* Box Bounding Outline */}
                          <div className="w-24 h-16 border-2 border-emerald-400/80 rounded-lg flex flex-col items-center justify-center bg-emerald-500/10 relative">
                            <span className="text-[8px] font-mono text-emerald-300 font-bold bg-slate-950/80 px-1 rounded -top-2 absolute">
                              {lengthInput}×{widthInput}×{heightInput} cm
                            </span>
                            <Package className="w-5 h-5 text-emerald-300 animate-pulse" />

                            {/* Reference Card Ghost Tag */}
                            <div className="absolute -bottom-2.5 right-1 px-1.5 py-0.5 rounded bg-amber-500/90 text-slate-950 font-bold text-[7px] flex items-center gap-0.5 shadow">
                              <CreditCard className="w-2 h-2" />
                              <span>کارت شتاب (مرجع)</span>
                            </div>
                          </div>
                        </div>

                        {/* Top live badge */}
                        <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none text-[8px]">
                          <span className="px-1.5 py-0.5 rounded bg-slate-950/80 text-indigo-300 font-mono border border-slate-800">
                            سنسور: {isRealCameraActive ? 'وب‌کم فیزیکی فعال' : 'شبیه‌ساز سه‌بعدی'}
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-emerald-950/90 text-emerald-400 font-mono border border-emerald-800">
                            دقت کالیبراسیون: ۹۷٪
                          </span>
                        </div>

                        {/* Bottom action bar */}
                        <div className="absolute bottom-2 left-2 right-2 flex justify-between gap-1.5">
                          {!isRealCameraActive ? (
                            <button
                              onClick={startRealCamera}
                              className="py-1 px-2 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-300 text-[9px] font-medium flex items-center gap-1"
                            >
                              <Camera className="w-3 h-3 text-indigo-400" />
                              <span>روشن کردن دوربین</span>
                            </button>
                          ) : (
                            <button
                              onClick={stopRealCamera}
                              className="py-1 px-2 rounded-lg bg-red-950/80 border border-red-800 text-red-300 text-[9px] font-medium flex items-center gap-1"
                            >
                              <X className="w-3 h-3" />
                              <span>بستن وب‌کم</span>
                            </button>
                          )}

                          <button
                            onClick={handleScanWithCardReference}
                            disabled={isScanningAr}
                            className="py-1 px-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-[10px] font-bold shadow-md flex items-center gap-1"
                          >
                            <CreditCard className="w-3 h-3" />
                            <span>{isScanningAr ? 'در حال کالیبره...' : 'اسکن با کارت شتاب'}</span>
                          </button>

                          <button
                            onClick={handleSimulateArScan}
                            disabled={isScanningAr}
                            className="py-1 px-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[9px] font-bold shadow flex items-center gap-1"
                          >
                            <Sparkles className="w-2.5 h-2.5" />
                            <span>اسکن AR</span>
                          </button>
                        </div>
                      </div>

                      {/* Error notification if physical camera failed */}
                      {realCameraError && (
                        <p className="text-[9px] text-amber-400/90 bg-amber-950/30 p-1.5 rounded-lg border border-amber-800/40">
                          {realCameraError}
                        </p>
                      )}

                      {/* Golden Rule Info Box */}
                      <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-[9px] text-slate-300 space-y-1">
                        <div className="flex items-center gap-1 text-amber-300 font-bold">
                          <CreditCard className="w-3 h-3" />
                          <span>چرا کارت بانکی شتاب؟ (سریع‌ترین راه اندازه‌گیری دوربین)</span>
                        </div>
                        <p className="text-slate-400 leading-relaxed text-[8.5px]">
                          دوربین معمولی به خودی خود خط‌کش ندارد؛ اما سایز کارت عابربانک دقیقا ۸۵.۶ در ۵۳.۹۸ میلی‌متر است. با قرار دادن کارت روی کارتن، دوربین مقیاس دقیق سانتیمتر را در ۱ ثانیه بدون خطا محاسبه می‌کند.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: Manual Entry */}
                  {c07Tab === 'manual' && (
                    <div className="bg-slate-900/90 p-2.5 rounded-2xl border border-slate-800 space-y-2 text-xs">
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="text-[9px] text-slate-400 block mb-0.5">طول (L):</label>
                          <div className="flex items-center bg-slate-950 border border-slate-800 rounded">
                            <input
                              type="number"
                              value={lengthInput}
                              onChange={(e) => handleDimensionChange(Number(e.target.value), widthInput, heightInput)}
                              className="w-full bg-transparent p-1 text-[11px] font-mono text-center text-white outline-none"
                            />
                            <span className="text-[8px] text-slate-500 pl-1">cm</span>
                          </div>
                        </div>
                        <div>
                          <label className="text-[9px] text-slate-400 block mb-0.5">عرض (W):</label>
                          <div className="flex items-center bg-slate-950 border border-slate-800 rounded">
                            <input
                              type="number"
                              value={widthInput}
                              onChange={(e) => handleDimensionChange(lengthInput, Number(e.target.value), heightInput)}
                              className="w-full bg-transparent p-1 text-[11px] font-mono text-center text-white outline-none"
                            />
                            <span className="text-[8px] text-slate-500 pl-1">cm</span>
                          </div>
                        </div>
                        <div>
                          <label className="text-[9px] text-slate-400 block mb-0.5">ارتفاع (H):</label>
                          <div className="flex items-center bg-slate-950 border border-slate-800 rounded">
                            <input
                              type="number"
                              value={heightInput}
                              onChange={(e) => handleDimensionChange(lengthInput, widthInput, Number(e.target.value))}
                              className="w-full bg-transparent p-1 text-[11px] font-mono text-center text-white outline-none"
                            />
                            <span className="text-[8px] text-slate-500 pl-1">cm</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                        <span className="text-[10px] text-slate-300 font-medium">مرسوله شکستنی / حساس:</span>
                        <input
                          type="checkbox"
                          checked={isFragile}
                          onChange={(e) => setIsFragile(e.target.checked)}
                          className="rounded accent-indigo-600 w-3.5 h-3.5"
                        />
                      </div>
                    </div>
                  )}

                  {/* Summary Result Card */}
                  <div className="p-2.5 rounded-2xl bg-gradient-to-r from-indigo-950/60 to-slate-900 border border-indigo-500/40 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-white font-bold flex items-center gap-1">
                        <Package className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{parcelAnalysis.categoryLabelFa || parcelAnalysis.weightTierLabelFa}</span>
                      </span>
                      <span className="text-emerald-400 font-mono text-[10px]">
                        {lengthInput} × {widthInput} × {heightInput} cm
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[9px] text-slate-300 pt-1 border-t border-indigo-500/20">
                      <span className="flex items-center gap-1 text-indigo-300">
                        {parcelAnalysis.recommendedFleet === 'pickup_van' ? (
                          <Truck className="w-3 h-3 text-amber-400" />
                        ) : (
                          <Bike className="w-3 h-3 text-indigo-400" />
                        )}
                        <span>ناوگان الزامی: <strong>{parcelAnalysis.recommendedFleetLabelFa}</strong></span>
                      </span>
                      <span className="text-slate-400 font-mono">
                        وزن حجمی: {parcelAnalysis.volumetricWeightKg} kg
                      </span>
                    </div>
                  </div>

                  {/* Confirm & Proceed Button */}
                  <button
                    onClick={() => {
                      SoundEffects.playSuccess();
                      setCurrentScreen('C08_service');
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/30"
                  >
                    <span>تایید مشخصات بسته و انتخاب زمان تحویل</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* SCREEN: C08_service (Select Fleet & Scheduled Delivery) */}
              {currentScreen === 'C08_service' && (
                <div className="flex-1 flex flex-col justify-between p-4 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-850">
                    <button
                      onClick={() => setCurrentScreen('C05_map')}
                      className="p-1 rounded-lg text-slate-400 hover:text-white"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-bold text-white">صفحه C08/09 • زمان تحویل و ناوگان</span>
                    <span className="w-4" />
                  </div>

                  {/* Scheduled vs Immediate Option (DispatchScheduler) */}
                  <div className="p-2.5 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
                    <label className="text-[10px] text-slate-400 font-bold block">زمان‌بندی اعزام کاپتان:</label>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        onClick={() => setScheduleType('immediate')}
                        className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                          scheduleType === 'immediate'
                            ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                            : 'bg-slate-950 text-slate-400 border-slate-800'
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>ارسال فوری (هم‌اکنون)</span>
                      </button>
                      <button
                        onClick={() => setScheduleType('scheduled')}
                        className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                          scheduleType === 'scheduled'
                            ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                            : 'bg-slate-950 text-slate-400 border-slate-800'
                        }`}
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>سفارش زمان‌بندی‌شده</span>
                      </button>
                    </div>

                    {scheduleType === 'scheduled' && (
                      <div className="pt-1.5 space-y-1">
                        <span className="text-[9px] text-indigo-300 block">انتخاب بازه تحویل رزرو شده:</span>
                        <select
                          value={selectedSlotId}
                          onChange={(e) => setSelectedSlotId(e.target.value)}
                          className="w-full bg-slate-950 border border-indigo-500/40 rounded-xl px-2 py-1.5 text-[11px] text-white focus:outline-none"
                        >
                          {timeSlots.map((slot) => (
                            <option key={slot.id} value={slot.id}>
                              {slot.label} ({slot.period})
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  {/* Fleet Selector */}
                  <div className="space-y-1.5">
                    {[
                      {
                        id: 'box_bike',
                        title: 'موتور باکس‌دار عایق (پیشنهادی)',
                        desc: 'محافظ ضد باران و ضربه',
                        icon: Bike,
                        price: baseVehiclePrice,
                      },
                      {
                        id: 'regular_bike',
                        title: 'موتور معمولی (سریع)',
                        desc: 'پاکت و مرسولات سبک',
                        icon: Bike,
                        price: Math.round(baseVehiclePrice * 0.9),
                      },
                      {
                        id: 'pickup_van',
                        title: 'وانت بار سبک',
                        desc: 'بسته‌های حجیم و سنگین',
                        icon: Package,
                        price: Math.round(baseVehiclePrice * 2.1),
                      },
                    ].map((item) => {
                      const Icon = item.icon;
                      const isSel = selectedVehicle === item.id;
                      return (
                        <div
                          key={item.id}
                          onClick={() => setSelectedVehicle(item.id as any)}
                          className={`p-2 rounded-xl border cursor-pointer transition-all ${
                            isSel ? 'bg-indigo-600/20 border-indigo-500 shadow-md' : 'bg-slate-900 border-slate-800'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="p-1 rounded-lg bg-indigo-500/20 text-indigo-400">
                                <Icon className="w-3.5 h-3.5" />
                              </div>
                              <div>
                                <div className="text-[11px] font-bold text-white">{item.title}</div>
                                <div className="text-[9px] text-slate-400">{item.desc}</div>
                              </div>
                            </div>
                            <div className="text-xs font-mono font-bold text-indigo-300">
                              {new Intl.NumberFormat('fa-IR').format(item.price)} ت
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Guarantee & Stop Duration */}
                  <div className="bg-slate-900/90 p-2.5 rounded-2xl border border-slate-800 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-[11px] font-bold text-white">تحویل تضمینی کالا + بیمه کامل</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={isGuaranteed}
                        onChange={(e) => setIsGuaranteed(e.target.checked)}
                        className="rounded accent-indigo-600 w-3.5 h-3.5"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <button
                      onClick={handleStartCourierSearch}
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transform active:scale-98 transition-all"
                    >
                      <Bike className="w-4 h-4 animate-bounce" />
                      <span>ثبت درخواست و اعزام نزدیک‌ترین کاپتان</span>
                    </button>

                    <div className="flex items-center justify-between px-1">
                      <span className="text-[9px] text-emerald-400">
                        ✓ پرداخت فقط پس از پیدا شدن کاپتان و دریافت فیزیکی بسته
                      </span>
                      <button
                        onClick={() => {
                          setCurrentScreen('C10_checkout');
                          SoundEffects.playPop();
                        }}
                        className="text-[10px] text-indigo-400 hover:text-indigo-300 underline"
                      >
                        پیش‌فاکتور (C10)
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* SCREEN: C10_checkout (Invoice Breakdown & Cash / Wallet Selection) */}
              {currentScreen === 'C10_checkout' && (
                <div className="flex-1 flex flex-col justify-between p-4 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-850">
                    <button
                      onClick={() => setCurrentScreen('C08_service')}
                      className="p-1 rounded-lg text-slate-400 hover:text-white"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-bold text-white">صفحه C10 • پیش‌فاکتور و تسویه</span>
                    <span className="w-4" />
                  </div>

                  {/* Itemized Pricing Breakdown */}
                  <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 space-y-1.5 text-xs">
                    <div className="flex justify-between text-[11px] text-slate-300">
                      <span>کرایه مسافت ({distanceKm} کیلومتر):</span>
                      <span className="font-mono">{new Intl.NumberFormat('fa-IR').format(dispatchPricing.distanceFare + dispatchPricing.baseFare)} ت</span>
                    </div>

                    {destinations.length > 1 && (
                      <div className="flex justify-between text-[11px] text-cyan-300">
                        <span>هزینه مقاصد اضافی ({destinations.length - 1} مقصد):</span>
                        <span className="font-mono">+{new Intl.NumberFormat('fa-IR').format(dispatchPricing.multiDropFare)} ت</span>
                      </div>
                    )}

                    {dispatchPricing.surgeAmount > 0 && (
                      <div className="flex justify-between text-[11px] text-amber-300">
                        <span>ضریب ترافیک/آب‌وهوا ({dispatchPricing.surgeMultiplier}×):</span>
                        <span className="font-mono">+{new Intl.NumberFormat('fa-IR').format(dispatchPricing.surgeAmount)} ت</span>
                      </div>
                    )}

                    {isGuaranteed && (
                      <div className="flex justify-between text-[11px] text-slate-300">
                        <span>بیمه و تضمین سلامت کالا:</span>
                        <span className="font-mono">+{new Intl.NumberFormat('fa-IR').format(guaranteePrice)} ت</span>
                      </div>
                    )}

                    {discountAmount > 0 && (
                      <div className="flex justify-between text-[11px] text-emerald-400">
                        <span>تخفیف کوپن ({appliedPromo?.promoCode}):</span>
                        <span className="font-mono">-{new Intl.NumberFormat('fa-IR').format(discountAmount)} ت</span>
                      </div>
                    )}

                    <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                      <span className="font-bold text-white text-xs">مبلغ قابل پرداخت:</span>
                      <span className="font-bold text-base font-mono text-emerald-400">
                        {new Intl.NumberFormat('fa-IR').format(totalPrice)} تومان
                      </span>
                    </div>
                  </div>

                  {/* Payment Method Selector (No IPG) */}
                  <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
                    <span className="text-[11px] font-bold text-white block">روش پرداخت (بدون درگاه آنلاین):</span>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <button
                        onClick={() => setSelectedPaymentMethod('cash_on_delivery')}
                        className={`p-2 rounded-xl border text-right transition-all ${
                          selectedPaymentMethod === 'cash_on_delivery'
                            ? 'bg-indigo-600/20 border-indigo-500 text-white'
                            : 'bg-slate-950 border-slate-800 text-slate-400'
                        }`}
                      >
                        <div className="font-bold text-[11px]">نقدی / کارتخوان</div>
                        <div className="text-[9px] text-slate-400">پرداخت به کاپتان در محل</div>
                      </button>

                      <button
                        onClick={() => setSelectedPaymentMethod('wallet_credit')}
                        className={`p-2 rounded-xl border text-right transition-all ${
                          selectedPaymentMethod === 'wallet_credit'
                            ? 'bg-indigo-600/20 border-indigo-500 text-white'
                            : 'bg-slate-950 border-slate-800 text-slate-400'
                        }`}
                      >
                        <div className="font-bold text-[11px]">کیف پول اعتباری</div>
                        <div className="text-[9px] text-emerald-400 font-mono">
                          {new Intl.NumberFormat('fa-IR').format(creditBalance)} ت
                        </div>
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[10px] text-slate-400">
                      <span>تسویه‌کننده کرایه:</span>
                      <div className="flex gap-2">
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="radio"
                            name="payer"
                            checked={payerType === 'sender'}
                            onChange={() => setPayerType('sender')}
                            className="accent-indigo-600"
                          />
                          <span>فرستنده (مبدا)</span>
                        </label>
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="radio"
                            name="payer"
                            checked={payerType === 'receiver'}
                            onChange={() => setPayerType('receiver')}
                            className="accent-indigo-600"
                          />
                          <span>پس‌کرایه (گیرنده)</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Goods COD Escrow Option */}
                  <div className="p-2.5 bg-amber-950/20 rounded-2xl border border-amber-500/30 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Coins className="w-3.5 h-3.5 text-amber-400" />
                        <span className="text-[10px] font-bold text-white">دریافت وجه کالا در محل (COD)</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={isCodEnabled}
                        onChange={(e) => setIsCodEnabled(e.target.checked)}
                        className="rounded accent-amber-500 w-3.5 h-3.5 cursor-pointer"
                      />
                    </div>
                    {isCodEnabled && (
                      <div className="pt-1.5 border-t border-amber-500/20 space-y-1">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-slate-300">مبلغ دریافتی کالا:</span>
                          <span className="font-mono text-amber-300 font-bold">{codAmountToman.toLocaleString('fa-IR')} تومان</span>
                        </div>
                        <div className="text-[9px] text-emerald-400 leading-tight">
                          واریز مستقیم به کیف‌پول فرستنده پس از دریافت از خریدار توسط کاپتان (امانت‌داری تضمین‌شده)
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={packageReceivedByCourier ? handlePayOrder : handleStartCourierSearch}
                    className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2"
                  >
                    <span>
                      {packageReceivedByCourier
                        ? `⚡ اوکی کردن واریزی کرایه (${new Intl.NumberFormat('fa-IR').format(totalPrice)} ت)`
                        : 'ثبت درخواست و اعزام کاپتان (پرداخت پس از دریافت بسته)'}
                    </span>
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* SCREEN: C15_finding (Captain Radar Matching) */}
              {currentScreen === 'C15_finding' && (
                <div className="flex-1 flex flex-col justify-between p-4 space-y-4 text-center">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-850">
                    <button
                      onClick={() => setCurrentScreen('C05_map')}
                      className="p-1 rounded-lg text-slate-400 hover:text-white"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-bold text-white">صفحه C15 • رادار اعزام کاپتان</span>
                    <span className="w-4" />
                  </div>

                  <div className="my-auto space-y-4">
                    <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full bg-indigo-600/10 border border-indigo-500/20 animate-ping" />
                      <div className="absolute inset-2 rounded-full bg-indigo-600/20 border border-indigo-500/40 animate-pulse" />
                      <div className="w-14 h-14 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-600/40">
                        <Bike className="w-7 h-7" />
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-white">در حال تطبیق با نزدیک‌ترین کاپتان...</h3>
                      <p className="text-[11px] text-slate-400 mt-1">
                        اعلام درخواست به کاپتان‌های فعال در محدوده {selectedPickup.title}
                      </p>
                    </div>

                    {/* Pre-approved Test Captain Card (09399887782) */}
                    <div className="p-3 rounded-2xl bg-slate-900 border-2 border-emerald-500/50 text-right space-y-2 shadow-lg shadow-emerald-950/30">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>کاپتان تایید شده سیستم: ۰۹۳۹۹۸۸۷۷۸۲</span>
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono font-bold">
                          CAP-9882
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-300 flex items-center justify-between">
                        <span>موتور آپاچی ۲۰۰ • پلاک ۱۲۳-۷۸ ب ۹۹</span>
                        <span className="text-amber-400 font-bold">★ ۵.۰ (عالی)</span>
                      </div>
                      <p className="text-[9px] text-emerald-400 leading-tight">
                        ✓ شماره 09399887782 به عنوان کاپتان تستی در سیستم تایید شد و آماده آزمون سفر است.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleCourierAccepted}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transform active:scale-98 transition-all"
                  >
                    <span>تایید کاپتان (09399887782) و شروع سفر</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* SCREEN: C18_tracking (Live Tracking, Multi-Destination Stops & Payment after Pickup) */}
              {currentScreen === 'C18_tracking' && (
                <div className="flex-1 flex flex-col justify-between p-4 space-y-3">
                  {/* Captain Profile Header */}
                  <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-full bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold">
                        <Bike className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span>کاپتان مهدی (کد CAP-9882)</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                            تایید شده
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-300 flex items-center gap-1 font-mono">
                          <span className="text-emerald-400 font-bold">09399887782</span>
                          <span>•</span>
                          <span>موتور آپاچی ۲۰۰</span>
                          <span>•</span>
                          <span className="text-amber-400">★ ۵.۰</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setShowWebTrackingModal(true)}
                        className="p-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white shadow transition-colors"
                        title="اشتراک لینک زنده وب با گیرنده (بدون نیاز به نصب)"
                      >
                        <Globe className="w-3.5 h-3.5" />
                      </button>
                      <a
                        href="tel:09399887782"
                        className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow flex items-center justify-center"
                        title="تماس مستقیم با کاپتان: 09399887782"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => setShowChatModal(true)}
                        className="p-2 rounded-xl bg-indigo-600 text-white shadow relative"
                        title="چت با کاپتان و پشتیبانی"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span className="w-2 h-2 rounded-full bg-rose-500 absolute -top-0.5 -right-0.5" />
                      </button>
                    </div>
                  </div>

                  {/* STAGE 1: Captain Heading to Pickup (Package NOT picked up yet) */}
                  {!packageReceivedByCourier && (
                    <div className="p-3.5 rounded-2xl bg-amber-950/40 border-2 border-amber-500/50 space-y-2.5 animate-in fade-in">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-amber-400 animate-spin" />
                          <span>کاپتان در مسیر مبدا جهت دریافت بسته</span>
                        </span>
                        <span className="text-[9px] font-mono text-amber-300 bg-amber-950/80 border border-amber-500/40 px-2 py-0.5 rounded font-bold">
                          کرایه هنوز کسر نشده
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-300 leading-relaxed">
                        طبق قانون امنیتی باکس: هیچ هزینه‌ای تا قبل از رویت کاپتان و دریافت فیزیکی بسته از شما کسر نخواهد شد.
                      </p>
                      <button
                        onClick={handleConfirmPackageReceived}
                        className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-amber-500/25 flex items-center justify-center gap-2 transform active:scale-98 transition-all"
                      >
                        <Package className="w-4 h-4" />
                        <span>📦 کاپتان رسید و بسته را تحویل گرفت (تایید دریافت فیزیکی)</span>
                      </button>
                    </div>
                  )}

                  {/* STAGE 2: Package Picked Up → Prompt to OK/Confirm Payment */}
                  {packageReceivedByCourier && !isFarePaid && (
                    <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-950/60 via-slate-900 to-indigo-950/60 border-2 border-emerald-500/70 shadow-lg shadow-emerald-950/50 space-y-2.5 animate-in zoom-in-95">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                          </span>
                          <span className="text-xs font-bold text-white flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span>بسته تحویل کاپتان شد • واریزی را اوکی کنید</span>
                          </span>
                        </div>
                        <span className="text-[9px] font-mono text-emerald-400 font-bold bg-emerald-950/70 border border-emerald-500/40 px-2 py-0.5 rounded">
                          بارکد تایید شد
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5 text-xs">
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-slate-300">مبلغ کرایه سفر:</span>
                          <span className="font-bold font-mono text-emerald-400 text-sm">
                            {new Intl.NumberFormat('fa-IR').format(totalPrice)} تومان
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800/60">
                          <span>نحوه تسویه:</span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setSelectedPaymentMethod('wallet_credit')}
                              className={`px-2 py-0.5 rounded text-[10px] border transition-all ${
                                selectedPaymentMethod === 'wallet_credit'
                                  ? 'bg-indigo-600/30 border-indigo-400 text-white font-bold'
                                  : 'border-slate-800 text-slate-400'
                              }`}
                            >
                              کیف پول ({new Intl.NumberFormat('fa-IR').format(creditBalance)} ت)
                            </button>
                            <button
                              onClick={() => setSelectedPaymentMethod('cash_on_delivery')}
                              className={`px-2 py-0.5 rounded text-[10px] border transition-all ${
                                selectedPaymentMethod === 'cash_on_delivery'
                                  ? 'bg-indigo-600/30 border-indigo-400 text-white font-bold'
                                  : 'border-slate-800 text-slate-400'
                              }`}
                            >
                              کارتخوان کاپتان
                            </button>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={handlePayOrder}
                        className="w-full py-3 px-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-white text-xs font-black shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 transform active:scale-98 transition-all"
                      >
                        <CheckCircle2 className="w-4 h-4 animate-bounce" />
                        <span>⚡ اوکی کردن واریزی و پرداخت کرایه ({new Intl.NumberFormat('fa-IR').format(totalPrice)} ت)</span>
                      </button>
                      <p className="text-[9px] text-center text-slate-400">
                        تضمین امنیت معامله: تسویه دقیقا پس از دریافت فیزیکی بسته توسط کاپتان
                      </p>
                    </div>
                  )}

                  {/* STAGE 3: Fare Paid → In-Transit to Destinations */}
                  {isFarePaid && (
                    <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/40 flex items-center justify-between text-xs animate-in fade-in">
                      <span className="text-emerald-300 font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>واریزی کرایه تایید شد • کاپتان در مسیر مقصد است</span>
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30 font-bold">
                        تسویه موفق
                      </span>
                    </div>
                  )}

                  {/* Multi-Destination Journey Progress */}
                  <div className="p-3 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-300 font-bold">پیشرفت سفر کاپتان:</span>
                      <span className="text-indigo-400 font-mono font-bold">زمان تخمینی: ۸ دقیقه</span>
                    </div>

                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${trackProgress}%` }}
                      />
                    </div>

                    <div className="space-y-1 pt-1">
                      {destinations.map((d, i) => (
                        <div key={d.id} className="flex items-center justify-between text-[10px]">
                          <span className="text-slate-300 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-rose-400" />
                            <span>توقف {i + 1}: {d.location.title}</span>
                          </span>
                          <span className="text-emerald-400 font-bold">در مسیر تحویل</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery Handshake Code Box (C30) */}
                  <div className="p-3 rounded-2xl bg-indigo-950/40 border border-indigo-500/40 text-center space-y-1">
                    <div className="text-[10px] text-slate-300">کد امنیتی ۴ رقمی تحویل (به گیرنده و کاپتان ارائه دهید):</div>
                    <div className="text-2xl font-black font-mono tracking-widest text-indigo-400">۴۸۹۲</div>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() => setTrackProgress((p) => Math.min(100, p + 25))}
                      className="w-full py-1.5 px-3 rounded-xl bg-slate-900 text-slate-400 hover:text-white text-[11px]"
                    >
                      شبیه‌سازی حرکت موتور کاپتان روی مسیر
                    </button>

                    <button
                      onClick={() => setCurrentScreen('C30_delivered')}
                      className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30"
                    >
                      تکمیل تحویل نهایی و مشاهده گزارش PoD (C30/31)
                    </button>
                  </div>
                </div>
              )}

              {/* SCREEN: C30_delivered (PoD with Digital Signature & Photo) */}
              {currentScreen === 'C30_delivered' && (
                <div className="flex-1 flex flex-col justify-between p-4 space-y-3">
                  <div className="text-center py-1">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-1.5 border border-emerald-500/30">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h3 className="text-xs font-bold text-white">مرسوله با موفقیت تحویل داده شد</h3>
                    <p className="text-[10px] text-slate-400">کد ۴ رقمی تایید شد • فاکتور و PoD صادر گردید</p>
                  </div>

                  {/* Proof of Delivery (PoD) Card */}
                  <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>سند رسمی اثبات تحویل (PoD)</span>
                      </span>
                      <span className="text-[9px] font-mono text-slate-400">{podRecord.deliveredAt}</span>
                    </div>

                    <div className="flex gap-2.5 items-center">
                      {/* Photo PoD */}
                      <div className="w-16 h-16 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden shrink-0 relative">
                        <img
                          src={podRecord.photoDataUrl}
                          alt="Parcel Photo"
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-0 inset-x-0 bg-slate-950/80 text-[7px] text-center text-slate-300">
                          عکس تحویل
                        </span>
                      </div>

                      {/* Signature PoD */}
                      <div className="flex-1 space-y-1">
                        <div className="text-[10px] text-slate-300">
                          تحویل‌گیرنده: <strong>{destinations[0]?.recipientName}</strong>
                        </div>
                        <div className="text-[9px] text-slate-400">
                          مهر مکانی: {podRecord.geoSeal.lat.toFixed(4)}, {podRecord.geoSeal.lng.toFixed(4)} (دقت ۴.۵م)
                        </div>
                        <div className="p-1 rounded bg-slate-950 border border-slate-800 flex items-center justify-between">
                          <span className="text-[9px] text-indigo-300 flex items-center gap-1">
                            <PenTool className="w-2.5 h-2.5" />
                            <span>امضای لمسی دیجیتال ثبت شد</span>
                          </span>
                          <Check className="w-3 h-3 text-emerald-400" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-1.5">
                    <button
                      onClick={() => setShowInvoiceModal(true)}
                      className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-indigo-300 text-[11px] font-bold flex items-center justify-center gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>مشاهده فاکتور رسمی استاندارد (C13)</span>
                    </button>

                    <button
                      onClick={() => {
                        setDestinations([
                          {
                            id: 'dest-1',
                            location: {
                              lat: 35.7878,
                              lng: 51.3732,
                              title: 'سعادت‌آباد (مقصد ۱)',
                              address: 'تهران، سعادت‌آباد، بلوار فرهنگ، پلاک ۸',
                            },
                            recipientName: 'سعید رضوانی',
                            recipientPhone: '۰۹۱۲۹۹۸۸۷۷۶',
                            unitNotes: 'زنگ ۸، لابی',
                            status: 'pending',
                          },
                        ]);
                        setCurrentScreen('C05_map');
                      }}
                      className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
                    >
                      ثبت سفارش جدید در صفحه اصلی
                    </button>
                  </div>
                </div>
              )}

              {/* SCREEN: C02_login (Kavenegar OTP & Terms Modal) */}
              {currentScreen === 'C02_login' && (
                <div className="flex-1 flex flex-col justify-between p-4 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-850">
                    <button
                      onClick={() => setCurrentScreen('C05_map')}
                      className="p-1 rounded-lg text-slate-400 hover:text-white"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-bold text-white">صفحه C02 / C03 • ورود با پیامک</span>
                    <span className="w-4" />
                  </div>

                  <div className="space-y-3 py-2">
                    <div className="text-right">
                      <label className="text-xs text-slate-300 font-medium block mb-1.5">
                        شماره تلفن همراه خود را وارد کنید:
                      </label>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-sm font-mono text-center text-white focus:outline-none focus:border-indigo-500 dir-ltr"
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-1">
                      <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                        <input
                          type="checkbox"
                          checked={termsAccepted}
                          onChange={(e) => setTermsAccepted(e.target.checked)}
                          className="rounded accent-indigo-600 w-3.5 h-3.5"
                        />
                        <span>پذیرش قوانین و شرایط باکس</span>
                      </label>
                      <button
                        onClick={() => setShowTermsModal(true)}
                        className="text-indigo-400 hover:text-indigo-300 underline"
                      >
                        مطالعه قوانین
                      </button>
                    </div>

                    {otpSent && (
                      <div className="text-right space-y-1 pt-2">
                        <label className="text-xs text-emerald-400 font-medium block">
                          کد ۴ رقمی کاوه‌نگار را وارد کنید (کد تست: ۴۸۹۲):
                        </label>
                        <input
                          type="text"
                          maxLength={4}
                          value={otpInput}
                          onChange={(e) => setOtpInput(e.target.value)}
                          placeholder="۴۸۹۲"
                          className="w-full p-3 rounded-xl bg-slate-900 border border-emerald-500/40 text-lg font-mono text-center tracking-widest text-emerald-400 focus:outline-none"
                        />
                      </div>
                    )}

                    {authError && (
                      <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs text-right">
                        {authError}
                      </div>
                    )}
                  </div>

                  {!otpSent ? (
                    <button
                      onClick={handleSendOtp}
                      className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
                    >
                      ارسال کد تایید پیامکی (OTP)
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <button
                        onClick={handleVerifyOtp}
                        className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                      >
                        تایید و ورود به اپلیکیشن
                      </button>
                      <button
                        onClick={handleSendOtp}
                        disabled={otpCooldown > 0}
                        className="w-full py-2 px-3 rounded-xl bg-slate-900 text-slate-400 text-[11px] disabled:opacity-50"
                      >
                        {otpCooldown > 0 ? `ارسال مجدد تا ${otpCooldown} ثانیه دیگر` : 'ارسال مجدد پیامک'}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* SCREEN: C38_account (Account & In-App Updater) */}
              {currentScreen === 'C38_account' && (
                <div className="flex-1 flex flex-col justify-between p-4 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-850">
                    <button
                      onClick={() => setCurrentScreen('C05_map')}
                      className="p-1 rounded-lg text-slate-400 hover:text-white"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-bold text-white">صفحه C38 • حساب و آپدیتر</span>
                    <span className="w-4" />
                  </div>

                  <div className="space-y-3">
                    <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center">
                        م
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">مهدی فخرایی</div>
                        <div className="text-[10px] text-slate-400 font-mono">09121234567</div>
                      </div>
                    </div>

                    {/* Auto-detected Updater Section (C38 In-App Updater CTA) */}
                    {updateInfo?.hasUpdate && !updateInstalled ? (
                      <div className="relative p-3.5 rounded-2xl bg-gradient-to-br from-amber-950/50 via-slate-900 to-indigo-950/40 border-2 border-amber-500/60 shadow-lg shadow-amber-950/40 space-y-2.5 overflow-hidden">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="relative flex h-2.5 w-2.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                            </span>
                            <span className="text-xs font-bold text-white flex items-center gap-1">
                              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                              <span>نسخه جدید موجود است!</span>
                            </span>
                          </div>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                            v{updateInfo.latestVersion}
                          </span>
                        </div>

                        {/* Background auto-detection status */}
                        <div className="p-2 rounded-xl bg-slate-950/70 border border-amber-500/20 flex items-center justify-between text-[10px]">
                          <div className="flex items-center gap-1 text-slate-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            <span>شناسایی خودکار در پس‌زمینه</span>
                          </div>
                          <span className="text-amber-400 font-mono font-bold">v{installedVersion} → v{updateInfo.latestVersion}</span>
                        </div>

                        {/* Highlights */}
                        <div className="space-y-1">
                          <div className="text-[10px] text-amber-200/90 font-bold">امکانات جدید این نسخه:</div>
                          <div className="flex flex-wrap gap-1">
                            {updateInfo.changelogHighlights.slice(0, 3).map((feat, idx) => (
                              <span key={idx} className="text-[9px] px-2 py-0.5 rounded-md bg-amber-950/40 border border-amber-500/30 text-amber-200">
                                ✓ {feat}
                              </span>
                            ))}
                          </div>
                        </div>

                        {isUpdating && (
                          <div className="space-y-1 pt-1">
                            <div className="flex justify-between text-[10px] text-slate-300 font-mono">
                              <span className="flex items-center gap-1">
                                <RefreshCw className="w-3 h-3 text-amber-400 animate-spin" />
                                <span>دانلود مستقیم فایل باینری APK...</span>
                              </span>
                              <span className="text-amber-400 font-bold">{updateProgress}٪</span>
                            </div>
                            <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-amber-500/30">
                              <div
                                className="h-full bg-gradient-to-r from-amber-500 to-indigo-500 transition-all duration-200"
                                style={{ width: `${updateProgress}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {!isUpdating && (
                          <button
                            onClick={handleTriggerUpdater}
                            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-amber-500/25 flex items-center justify-center gap-1.5 transition-all transform active:scale-98"
                          >
                            <Download className="w-3.5 h-3.5 animate-bounce" />
                            <span>⚡ دریافت و نصب مستقیم نسخه {updateInfo.latestVersion}</span>
                          </button>
                        )}
                        <p className="text-[9px] text-center text-slate-400">
                          بدون نیاز به استعلام دستی • آماده نصب مستقیم
                        </p>
                      </div>
                    ) : (
                      <div className="p-3 bg-emerald-950/20 rounded-2xl border border-emerald-500/30 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>اپلیکیشن شما کاملاً به‌روز است</span>
                          </span>
                          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
                            v{installedVersion}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-relaxed">
                          بررسی خودکار در پس‌زمینه انجام شد. هیچ بروزرسانی جدیدتری در مخزن موجود نیست.
                        </p>
                        <div className="flex justify-between items-center pt-1 border-t border-slate-800/80">
                          <span className="text-[9px] text-slate-500">وضعیت استعلام: خودکار</span>
                          <button
                            onClick={() => {
                              setInstalledVersion('1.0.0-preview5');
                              setUpdateInstalled(false);
                            }}
                            className="text-[10px] text-indigo-400 hover:text-indigo-300 underline"
                          >
                            ⟳ تست نمایش خودکار نسخه جدید
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Direct Email Link Dispatch to Mehdi.fakhraei@gmail.com */}
                    <div className="p-3 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-indigo-400" />
                          <span>ارسال لینک آپدیت به ایمیل</span>
                        </span>
                        <span className="text-[10px] text-indigo-300 font-mono bg-indigo-950/60 border border-indigo-500/30 px-2 py-0.5 rounded">
                          Mehdi.fakhraei@gmail.com
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-relaxed">
                        دریافت فوری لینک‌های مستقیم نصب APK یونیورسال و ARM64 در صندوق ایمیل شما
                      </p>
                      <a
                        href={`mailto:Mehdi.fakhraei@gmail.com?subject=${encodeURIComponent(
                          'لینک دانلود نسخه جدید اپلیکیشن باکس (Bax v1.0.0-preview6)'
                        )}&body=${encodeURIComponent(
                          `سلام مهدی عزیز،\n\nلینک‌های مستقیم دانلود و نصب آخرین نسخه اپلیکیشن باکس (Bax v1.0.0-preview6):\n\n۱. لینک مستقیم APK یونیورسال (سازگار با همه گوشی‌های اندروید):\nhttps://github.com/mehdi-fakhraei60/dbax-releases/releases/latest/download/bax-customer.apk\n\n۲. لینک مستقیم نسخه اختصاصی ARM64 (سبک‌تر و پرسرعت‌تر):\nhttps://github.com/mehdi-fakhraei60/dbax-releases/releases/latest/download/bax-customer-arm64.apk\n\n۳. پنل وب اپلیکیشن و رهگیری آنلاین مرسولات:\nhttps://ais-pre-5bl4lttndqki4py52nvh6v-274963453008.europe-west1.run.app\n\nامکانات نسخه جدید v1.0.0-preview6:\n✓ ثبت سفارش چند مقصده با توقف‌های دلخواه (Multi-Stop)\n✓ سفارش زمان‌بندی‌شده و رزرو قطعی ساعت مراجعه سفیر\n✓ ناوگان بارهای سنگین، نیسان، خاور و کارگر باربری\n✓ سامانه امانت‌داری و تسویه آنی بهای کالا در محل تحویل (COD Escrow)\n✓ فاکتور رسمی دارایی با ۱۰٪ مالیات ارزش افزوده\n\nبا احترام،\nتیم پشتیبانی و توسعه باکس (Bax App)`
                        )}`}
                        onClick={() => {
                          setEmailSentNotice(true);
                          SoundEffects.playSuccess();
                          setTimeout(() => setEmailSentNotice(false), 4000);
                        }}
                        className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white text-xs font-bold shadow-md shadow-indigo-600/25 flex items-center justify-center gap-1.5 transition-all active:scale-98"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>ارسال ایمیل لینک دانلود به Mehdi.fakhraei@gmail.com</span>
                      </a>
                      {emailSentNotice && (
                        <div className="p-2 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-[10px] flex items-center justify-center gap-1.5 animate-in fade-in">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>نرم‌افزار ایمیل باز شد و پیش‌نویس لینک‌های دانلود آماده ارسال گردید.</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setCurrentScreen('C05_map');
                      SoundEffects.playPop();
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white"
                  >
                    بازگشت به نقشه و سفارش
                  </button>
                </div>
              )}

              {/* Native Android Material 3 Bottom Navigation Bar */}
              <div className="bg-slate-950/95 backdrop-blur-md border-t border-slate-800/80 px-2 py-2 grid grid-cols-4 gap-1 z-30 select-none">
                <button
                  onClick={() => {
                    setCurrentScreen('C05_map');
                    SoundEffects.playPop();
                  }}
                  className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
                    currentScreen === 'C05_map'
                      ? 'text-indigo-400 font-bold bg-indigo-950/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Map className="w-4 h-4" />
                  <span className="text-[9px] mt-0.5">نقشه</span>
                </button>

                <button
                  onClick={() => {
                    setCurrentScreen('C18_tracking');
                    SoundEffects.playPop();
                  }}
                  className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
                    currentScreen === 'C18_tracking' || currentScreen === 'C15_finding' || currentScreen === 'C30_delivered'
                      ? 'text-indigo-400 font-bold bg-indigo-950/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Package className="w-4 h-4" />
                  <span className="text-[9px] mt-0.5">سفارشات</span>
                </button>

                <button
                  onClick={() => {
                    setShowChatModal(true);
                    SoundEffects.playPop();
                  }}
                  className="flex flex-col items-center justify-center py-1 rounded-xl text-slate-400 hover:text-white transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-[9px] mt-0.5">پشتیبانی</span>
                </button>

                <button
                  onClick={() => {
                    setCurrentScreen('C38_account');
                    SoundEffects.playPop();
                  }}
                  className={`relative flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
                    currentScreen === 'C38_account'
                      ? 'text-amber-400 font-bold bg-amber-950/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="relative">
                    <User className="w-4 h-4" />
                    {updateInfo?.hasUpdate && !updateInstalled && (
                      <span className="absolute -top-1 -right-2 flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-80"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500 border border-slate-950"></span>
                      </span>
                    )}
                  </div>
                  <span className="text-[9px] mt-0.5 flex items-center gap-0.5">
                    <span>حساب</span>
                    {updateInfo?.hasUpdate && !updateInstalled && (
                      <span className="text-[8px] font-black text-amber-300 bg-amber-500/20 border border-amber-400/40 px-1 rounded-xs animate-pulse">
                        آپدیت!
                      </span>
                    )}
                  </span>
                </button>
              </div>

              {/* Bottom Android Home indicator */}
              <div className="py-2 flex justify-center border-t border-slate-900">
                <div className="w-24 h-1 bg-slate-700 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL 1: In-App Chat & 24/7 Operations Support Modal (C20) */}
      {showChatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-5 text-slate-100 flex flex-col h-[520px]">
            {/* Modal Header with Courier vs Support Tabs */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                <button
                  onClick={() => setActiveChatTab('courier')}
                  className={`py-1 px-3 rounded-lg font-bold transition-all ${
                    activeChatTab === 'courier' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  چت با کاپتان
                </button>
                <button
                  onClick={() => setActiveChatTab('support')}
                  className={`py-1 px-3 rounded-lg font-bold transition-all flex items-center gap-1 ${
                    activeChatTab === 'support' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <HelpCircle className="w-3 h-3 text-cyan-400" />
                  <span>پشتیبانی عملیات ۲۴ساعته</span>
                </button>
              </div>

              <button onClick={() => setShowChatModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tab 1: Courier Chat */}
            {activeChatTab === 'courier' && (
              <>
                <div className="flex-1 overflow-y-auto space-y-3 py-3 pr-1 text-xs">
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${msg.sender === 'customer' ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-2xl ${
                          msg.sender === 'customer'
                            ? 'bg-indigo-600 text-white rounded-bl-xs'
                            : 'bg-slate-800 text-slate-200 rounded-br-xs'
                        }`}
                      >
                        <p className="leading-relaxed">{msg.text}</p>
                        <span className="text-[9px] text-slate-300/70 font-mono mt-1 block text-left">
                          {msg.timestamp}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center gap-2">
                  <input
                    type="text"
                    value={chatInputText}
                    onChange={(e) => setChatInputText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="پیام خود را برای کاپتان بنویسید..."
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}

            {/* Tab 2: 24/7 Operations Support Desk */}
            {activeChatTab === 'support' && (
              <>
                <div className="flex-1 overflow-y-auto space-y-3 py-3 pr-1 text-xs">
                  {supportMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${
                        msg.sender === 'user' ? 'items-end' : msg.sender === 'agent' ? 'items-start' : 'items-center'
                      }`}
                    >
                      {msg.sender === 'system' ? (
                        <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800 text-[10px] text-slate-400 text-center max-w-[90%]">
                          {msg.text}
                        </div>
                      ) : (
                        <div
                          className={`max-w-[85%] p-3 rounded-2xl ${
                            msg.sender === 'user'
                              ? 'bg-cyan-600 text-white rounded-bl-xs'
                              : 'bg-slate-800 text-slate-200 border border-slate-700/80 rounded-br-xs'
                          }`}
                        >
                          {msg.agentName && (
                            <span className="text-[10px] text-cyan-300 font-bold block mb-1">{msg.agentName}</span>
                          )}
                          <p className="leading-relaxed">{msg.text}</p>
                          <span className="text-[9px] text-slate-300/70 font-mono mt-1 block text-left">
                            {msg.time}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center gap-2">
                  <input
                    type="text"
                    value={supportInputText}
                    onChange={(e) => setSupportInputText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendSupportMessage()}
                    placeholder="پیام یا گزارش خود را برای پشتیبانی بنویسید..."
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    onClick={handleSendSupportMessage}
                    className="p-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white shadow-md"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* MODAL 2: Official Invoice Modal (C13) */}
      {showInvoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 text-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">فاکتور رسمی خدمات لجستیک باکس (صفحه C13)</h3>
              </div>
              <button onClick={() => setShowInvoiceModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-950 rounded-2xl border border-slate-800">
                <div>
                  <span className="text-slate-400 text-[10px] block">شماره فاکتور:</span>
                  <span className="font-mono font-bold text-white">{officialInvoice?.invoiceNumber || 'INV-90214'}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">تاریخ و ساعت:</span>
                  <span className="font-mono text-white">{officialInvoice?.date || '۱۴۰۳/۰۷/۲۲'}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">مشتری:</span>
                  <span className="font-bold text-white">مهدی فخرایی (۰۹۱۲۱۲۳۴۵۶۷)</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">روش تسویه:</span>
                  <span className="text-indigo-400 font-bold">نقدی به کاپتان (پس‌کرایه)</span>
                </div>
              </div>

              {/* Items Table */}
              <div className="border border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-2.5">شرح خدمت</th>
                      <th className="p-2.5 text-center">تعداد</th>
                      <th className="p-2.5 text-left">مبلغ (تومان)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850">
                    <tr>
                      <td className="p-2.5 text-slate-200">کرایه پایه حمل مرسوله با موتور باکس عایق</td>
                      <td className="p-2.5 text-center font-mono">۱</td>
                      <td className="p-2.5 text-left font-mono">{new Intl.NumberFormat('fa-IR').format(baseVehiclePrice)}</td>
                    </tr>
                    {destinations.length > 1 && (
                      <tr>
                        <td className="p-2.5 text-slate-200">کرایه توقف در مقاصد اضافی ({destinations.length - 1} مقصد)</td>
                        <td className="p-2.5 text-center font-mono">{destinations.length - 1}</td>
                        <td className="p-2.5 text-left font-mono">+{new Intl.NumberFormat('fa-IR').format(dispatchPricing.multiDropFare)}</td>
                      </tr>
                    )}
                    {isGuaranteed && (
                      <tr>
                        <td className="p-2.5 text-slate-200">تضمین سلامت کالا و بیمه تا سقف ۵ میلیون تومان</td>
                        <td className="p-2.5 text-center font-mono">۱</td>
                        <td className="p-2.5 text-left font-mono">+{new Intl.NumberFormat('fa-IR').format(guaranteePrice)}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="p-3 bg-indigo-950/40 rounded-2xl border border-indigo-500/40 flex justify-between items-center text-sm">
                <span className="font-bold text-white">مبلغ کل پرداختی:</span>
                <span className="font-bold font-mono text-emerald-400">
                  {new Intl.NumberFormat('fa-IR').format(totalPrice)} تومان
                </span>
              </div>
            </div>

            <div className="mt-5 flex gap-2">
              <button
                onClick={() => {
                  window.print();
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
              >
                چاپ فاکتور رسمی
              </button>
              <button
                onClick={() => setShowInvoiceModal(false)}
                className="py-2.5 px-4 rounded-xl bg-slate-800 text-slate-300 text-xs"
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Terms and Conditions Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-3xl p-6 text-slate-100 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                <span>{BAX_TERMS_AND_CONDITIONS.titleFa}</span>
              </h3>
              <button onClick={() => setShowTermsModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              {BAX_TERMS_AND_CONDITIONS.articles.map((art) => (
                <div key={art.articleNumber} className="space-y-1.5 p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <h4 className="font-bold text-white text-[11px] text-indigo-300">
                    ماده {art.articleNumber}: {art.titleFa}
                  </h4>
                  <p className="text-slate-300 leading-relaxed text-[10px]">{art.contentFa}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setShowTermsModal(false)}
                className="py-2 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
              >
                متوجه شدم و می‌پذیرم
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Kavenegar SMS Templates Catalog Modal */}
      {showSmsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 text-slate-100 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-850">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400" />
                <span>الگوهای پیامکی کاوه‌نگار در سامانه‌ باکس (SMS Lookup)</span>
              </h3>
              <button onClick={() => setShowSmsModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {BAX_SMS_TEMPLATES.map((tmpl) => (
                <div key={tmpl.templateKey} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-[11px]">{tmpl.purposeFa}</span>
                    <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-slate-900 text-indigo-300 border border-slate-800">
                      {tmpl.templateKey}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-300 font-mono leading-relaxed bg-slate-900/60 p-2 rounded-lg border border-slate-800/80">
                    {tmpl.sampleText}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: Masked Call Simulated Dialog (C19) */}
      {maskedCallOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-xs bg-slate-900 border border-slate-700 rounded-3xl p-5 text-slate-100 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto">
              <Phone className="w-7 h-7 animate-pulse" />
            </div>

            <div>
              <h4 className="text-xs font-bold text-white">تماس امن واسط دوطرفه باکس</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">بدون افشای شماره موبایل شما و کاپتان</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="text-[10px] text-slate-400">شماره سرور واسط اختصاصی:</div>
              <div className="text-base font-mono font-bold text-emerald-400 dir-ltr">۰۲۱ - ۹۱۰۰ ۸۸۹۹</div>
              <div className="text-[9px] text-slate-500 font-mono">شناسه تماس: CALL-882194</div>
            </div>

            <button
              onClick={() => setMaskedCallOpen(false)}
              className="w-full py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
            >
              قطع تماس
            </button>
          </div>
        </div>
      )}

      {/* MODAL 6: Recipient Live Web Tracking Link & SMS Modal */}
      {showWebTrackingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 text-slate-100 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-purple-400" />
                <h3 className="text-sm font-bold text-white">اشتراک لینک زنده وب با گیرنده (بدون نیاز به نصب اپلیکیشن)</h3>
              </div>
              <button onClick={() => setShowWebTrackingModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-purple-950/30 border border-purple-500/30 text-xs text-purple-200 leading-relaxed">
              گیرنده مرسوله نیازی به داشتن حساب کاربری یا نصب هیچ برنامه‌ای ندارد. با کلیک بر روی لینک اختصاصی، نقشه زنده، پلاک کاپتان و زمان رسیدن را مشاهده می‌کند.
            </div>

            {/* Link Box */}
            <div className="space-y-1.5 text-xs">
              <label className="text-slate-400 text-[11px] block">لینک مستقیم ردیابی وب:</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value="https://track.bax.ir/live/BX-88219"
                  className="flex-1 bg-slate-950 text-xs font-mono text-purple-300 px-3 py-2 rounded-xl border border-slate-800 select-all"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText('https://track.bax.ir/live/BX-88219');
                    SoundEffects.playPop();
                    alert('لینک ردیابی زنده کپی شد.');
                  }}
                  className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-colors"
                >
                  کپی لینک
                </button>
              </div>
            </div>

            {/* SMS Preview */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-400 pb-1.5 border-b border-slate-850">
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-emerald-400" />
                  <span>متن پیامک ارسالی خودکار به گیرنده:</span>
                </span>
                <button
                  onClick={() => {
                    const sms = `مشتری گرامی؛\nمرسوله شما تحویل کاپتان باکس گردید.\nمشاهده زنده مسیر کاپتان روی نقشه بدون نصب برنامه:\nhttps://track.bax.ir/live/BX-88219\nزمان تقریبی تحویل: حدود ۱۴ دقیقه دیگر`;
                    navigator.clipboard.writeText(sms);
                    SoundEffects.playPop();
                    alert('متن پیامک کپی شد.');
                  }}
                  className="text-purple-400 hover:text-purple-300 text-[11px]"
                >
                  کپی پیامک
                </button>
              </div>
              <p className="text-[11px] text-slate-300 whitespace-pre-wrap leading-relaxed font-sans">
                مشتری گرامی؛{'\n'}مرسوله شما تحویل کاپتان باکس گردید.{'\n'}مشاهده زنده مسیر کاپتان روی نقشه بدون نصب برنامه:{'\n'}https://track.bax.ir/live/BX-88219{'\n'}زمان تقریبی تحویل: حدود ۱۴ دقیقه دیگر
              </p>
            </div>

            {/* Courier Status Telemetry */}
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">سرعت فعلی کاپتان:</span>
                <span className="font-bold font-mono text-emerald-400">۳۸ کیلومتر بر ساعت</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">فاصله باقیمانده:</span>
                <span className="font-bold font-mono text-indigo-400">۳.۴ کیلومتر</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowWebTrackingModal(false)}
                className="py-2 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold"
              >
                بستن پنجره
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 7: Multi-Branch & Address Book Modal */}
      {showAddressBookModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 text-slate-100 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">دفترچه آدرس‌های منتخب، انبارها و شعب سازمانی</h3>
              </div>
              <button onClick={() => setShowAddressBookModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {savedAddressesList.map((addr) => (
                <div key={addr.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-white text-xs">{addr.titleFa}</h4>
                      <span className="text-[10px] text-indigo-300 font-mono">{addr.categoryLabelFa}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">{addr.orderCountUsed} سفارش قبلی</span>
                  </div>

                  <p className="text-[11px] text-slate-300 leading-relaxed">{addr.fullAddressFa}</p>
                  <div className="text-[10px] text-slate-400">تحویل‌گیرنده: {addr.contactName} ({addr.contactPhone})</div>

                  <div className="pt-2 border-t border-slate-850 flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedPickup({
                          lat: addr.location.lat,
                          lng: addr.location.lng,
                          title: addr.titleFa,
                          address: addr.fullAddressFa,
                        });
                        setPickupUnit(addr.unitNotesFa || 'واحد اصلی');
                        SoundEffects.playPop();
                        setShowAddressBookModal(false);
                      }}
                      className="flex-1 py-1.5 px-3 rounded-xl bg-emerald-600/20 border border-emerald-500/30 hover:bg-emerald-600 text-emerald-300 hover:text-white text-[11px] font-bold transition-all text-center"
                    >
                      انتخاب به عنوان مبدا
                    </button>
                    <button
                      onClick={() => {
                        const newDest: MultiDropDestination = {
                          id: `dest-${Date.now()}`,
                          location: {
                            lat: addr.location.lat,
                            lng: addr.location.lng,
                            title: addr.titleFa,
                            address: addr.fullAddressFa,
                          },
                          recipientName: addr.contactName,
                          recipientPhone: addr.contactPhone,
                          unitNotes: addr.unitNotesFa,
                          status: 'pending',
                        };
                        setDestinations([newDest]);
                        SoundEffects.playPop();
                        setShowAddressBookModal(false);
                      }}
                      className="flex-1 py-1.5 px-3 rounded-xl bg-indigo-600/20 border border-indigo-500/30 hover:bg-indigo-600 text-indigo-300 hover:text-white text-[11px] font-bold transition-all text-center"
                    >
                      انتخاب به عنوان مقصد
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowAddressBookModal(false)}
                className="py-2 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold"
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 8: Goods COD Escrow Calculator Modal */}
      {showCodModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 text-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white">تسویه و امانت‌داری وجه کالا در محل (Goods COD)</h3>
              </div>
              <button onClick={() => setShowCodModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">مبلغ بهای کالا جهت وصول از گیرنده (تومان):</label>
                <input
                  type="number"
                  step="50000"
                  value={codAmountToman}
                  onChange={(e) => setCodAmountToman(Number(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex justify-between text-slate-400">
                  <span>کارمزد تضمین امانت‌داری و بیمه (۰.۸٪):</span>
                  <span className="font-mono text-rose-400">
                    -{CashOnDeliveryAdapter.calculateCod(codAmountToman).escrowFeeToman.toLocaleString('fa-IR')} ت
                  </span>
                </div>
                <div className="flex justify-between font-bold text-emerald-400 pt-1 border-t border-slate-850">
                  <span>مبلغ خالص واریزی به کیف‌پول شما:</span>
                  <span className="font-mono">
                    {CashOnDeliveryAdapter.calculateCod(codAmountToman).netCreditedToman.toLocaleString('fa-IR')} تومان
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-[10px] text-emerald-300">
                تسویه خودکار در کیف‌پول اعتباری بدون نیاز به درگاه آنلاین بانکی انجام می‌پذیرد.
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={() => {
                  setIsCodEnabled(true);
                  SoundEffects.playPop();
                  setShowCodModal(false);
                }}
                className="py-2.5 px-5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-colors"
              >
                فعال‌سازی COD در این سفارش
              </button>
              <button
                onClick={() => setShowCodModal(false)}
                className="py-2.5 px-4 rounded-xl bg-slate-800 text-slate-300 text-xs"
              >
                انصراف
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Download Modal */}
      <QrModal
        isOpen={qrOpen}
        onClose={() => setQrOpen(false)}
        title={`دانلود اپ مشتری باکس (${selectedArch === 'arm64' ? 'نسخه ۶۴ بیتی' : 'نسخه همگانی'})`}
        url={
          selectedArch === 'arm64'
            ? customerApp.arm64Apk.downloadUrl
            : customerApp.universalApk.downloadUrl
        }
        fileName={
          selectedArch === 'arm64'
            ? customerApp.arm64Apk.fileName
            : customerApp.universalApk.fileName
        }
        fileSize={
          selectedArch === 'arm64'
            ? customerApp.arm64Apk.fileSize
            : customerApp.universalApk.fileSize
        }
      />
    </div>
  );
};
