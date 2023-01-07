# 🏦 Wallet Service

<!-- TABLE OF CONTENTS -->
## Table of Contents
1. [About The Project](https://github.com/nwokoyepraise/wallet-service/edit/main/README.md#about-the-project)
2. [Services Available](https://github.com/nwokoyepraise/wallet-service/edit/main/README.md#-services-available)
3. [Built with](https://github.com/nwokoyepraise/wallet-service/edit/main/README.md#-built-with)
4. [Getting Started](https://github.com/nwokoyepraise/wallet-service/edit/main/README.md#-getting-started)
5. [API Reference](https://github.com/nwokoyepraise/wallet-service/edit/main/README.md#api-reference)
6. [Entity Relationship Diagram](https://github.com/nwokoyepraise/wallet-service/edit/main/README.md#entity-relation-diagram)
7. [Roadmap](https://github.com/nwokoyepraise/wallet-service/edit/main/README.md#roadmap)
8. [Contributing](https://github.com/nwokoyepraise/wallet-service/edit/main/README.md#contributing)
9. [License](https://github.com/nwokoyepraise/wallet-service/edit/main/README.md#license)
10. [Contact](https://github.com/nwokoyepraise/wallet-service/edit/main/README.md#contact)
<!-- <details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
    </li>
    <li><a href="#services-available">Services Available</a></li>
    <li><a href="#built-with">Built With</a></li>
    <li>
      <a href="#getting-started">Getting Started</a>
    </li>
    <li><a href="#api-reference">API Reference</a></li>
    <li><a href="#entity-relationshi-diagram">Entity Relationship Diagram</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details> -->

<!-- ABOUT THE PROJECT -->
## About the Project
Wallet service is a container-based NestJs Backend server wallet application 
where users are able to create accounts, fund their wallets, manage their funds, handle transfers bettween wallet owners, withdraw their funds, transactions history, etc. 

Needless to say, this application, features both local and stateless authetication using JSON Web Tokens which has been implemented using Passport library, and payment gateway integration for funds management and use of database transactions to ensure data integrity in critical multi-table queries and operations.

<!--⛳ SERVICES AVAILABLE -->
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

<!-- BUILT WITH -->
## 🔨 Built With
* Node.js
* NestJs (Typescript)
* MySQL
* KnexJs Query Builder
* Docker
* Passport.JS (Authentication)

<!-- GETTING STARTED -->
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

<!-- API REFERENCE -->
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


### 🔄 Transactions

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

<!-- ENTITY RELATIONSHIP DIAGRAM -->
## Entity Relation Diagram
![wallet-service drawio](https://user-images.githubusercontent.com/65955286/211134091-4417dbae-693e-4129-80bc-884bb4fdd7c4.svg)


<!-- ROADMAP -->
## Roadmap

See the [open issues](https://github.com/nwokoyepraise/wallet-service/issues) for a list of proposed features (and known issues).



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request



<!-- LICENSE -->
## License

Distributed under the GNU-V3 License. See `LICENSE` for more information.



<!-- CONTACT -->
## Contact

Project Link: [https://github.com/nwokoyepraise/wallet-service](https://github.com/nwokoyepraise/wallet-service)
