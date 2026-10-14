export interface SupportMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  agentName?: string;
  text: string;
  time: string;
}

export class SupportChatAdapter {
  public static getInitialMessages(): SupportMessage[] {
    return [
      {
        id: 'msg-s1',
        sender: 'system',
        text: 'به واحد پشتیبانی عملیات ۲۴ ساعته باکس خوش آمدید. کارشناس پشتیبانی به زودی پاسخگوی شما خواهد بود.',
        time: 'هم‌اکنون',
      },
      {
        id: 'msg-s2',
        sender: 'agent',
        agentName: 'نیلوفر راد (پشتیبان ارشد)',
        text: 'سلام! چطور می‌توانم در خصوص سفارش یا سفیر به شما کمک کنم؟',
        time: 'هم‌اکنون',
      },
    ];
  }

  public static generateAgentReply(userText: string): SupportMessage {
    let reply = 'درخواست شما بررسی شد. همکاران ما در واحد دیسپچ فوراً با سفیر هماهنگ می‌کنند.';
    if (userText.includes('تاخیر') || userText.includes('دیر')) {
      reply = 'موقعیت سفیر را مجدداً روی رادار رصد کردیم؛ سفیر به دلیل بارندگی در مسیر است و ظرف ۵ دقیقه آینده به مقصد می‌رسد.';
    } else if (userText.includes('آدرس') || userText.includes('تغییر')) {
      reply = 'اطلاعات اصلاحیه آدرس شما در پنل سفیر بروزرسانی شد و با سفیر هماهنگ گردید.';
    } else if (userText.includes('هزینه') || userText.includes('قیمت')) {
      reply = 'محاسبه کرایه بر اساس نرخ رسمی مصوب و مسافت کیلومتری نشان است و هیچ هزینه اضافه‌ای دریافت نمی‌شود.';
    }

    return {
      id: `agent-${Date.now()}`,
      sender: 'agent',
      agentName: 'نیلوفر راد (پشتیبان ارشد)',
      text: reply,
      time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
    };
  }
}
