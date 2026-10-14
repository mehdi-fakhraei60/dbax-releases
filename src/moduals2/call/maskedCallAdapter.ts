export interface MaskedCallSession {
  sessionId: string;
  virtualDidNumber: string;
  expiresInSeconds: number;
  driverName: string;
}

export class MaskedCallAdapter {
  static initiateCall(driverId: string, driverName: string): MaskedCallSession {
    return {
      sessionId: `call_${Math.random().toString(36).substring(2, 9)}`,
      virtualDidNumber: '021-91008899',
      expiresInSeconds: 600,
      driverName,
    };
  }
}
