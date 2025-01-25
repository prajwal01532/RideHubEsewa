const axios = require("axios");
const crypto = require("crypto");

function getEsewaPaymentHash(input) {
  try {
    const secretKey = process.env.ESEWA_SECRET_KEY;
    
    // If input is an object with amount and transaction_uuid
    let data = typeof input === 'string' ? input : 
      `total_amount=${input.amount},transaction_uuid=${input.transaction_uuid},product_code=${process.env.ESEWA_PRODUCT_CODE}`;
    
    const hash = crypto
      .createHmac("sha256", secretKey)
      .update(data)
      .digest("base64");
    
    return hash;
  } catch (error) {
    console.error('Error generating eSewa payment hash:', error);
    throw error;
  }
}

async function getEsewaPaymentHash({ amount, transaction_uuid }) {
  try {
    const data = `total_amount=${amount},transaction_uuid=${transaction_uuid},product_code=${process.env.ESEWA_PRODUCT_CODE}`;

    const secretKey = process.env.ESEWA_SECRET_KEY;
    const hash = crypto
      .createHmac("sha256", secretKey)
      .update(data)
      .digest("base64");

    return {
      signature: hash,
      signed_field_names: "total_amount,transaction_uuid,product_code",
    };
  } catch (error) {
    throw error;
  }
}

async function verifyEsewaPayment(encodedData) {
  try {
    // decoding base64 code received from esewa
    let decodedData = atob(encodedData);
    decodedData = JSON.parse(decodedData);
    
    let headersList = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    const data = `transaction_code=${decodedData.transaction_code},status=${decodedData.status},total_amount=${decodedData.total_amount},transaction_uuid=${decodedData.transaction_uuid},product_code=${process.env.ESEWA_PRODUCT_CODE},signed_field_names=${decodedData.signed_field_names}`;

    const secretKey = process.env.ESEWA_SECRET_KEY;
    const hash = crypto
      .createHmac("sha256", secretKey)
      .update(data)
      .digest("base64");

    console.log('Generated Hash:', hash);
    console.log('Received Signature:', decodedData.signature);
    
    let reqOptions = {
      url: `${process.env.ESEWA_GATEWAY_URL}/api/epay/transaction/status/?product_code=${process.env.ESEWA_PRODUCT_CODE}&total_amount=${decodedData.total_amount}&transaction_uuid=${decodedData.transaction_uuid}`,
      method: "GET",
      headers: headersList,
    };

    // Verify signature first
    if (hash !== decodedData.signature) {
      throw { message: "Invalid signature detected", decodedData };
    }

    // Verify transaction with eSewa API
    let response = await axios.request(reqOptions);
    
    // Validate transaction details
    if (
      response.data.status !== "COMPLETE" ||
      response.data.transaction_uuid !== decodedData.transaction_uuid ||
      Number(response.data.total_amount) !== Number(decodedData.total_amount)
    ) {
      throw { message: "Transaction verification failed", decodedData, response: response.data };
    }

    return { response: response.data, decodedData };
  } catch (error) {
    console.error('eSewa Payment Verification Error:', error);
    throw error;
  }
}

module.exports = {
  verifyEsewaPayment,
  getEsewaPaymentHash
};
