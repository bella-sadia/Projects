declare module 'sslcommerz-lts' {
    interface PaymentData {
      total_amount: number;
      currency: string;
      tran_id: string;
      success_url: string;
      fail_url: string;
      cancel_url: string;
      cus_name: string;
      cus_email: string;
      cus_add1: string;
      cus_phone: string;
    }
  
    class SSLCommerzPayment {
      constructor(storeId: string, storePasswd: string, isLive: boolean);
      init(paymentData: PaymentData): Promise<{ GatewayPageURL?: string }>;
    }
  
    export default SSLCommerzPayment;
  }
  