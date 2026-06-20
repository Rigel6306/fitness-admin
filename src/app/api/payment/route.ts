import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { addNewPaymentDoc } from "@/util/addPayment";
import { FaPray } from "react-icons/fa";
import { error } from "console";
export async function OPTIONS() {
  // Handle preflight requests for CORS
  return NextResponse.json({}, {
    status: 200,
    headers: {
      // whitelist your tunnel domain
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

export const POST = async (req: NextRequest) => {
  try {

    const getValues = (key: string) => formData.get(key)?.toString() || ''

    const formData = await req.formData();

    const merchant_id = getValues("merchant_id");
    const order_id = getValues("order_id");
    const payhere_amount = getValues("payhere_amount");
    const payhere_currency = getValues("payhere_currency");
    const status_code = getValues("status_code");
    const md5sig = getValues("md5sig");
    const user_id = getValues('custom_1')
    const payment_id = getValues('payment_id')
    const status_message = getValues('status_message')
    const payment_method = getValues('method')
    console.log(formData)

    const localMerchantSecret = process.env.PAYHERE_MERCHANT_SECRET;
    const hashedSecret = crypto
      .createHash("md5")
      .update(localMerchantSecret)
      .digest("hex")
      .toUpperCase();

    const dataToHash = merchant_id + order_id + payhere_amount + payhere_currency + status_code + hashedSecret

    const generatedHash = crypto
      .createHash("md5")
      .update(dataToHash)
      .digest("hex")
      .toUpperCase();

    if (generatedHash !== md5sig) {
      console.error("Hash mismatch for order:", order_id);
      return NextResponse.json({ error: "Invalid Signature" }, { status: 400 })
    }

    if (status_code === "2") {

      try {

        await addNewPaymentDoc({
          user_id,
          order_id,
          payment_id,
          amount: payhere_amount,
          currency: payhere_currency,
          status_message,
          payment_method
        })

        return new NextResponse("Payment Processed Successfully", { status: 200 })

      } catch (err) {
        console.error("Database update failed:", err)
        return new NextResponse("Internal Server Error", {status:500})
      }
    }
    return new NextResponse("Notification Recevied Non-Success", {status:200})
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, {
      status: 400,

    });
  }
}
