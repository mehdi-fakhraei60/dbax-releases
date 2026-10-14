export interface NeshanLocation {
  lat: number;
  lng: number;
  title: string;
  address: string;
  district?: string;
  postalCode?: string;
}

export interface RouteResult {
  distanceKm: number;
  durationMinutes: number;
  trafficStatus: 'smooth' | 'heavy' | 'moderate';
  polylineSvg: string;
}

export interface MapHubQuickSelect {
  id: string;
  title: string;
  zoneFa: string;
  location: NeshanLocation;
}

export class NeshanAdapter {
  public static readonly TEHRAN_CENTER = { lat: 35.7152, lng: 51.4043 };

  public static readonly QUICK_HUBS: MapHubQuickSelect[] = [
    {
      id: 'enghelab',
      title: 'میدان انقلاب',
      zoneFa: 'مرکز • منطقه ۶',
      location: {
        lat: 35.7005,
        lng: 51.3912,
        title: 'میدان انقلاب اسلامی',
        address: 'تهران، میدان انقلاب، ابتدای خیابان کارگر شمالی، پلاک ۱۲',
        district: 'منطقه ۶ تهران',
        postalCode: '1417613111',
      },
    },
    {
      id: 'vanak',
      title: 'میدان ونک',
      zoneFa: 'شمال • منطقه ۳',
      location: {
        lat: 35.7575,
        lng: 51.4101,
        title: 'میدان ونک',
        address: 'تهران، میدان ونک، ابتدای خیابان ملاصدرا، پلاک ۴۴',
        district: 'منطقه ۳ تهران',
        postalCode: '1991814123',
      },
    },
    {
      id: 'bazaar',
      title: 'بازار بزرگ تهران',
      zoneFa: 'مرکز/جنوب • منطقه ۱۲',
      location: {
        lat: 35.6748,
        lng: 51.4215,
        title: 'بازار بزرگ (سبزه‌میدان)',
        address: 'تهران، خیابان پانزده خرداد، بازار بزرگ، سرای امید، پلاک ۱۸',
        district: 'منطقه ۱۲ تهران',
        postalCode: '1163814511',
      },
    },
    {
      id: 'tajrish',
      title: 'میدان تجریش',
      zoneFa: 'شمال • منطقه ۱',
      location: {
        lat: 35.8052,
        lng: 51.4284,
        title: 'میدان تجریش',
        address: 'تهران، میدان تجریش، خیابان فناخسرو، روبروی مرکز تجاری، پلاک ۲',
        district: 'منطقه ۱ تهران',
        postalCode: '1989713112',
      },
    },
    {
      id: 'saadatabad',
      title: 'سعادت‌آباد',
      zoneFa: 'شمال غرب • منطقه ۲',
      location: {
        lat: 35.7878,
        lng: 51.3732,
        title: 'سعادت‌آباد (میدان کاج)',
        address: 'تهران، سعادت‌آباد، بلوار فرهنگ، کوچه باغ بهشت، پلاک ۸',
        district: 'منطقه ۲ تهران',
        postalCode: '1997834512',
      },
    },
    {
      id: 'sadeghieh',
      title: 'میدان صادقیه',
      zoneFa: 'غرب • منطقه ۵',
      location: {
        lat: 35.7198,
        lng: 51.3489,
        title: 'فلکه دوم صادقیه',
        address: 'تهران، فلکه دوم صادقیه، ابتدای بزرگراه آیت‌الله کاشانی، پلاک ۱۱۰',
        district: 'منطقه ۵ تهران',
        postalCode: '1481813123',
      },
    },
    {
      id: 'tehranpars',
      title: 'تهرانپارس',
      zoneFa: 'شرق • منطقه ۸',
      location: {
        lat: 35.7312,
        lng: 51.5312,
        title: 'فلکه اول تهرانپارس',
        address: 'تهران، تهرانپارس، فلکه اول، نبش خیابان بهار، پلاک ۷۶',
        district: 'منطقه ۸ تهران',
        postalCode: '1651813455',
      },
    },
    {
      id: 'mehrabad',
      title: 'فرودگاه مهرآباد',
      zoneFa: 'جنوب غرب • منطقه ۹',
      location: {
        lat: 35.6892,
        lng: 51.3125,
        title: 'ترمینال ۲ مهرآباد',
        address: 'تهران، بزرگراه شهید لشکری، ورودی فرودگاه مهرآباد، ترمینال ۲ بار هوایی',
        district: 'منطقه ۹ تهران',
        postalCode: '1387814911',
      },
    },
  ];

