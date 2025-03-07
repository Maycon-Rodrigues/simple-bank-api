# Simple Bank API

## Description

This is an API for managing financial transactions between clients, developed with **NestJS** and **Prisma ORM**. The API ensures data consistency using **Prisma Transactions** for atomic operations and also makes external requests to validate transactions.

## Technologies Used

| Technology                                                                                                        | Description           |
| ----------------------------------------------------------------------------------------------------------------- | --------------------- |
| ![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)             | Node.js framework     |
| ![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)             | Database management   |
| ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white) | Main database         |
| ![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)                | For external requests |
| ![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=white)          | API documentation     |

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/your-repository.git
   ```
2. Navigate to the project folder:
   ```bash
   cd your-repository
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Configure environment variables in the `.env` file:
   ```env
   DATABASE_URL=postgresql://docker:docker@localhost:5432/nest
   EXTERNAL_API_URL=https://designer.mocky.io/
   ```
5. Run docker-composer:
   ```
   docker compose up -d
   ```
6. Run Prisma migrations:
   ```bash
   npx prisma migrate dev
   ```
7. Start the server:

   ```bash
   # development
   $ npm run start

   # watch mode
   $ npm run start:dev
   ```

## Main Endpoints

### Create Client

**POST** `/clients`

```json
{
  "name": "John Doe",
  "document": "9999999999",
  "type": "COMMON",
  "balance": 1000
}
```

### Create Transaction

**POST** `/transactions`

```json
{
  "message": "Authorized",
  "payeeId": "7aa33081-5007-48d6-8935-9c4d0dda2391",
  "amount": 100
}
```

### External Service Response

**Get** `https://designer.mocky.io/{uuid}`

```json
{
  "message": "Authorized"
}
```

- Validates if `payer` is `COMMON` before the transaction.
- Validates that the `payer` and `payee` are the same before the transaction.
- Validates that the `payer` has a sufficient balance before the transaction.
- Validates the value of the transfer is greater than zero before the transaction.
- Makes an external request to validate the transaction before processing it.
- Uses **Prisma Transaction** to ensure rollback in case of failure.

## Documentation

The API has automatically generated documentation with **Swagger**.
Access at: `http://localhost:3000/api`

## Contribution

1. Fork the repository
2. Create a branch (`feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to your branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## License

This project is under the [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
