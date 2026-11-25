# RideGo backend — Spring Boot

This replaces the original FastAPI placeholder in `backend/` with a Java 21 / Spring Boot REST API. The React/Vite frontend, Oracle schema, ER diagram and assets are retained.

## Stack
- Java 21, Spring Boot 3.5.7
- Spring Web, JDBC, Bean Validation
- Oracle JDBC (`ojdbc11`)
- BCrypt password hashing
- Oracle `database/schema.sql` is the source of truth; the API does not create or alter tables.

## Run locally
1. Install Java 21 and Maven 3.9+.
2. Create an Oracle schema/user and run `../database/schema.sql` in that empty schema.
3. Set the database environment variables (PowerShell shown):

```powershell
$env:DB_URL='jdbc:oracle:thin:@//localhost:1521/FREEPDB1'
$env:DB_USERNAME='YOUR_SCHEMA_USER'
$env:DB_PASSWORD='YOUR_SCHEMA_PASSWORD'
mvn spring-boot:run
```

Linux/macOS:
```bash
export DB_URL='jdbc:oracle:thin:@//localhost:1521/FREEPDB1'
export DB_USERNAME='YOUR_SCHEMA_USER'
export DB_PASSWORD='YOUR_SCHEMA_PASSWORD'
mvn spring-boot:run
```

API base URL: `http://localhost:8080`; health: `GET /actuator/health`.

## Authentication
- `POST /api/auth/register` — `{ "firstName":"Ada", "lastName":"Lovelace", "email":"ada@example.com", "password":"at-least-8-chars", "phone":"..." }`. Public registration always creates CUSTOMER.
- `POST /api/auth/login` — `{ "email":"...", "password":"..." }`; returns a random bearer token.
- Send `Authorization: Bearer <token>` for protected endpoints.
- `GET /api/auth/me`, `POST /api/auth/logout`.

Session tokens are random, only SHA-256 hashes are stored in `AUTH_SESSIONS`, sessions expire after seven days, and passwords are BCrypt hashes. Staff roles must be assigned out-of-band by an existing administrator using the admin role endpoint.

## Public catalogue
- `GET /api/cars` — optional `category`, `fuel`, `transmission`, `minPrice`, `maxPrice`, `locationId`, `startDate`, `endDate` filters.
- `GET /api/cars/{slug}`
- `GET /api/categories`
- `GET /api/locations`
- `GET /api/insurance`
- `POST /api/contact` — `{ "fullName":"...", "email":"...", "subject":"...", "message":"..." }`.

## Customer reservations (Bearer token)
- `POST /api/reservations` — `{ "carId":1, "pickupLocationId":1, "returnLocationId":1, "startDate":"2027-01-10", "endDate":"2027-01-13", "insuranceId":1, "notes":"..." }`; `insuranceId` and `notes` are optional.
- `GET /api/reservations/mine`
- `GET /api/reservations/{id}` (owner only)
- `PATCH /api/reservations/{id}/cancel` — `{ "reason":"..." }` (confirmed future reservations only).

Reservation prices are calculated server-side from database rates. The reservation insert runs in a transaction, locks the car row, and checks end-exclusive overlapping reservations before confirming a booking. Deposits are recorded separately from rental/insurance price.

## Administrator / staff operations
All `/api/admin/**` routes require an ADMIN bearer token, except inspection creation which accepts ADMIN or INSPECTOR.
- `GET /api/admin/dashboard`, `GET /api/admin/reservations`, `GET /api/admin/users`
- `PATCH /api/admin/users/{id}/role` — `{ "role":"INSPECTOR" }`
- `POST /api/admin/cars`, `PUT /api/admin/cars/{id}`, `DELETE /api/admin/cars/{id}` (deactivates, does not physically delete)
- `POST /api/admin/rentals/{reservationId}/checkout` — `{ "mileage":1234, "fuelLevel":90, "notes":"..." }`
- `POST /api/admin/rentals/{rentalId}/return` — `{ "mileage":1300, "fuelLevel":75, "notes":"..." }`
- `POST /api/admin/inspections`, `POST /api/admin/damages`, `POST /api/admin/charges`
- `POST /api/admin/maintenance`, `PATCH /api/admin/maintenance/{id}/status`
- `POST /api/admin/mileage`
- `POST /api/admin/payments/record`
- `POST /api/admin/refunds`
- `GET /api/admin/messages`, `PATCH /api/admin/messages/{id}`.

## Important payment limitation
The schema explicitly distinguishes a recorded payment from an actual card transaction. This backend can record cash, bank transfer or demo/manual payment results, and create pending refund records. It does **not** charge real cards or send refunds to a bank: that requires credentials and integration with a payment provider (e.g. Stripe/Barion) and its webhook verification. Do not send or store card numbers/CVV in this API.

## Notes
- Oracle schema is unchanged and must be installed before the API can start successfully.
- CORS is enabled for the Vite dev origins `localhost:5173` and `127.0.0.1:5173`.
- The frontend still contains demo data in `frontend/src/Data.js`; it needs a separate frontend integration change to consume these endpoints.
- The code has been authored against the supplied Oracle schema. Run the build and integration tests against your own Oracle instance before deployment; no Oracle server or Maven installation was available in the authoring environment to verify live database behavior.

## Creating the first administrator
For security, public registration cannot create an administrator. Register your own account first, then connect to Oracle as the schema owner and promote that account once:

```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'your-email@example.com';
COMMIT;
```

Do not expose this SQL operation through a public endpoint. After promotion, sign in again to receive a token with ADMIN permissions.
