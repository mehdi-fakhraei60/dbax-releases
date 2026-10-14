export interface ChatMessage {
  id: string;
  sender: 'customer' | 'courier';
  text: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'seen';
}

export class InAppChatAdapter {
  private static defaultQuickReplies: string[] = [
    'سلام، بسته کاملاً آماده است و در لابی تحویل می‌شود.',
    'لطفاً زنگ واحد ۴ را بزنید.',
    'بسته شکستنی است، لطفاً با احتیاط حمل شود.',
    'من ۵ دقیقه دیگر به آدرس مبدا می‌رسم.',
    'تحویل نگهبانی مجتمع داده شد.',
  ];

  static getQuickReplies(): string[] {
    return this.defaultQuickReplies;
  }

  static getInitialMessages(): ChatMessage[] {
    return [
      {
        id: 'msg-1',
        sender: 'courier',
        text: 'سلام، من سفارش شما را پذیرفتم و طبق مسیریاب نشان تا ۹ دقیقه دیگر جلوی درب مبدا هستم.',
        timestamp: '۹:۴۲',
        status: 'seen',
      },
      {
        id: 'msg-2',
        sender: 'customer',
        text: 'سلام و وقت‌بخیر، بسته آماده است و در طبقه ۲ تحویل می‌گردد.',
        timestamp: '۹:۴۳',
        status: 'seen',
      },
    ];
  }
}
