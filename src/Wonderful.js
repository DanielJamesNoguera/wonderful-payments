class WonderfulClient {
  constructor(authKey) {
      this.authKey = authKey;
      this.baseUrl = "https://wonderful.co.uk/api/public/v1";
  }

  // Function to validate the data being used for a payments.create call
  validatePaymentCreateData(paymentData) {
    let passed = true;
    const errors = [];
    
    // Define which fields are required for the call
    const acceptedFields = {
      "customer_email_address": {
        required: true,
        type: "string",
        pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
      },
      "merchant_payment_reference": {
        required: true,
        type: "string"
      },
      "amount": {
        required: true,
        type: "number",
        integer: true
      },
      "redirect_url": {
        required: true,
        type: "string",
        pattern: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/
      },
      "webhook_url": {
        required: false,
        type: "string",
        pattern: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/
      },
    };

    Object.keys(acceptedFields).forEach(key => {
      const field = acceptedFields[key];
      const value = paymentData[key];

      // Check if required fields are present
      if (field.required && (value === undefined || value === null)) {
        errors.push(`${key} is required.`);
      }

      // Check for correct type
      if (value !== undefined && typeof value !== field.type) {
        errors.push(`${key} must be of type ${field.type}.`);
      }

      // Check for regex pattern match
      if (field.pattern && value && !field.pattern.test(value)) {
        errors.push(`${key} is not in the correct format.`);
      }

      // Check for integer if required
      if (field.integer && !Number.isInteger(value)) {
        errors.push(`${key} must be an integer.`);
      }
    });

    // Optionally, check for any unexpected fields
    Object.keys(paymentData).forEach(key => {
      if (!acceptedFields[key]) {
        errors.push(`${key} is not a valid field.`);
      }
    });

    if (errors.length > 0) passed = false;

    return {passed, errors};
  }

  payments = {
    create: async (paymentData) => {
      const validationCheck = this.validatePaymentCreateData(paymentData);

      if (!validationCheck.passed) throw new Error(`Error validating payment data for payments.create method: ${validationCheck.errors.join(', ')}`);

      const url = new URL(`${this.baseUrl}/payments`);
      const headers = {
          "Authorization": `Bearer ${this.authKey}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
      };

      // Set this to GBP since it's the only valid currency (at the moment)
      paymentData.currency = "GBP";
      
      try {
        const response = await fetch(url, {
          method: "POST",
          headers,
          body: JSON.stringify(paymentData),
        });
        return response.json();
      } catch (error) {
        // Handle errors appropriately
        console.error(error);
      }
    },

    show: async (paymentData) => {
      const paymentId = paymentData.payment_id;
      const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
  
      if (!paymentId) throw new Error("Missing required payment_id value for payment.show method.");
      if (!uuidRegex.test(paymentId)) throw new Error("Invalid payment_id format used in payment.show method. Expected a valid UUID.");
  
      const url = new URL(`${this.baseUrl}/payments/${paymentId}`);
      const headers = {
          "Authorization": `Bearer ${this.authKey}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
      };
      
      try {
          const response = await fetch(url, {
              method: "GET",
              headers,
          });
          return response.json();
      } catch (error) {
          throw new Error("Error retrieving payment session via payments.show method:", error);
      }
    },

    list: async () => {
      const url = new URL(`${this.baseUrl}/payments`);
      const headers = {
          "Authorization": `Bearer ${this.authKey}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
      };
      
      try {
        const response = await fetch(url, {
            method: "GET",
            headers,
        });
        return response.json();
      } catch (error) {
        throw new Error("Error retrieving payment sessions via payments.list method:", error);
      }
    }
  };
}

module.exports = WonderfulClient;