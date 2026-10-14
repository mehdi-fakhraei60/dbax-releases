export interface PushMessage {
  id: string;
  titleFa: string;
  bodyFa: string;
  timestamp: string;
  screenTarget: string;
}

export class PushNotificationAdapter {
  private static subscribers: ((msg: PushMessage) => void)[] = [];

  static subscribe(callback: (msg: PushMessage) => void) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter((s) => s !== callback);
    };
  }

  static dispatch(titleFa: string, bodyFa: string, screenTarget: string) {
    const msg: PushMessage = {
      id: `push_${Date.now()}`,
      titleFa,
      bodyFa,
      timestamp: new Date().toLocaleTimeString('fa-IR'),
      screenTarget,
    };
    this.subscribers.forEach((cb) => cb(msg));
  }
}