  public static async reverseGeocode(lat: number, lng: number): Promise<NeshanLocation> {
    // 1. Check if matches or is very close to any known hub
    let closestDist = Infinity;
    let closestHub = this.QUICK_HUBS[0].location;

    for (const hub of this.QUICK_HUBS) {
      const dLat = hub.location.lat - lat;
      const dLng = hub.location.lng - lng;
      const dist = Math.sqrt(dLat * dLat + dLng * dLng);
      if (dist < closestDist) {
        closestDist = dist;
        closestHub = hub.location;
      }
    }

    if (closestDist < 0.015) {
      return {
        lat: Math.round(lat * 10000) / 10000,
        lng: Math.round(lng * 10000) / 10000,
        title: closestHub.title,
        address: closestHub.address,
        district: closestHub.district,
        postalCode: closestHub.postalCode,
      };
    }

    // 2. Determine geographic district based on coordinates
    let district = 'مرکز تهران';
    let streetName = 'بلوار ولیعصر';

    if (lat > 35.78) {
      district = 'منطقه ۱ - شمیرانات';
      streetName = lng > 51.42 ? 'خیابان شریعتی / نیاوران' : 'بلوار شهرداری / سعادت‌آباد';
    } else if (lat > 35.74) {
      district = 'منطقه ۳ - ونک و میرداماد';
      streetName = lng > 51.41 ? 'خیابان میرداماد، میدان مادر' : 'بلوار ملاصدرا';
    } else if (lat < 35.68) {
      district = 'منطقه ۱۲/۱۶ - بازار و جنوب تهران';
      streetName = 'خیابان خیام / شوش';
    } else if (lng < 51.34) {
      district = 'منطقه ۵/۲۱ - غرب و صادقیه';
      streetName = 'بزرگراه آیت‌الله کاشانی / بلوار فردوس';
    } else if (lng > 51.48) {
      district = 'منطقه ۴/۸ - شرق و تهرانپارس';
      streetName = 'بزرگراه رسالت / خیابان دماوند';
    } else {
      district = 'منطقه ۶ - مرکز و انقلاب';
      streetName = 'خیابان انقلاب، راسته دانشگاه';
    }

    const approxPlaque = Math.floor(Math.abs((lat * 1000) % 180)) + 1;

    return {
      lat: Math.round(lat * 10000) / 10000,
      lng: Math.round(lng * 10000) / 10000,
      title: `موقعیت انتخابی (${streetName.split(' ')[0]} ${streetName.split(' ')[1] || ''})`,
      address: `تهران، ${district}، ${streetName}، کوچه نیلوفر، پلاک ${approxPlaque}`,
      district,
      postalCode: `${Math.floor(1000000000 + Math.random() * 900000000)}`,
    };
  }

  public static async searchPlaces(query: string): Promise<NeshanLocation[]> {
    if (!query || query.trim() === '') {
      return this.QUICK_HUBS.slice(0, 4).map((h) => h.location);
    }
    const q = query.toLowerCase().trim();
    const results = this.QUICK_HUBS.filter(
      (h) =>
        h.title.toLowerCase().includes(q) ||
        h.location.address.toLowerCase().includes(q) ||
        h.zoneFa.toLowerCase().includes(q)
    ).map((h) => h.location);

    if (results.length > 0) return results;

    // Generate dynamic result for searched term
    return [
      {
        lat: 35.735,
        lng: 51.41,
        title: query,
        address: `تهران، معبر منطبق با جستجوی «${query}»، تقاطع بلوار اصلی، پلاک ۱۵`,
        district: 'منطقه ۶ تهران',
      },
    ];
  }

  public static calculateRoute(origin: NeshanLocation, destination: NeshanLocation): RouteResult {
    const dLat = Math.abs(origin.lat - destination.lat);
    const dLng = Math.abs(origin.lng - destination.lng);
    const distEst = Math.max(2.8, Math.round(Math.sqrt(dLat * dLat + dLng * dLng) * 110 * 10) / 10);
    const durationEst = Math.max(10, Math.round(distEst * 2.1));

    return {
      distanceKm: distEst,
      durationMinutes: durationEst,
      trafficStatus: durationEst > 25 ? 'heavy' : durationEst > 16 ? 'moderate' : 'smooth',
      polylineSvg: 'M 70 210 Q 140 120 220 80',
    };
  }
}
