export interface CodTransaction {
  id: string;
  orderId: string;
  goodsValueToman: number;
  codFeeToman: number; // Small escrow fee (e.g. 1% capped)
  netSettlementToman: number;
  customerRecipientName: string;
  customerRecipientPhone: string;
  collectedByCourier: boolean;
  courierNameFa: string;
  courierDepositMethod: 'pos_terminal' | 'wallet_custody' | 'cash';
  settlementStatus: 'pending_collection' | 'in_custody' | 'settled_to_wallet';
  settledAt?: string;
  safetyInsuranceCovered: boolean;
}

export class CashOnDeliveryAdapter {
  public static calculateCod(goodsValueToman: number): {
    goodsValueToman: number;
    escrowFeeToman: number;
    netCreditedToman: number;
  } {
    // 0.8% escrow management & insurance fee, minimum 5,000 Toman, maximum 40,000 Toman
    const rawFee = goodsValueToman * 0.008;
    const escrowFeeToman = Math.min(Math.max(Math.round(rawFee / 1000) * 1000, 5000), 40000);
    const netCreditedToman = goodsValueToman - escrowFeeToman;

    return {
      goodsValueToman,
      escrowFeeToman,
      netCreditedToman,
    };
  }

  public static getSampleCodTransaction(orderId: string = 'BX-88219'): CodTransaction {
    const calc = this.calculateCod(1850000);
    return {
      id: `COD-${orderId.replace('#', '')}`,
      orderId,
      goodsValueToman: calc.goodsValueToman,
      codFeeToman: calc.escrowFeeToman,
      netSettlementToman: calc.netCreditedToman,
      customerRecipientName: 'آقای بهرامی (خریدار کالا)',
      customerRecipientPhone: '09351239988',
      collectedByCourier: true,
      courierNameFa: 'سجاد رضایی',
      courierDepositMethod: 'pos_terminal',
      settlementStatus: 'in_custody',
      settledAt: 'امروز، ساعت ۱۴:۳۵',
      safetyInsuranceCovered: true,
    };
  }
}
