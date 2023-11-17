# Wonderful Payments Node API Library

This library provides convenient access to the Wonderful Payments REST API for JavaScript.

To read more about the Wonderful Payments API, check out the official [API Reference](https://wonderful.co.uk/public-api-docs).

## Installation

```sh
npm install --save wonderful-api
```

## Usage

To get started, import the Wonderful Client and authorise it with your Wonderful Auth Token.

If you don't have an AUTH_TOKEN yet, you can request one by contacting [Wonderful Support](https://wonderful.support/).

```js
const WonderfulClient = require('wonderful-payments');
const wonderful = new WonderfulClient('YOUR_AUTH_TOKEN');
```

## Payment Sessions

The Wonderful API supports methods to create and later check the status of a payment session.

### Creating Payment Sessions

With the client initiated, creating a new payment session is simple using the `payments.create()` method.

```js
const paymentSession = await wonderful.payments.create({
  "customer_email_address": "customer@example.com",
  "merchant_payment_reference": "MY_ORDER_12345",
  "amount": 12345,
  "redirect_url": "https://your-website.example.com/return-url",
  "webhook_url": "https://your-website.example.com/webhook-url"
});

console.log(paymentSession);
```

There's no need to provide a currency value when using the client as we pre-populate that with "GBP". If support for future currencies is added in the future we will update this accordingly.


### Show Payment Session

With the client initiated and a payment session created, we can check on it's status using the `payments.show()` method.

```js
const paymentSessionStatus = await wonderful.payments.show({
  "payment_id": "44a3a820-2d9b-43c6-a4e5-666486ec8cfa"
});

console.log(paymentSessionStatus);
```

### List All Payment Sessions

COMING SOON!

While this endpoint isn't currently supported, we've added it to the client as it should be here soon. To list all payment session you can simply call the `payments.list()` method.

```js
const allPaymentSessions = await wonderful.payments.list();

console.log(allPaymentSessions);
```