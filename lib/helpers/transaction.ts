import { handleError } from "../utils";
import { createTransaction,updatePaymentStatus } from "../actions/transaction.action";
import { updateTokens} from "../actions/user.actions";

  export async function createOrder(transaction: CreateOrderParams) {

    const res = await fetch("/api/topup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: transaction.amount * 100 }),
    });
    const data = await res.json();
    console.log(data);
      await createTransaction(transaction,data.id)
    const paymentData = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_APIKEY,
      order_id: data.id,
  
      handler: async function (response: any) {
        // verify payment
        const res = await fetch("/api/topup", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          }),
        });
        const data = await res.json();
        console.log(data);
        if (data.isOk) {
          await updateTokens(transaction.userId, transaction.tokens);
          await updatePaymentStatus(data.id,"Successfull")
          alert("Payment successful");
        } else {
          alert("Payment failed");
        }
      },
    };
  
    const payment = new (window as any).Razorpay(paymentData);
    payment.open();
  }