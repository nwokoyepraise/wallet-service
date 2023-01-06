# 🏦 Wallet Service

Waller service is a container-based NestJs Backend server wallet application 
where users are able to create accounts, fund their wallets, manage their funds, handle transfers bettween wallet owners, withdraw their funds, transactions history, etc. 

Needless to say, this application, features both local and stateless authetication using JSON Web Tokens which has been implemented using Passport library, and payment gateway integration for funds management and use of database transactions to ensure data integrity in critical multi-table queries and operations.

## ⛳ Services Available
* User registeration
* Email verification
* Login
* Wallet funding
* Transfer between wallets
* Withdrawals
* Transactions history
* Wallet details/ Balance
* Multi-wallet/currency implementation

## 🔨 Built With
* Node.js
* NestJs (Typescript)
* MySQL
* KnexJs Query Builder
* Docker
* Passport.JS (Authentication)

## 🏁 Getting Started

## 🔩 Bare metal
To build the project locall,, bare metal without docker, simply clone the github repository. Navigate to root project folder and run the following to install packages:


```bash
$ npm install
```


and add appropriate .env file in the project root folder
#### Development
After packages have been installed. Proceed to run:

```bash
$ npm run start:dev
```

#### Production
After packages have been installed. Proceed to run:


```bash
$ npm run start:prod
```

## ⚓ Docker
To run the application in a docker which, depending on the docker CLI tool available in your local system, navigate to the project root foler, add the appropriate
.env file

if docker-compose is available in your local system, please run the following commands in your terminal:


```bash
$ docker-compose build
```

```bash
$ docker-compose up -d
```

If the local system is running Linux, ```sudo``` privileges may be need to run the commands appropriately.
## API Reference

#### 📞 Server Ping

```http
GET /

Response:
  {
    "message": "server active!"
  }
```

### 🔑 Authentication
#### User Registeration

```http
POST /users
Content-Type: application/json

Response:
    {
      "email": "string",
      "user_id": "string"
    }
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `email` | `string` | **Required**.  Must be a valid email string|
| `password` | `string` | **Required**.|

#### Verify Email

```http
PATCH /auth/verify-email
Content-Type: application/json

Response:
  {
    "message": "success"
  }
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `email`      | `string` | **Required**. |
| `user_id`      | `string` | **Required**. |
| `token`      | `string` | **Required**. Token for verification|

#### Login

```http
POST /auth/login
Content-Type: application/json

Response:
  {
    "user_id": "string",
    "jwt": "string"
  }
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `email`      | `string` | **Required**. |
| `password`      | `string` | **Required**. |


### 🏦 Wallets

#### Retrieve my Wallets

```http
GET /wallets
Authorization: Bearer Token <JWT>

Response:
  [
    {
    "wallet_id": "string",
    "user_id": "string",
    "balance": "number",
    "currency": "ISO4217m currency code",
    "created_at": "date string",
    "updated_at": "date string"
    }
  ]
```

#### Retrieve Wallet

```http
GET /wallets/:wallet_id
Authorization: Bearer Token <JWT>

Response:
  {
    "wallet_id": "string",
    "user_id": "string",
    "balance": "number",
    "currency": "ISO4217 currency code",
    "created_at": "date string",
    "updated_at": "date string"
  }
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `wallet_id`      | `string` | **Required**. |


#### Add wallet

```http
POST /wallets
Content-Type: application/json
Authorization: Bearer Token <JWT>

Response:
  {
    "wallet_id": "string",
    "user_id": "string",
    "balance": "number",
    "currency": "ISO4217 currency code",
    "created_at": "date string",
    "updated_at": "date string"
  }
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `currency`      | `ISO4217 currency code` | **Required**. |


### 🔁 Transactions

#### Add funds

This endpoints takes in the amount reuired for funding. It returns the transaction details which includes a **link** field which is the payment link which will be used to pay over any browser powered by Flutterwave.

```http
POST /transactions/fund-wallet
Content-Type: application/json
Authorization: Bearer Token <JWT>

Response:
  {
    "link": "string (payment-link)",
    "transaction_id": "string",
    "ref": "string",
    "source": "string",
    "amount": "number",
    "currency": "NGN",
    "status": "PENDING",
    "type": "FUNDING"
  }
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `amount`      | `number` | **Required**. |
| `source_wallet`      | `string` | **Required**. |
| `beneficiary_wallet`      | `string` | **Required**. |

#### Transfer funds

```http
POST /transactions/transfer
Content-Type: application/json
Authorization: Bearer Token <JWT>

Response:
  {
    "message": "success"
  }
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `amount`      | `number` | **Required**. |
| `wallet`      | `string` | **Required**. |


#### Withdraw funds

```http
POST /transactions/withdraw
Content-Type: application/json
Authorization: Bearer Token <JWT>

Response:
  {
    "transaction_id": "string",
    "ref": "string",
    "source": "string",
    "amount": "number",
    "currency": "NGN",
    "status": "PENDING",
    "type": "WITHDRAWAL"
  }
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `amount`      | `number` | **Required**. |
| `source_wallet`      | `string` | **Required**. |
| `bank_code`      | `string` | **Required**. |
| `account_number`      | `string` | **Required**. |


#### Retrieve own Transactions

```http
GET /transactions
Authorization: Bearer Token <JWT>

Response:
  [{
    "transaction_id": "string",
    "ref": "string",
    "source": "string",
    "amount": "number",
    "currency": "NGN",
    "status": "PENDING",
    "type": "WITHDRAWAL"
  }]
```

#### Retrieve Transaction

```http
GET /transactions/:transaction_id
Authorization: Bearer Token <JWT>

Response:
  {
    "transaction_id": "string",
    "ref": "string",
    "source": "string",
    "amount": "number",
    "currency": "NGN",
    "status": "PENDING",
    "type": "WITHDRAWAL"
  }
```
