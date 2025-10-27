# LinkShortly API

A URL shortening service built with Fastify, TypeScript, and PostgreSQL. This is a learning and practice project to explore backend development concepts including authentication, database management, and API design.

## About the Project

LinkShortly is a RESTful API that allows users to:

- Register and authenticate
- Create shortened URLs from long links
- Track click statistics for their shortened URLs
- View detailed analytics for each link

### Technologies Used

- **Fastify** - Fast and low overhead web framework
- **TypeScript** - Type-safe JavaScript
- **Prisma** - Modern ORM for database management
- **PostgreSQL** - Relational database
- **JWT** - JSON Web Tokens for authentication
- **Zod** - Schema validation
- **bcrypt** - Password hashing
- **Docker** - Containerized database setup

## Features

### Authentication

- User registration with email and password
- Secure login with JWT token generation
- Password hashing with bcrypt

### URL Management

- Generate short codes for any URL
- Automatically detect duplicate URLs
- Track click counts per link
- Secure access with authentication

### Analytics

- View all user's shortened links
- Get detailed statistics for specific links
- Track creation date and click counts

### Security Features

- Rate limiting (10 requests per minute)
- CORS configuration
- Helmet security headers
- JWT-based authentication
- Password encryption

## Prerequisites

- Node.js (v18 or higher)
- pnpm (package manager)
- Docker and Docker Compose

## Installation & Setup

### 1. Clone the repository

```bash
cd backend
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Set up environment variables

Create a `.env` file in the backend directory:

```env
DATABASE_URL="postgresql://linkshortly:linkshortly@localhost:5432/linkshortly"
PORT=3333
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
```

**Important:** Change the `JWT_SECRET` to a secure random string in production.

### 4. Start the PostgreSQL database

Using Docker Compose:

```bash
docker-compose up -d
```

This will start a PostgreSQL container with the following configuration:

- Host: `localhost`
- Port: `5432`
- User: `linkshortly`
- Password: `linkshortly`
- Database: `linkshortly`

### 5. Run database migrations

```bash
npx prisma migrate dev
```

This will create the database tables based on the Prisma schema.

### 6. Generate Prisma Client

```bash
npx prisma generate
```

### 7. Start the development server

```bash
pnpm dev
```

The API will be available at `http://localhost:3333`

## API Endpoints

### Authentication

#### POST `/auth/register`

Register a new user.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (201):**

```json
{
  "id": "uuid",
  "email": "user@example.com",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

#### POST `/auth/login`

Login and get JWT token.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### URL Shortening

#### POST `/shorten`

Create a shortened URL. **Requires authentication.**

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "url": "https://example.com/very/long/url"
}
```

**Response (200):**

```json
{
  "shortUrl": "http://localhost:3333/r/abc123"
}
```

### Redirect

#### GET `/r/:code`

Redirect to the original URL and increment click count.

### Statistics

#### GET `/stats`

Get all shortened links for the authenticated user. **Requires authentication.**

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200):**

```json
{
  "links": [
    {
      "id": "uuid",
      "code": "abc123",
      "original": "https://example.com",
      "clicks": 5,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### GET `/stats/:code`

Get statistics for a specific shortened link. **Requires authentication.**

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200):**

```json
{
  "original": "https://example.com",
  "code": "abc123",
  "clicks": 5,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

## Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migrations/             # Database migrations
├── src/
│   ├── routes/
│   │   ├── auth.ts            # Authentication endpoints
│   │   ├── shorten.ts         # URL shortening logic
│   │   ├── redirect.ts        # Redirect handler
│   │   └── stats.ts           # Statistics endpoints
│   ├── lib/
│   │   └── prisma.ts          # Prisma client configuration
│   ├── plugins/
│   │   └── jwt.ts             # JWT authentication plugin
│   ├── error/
│   │   └── handler.ts         # Error handling
│   ├── types/
│   │   └── fastify.d.ts       # TypeScript type definitions
│   ├── env.ts                 # Environment variables validation
│   └── server.ts              # Main server setup
├── docker-compose.yml         # Database setup
├── package.json
└── README.md
```

## Development

### Running in Development Mode

```bash
pnpm dev
```

This uses `tsx watch` to automatically restart the server on file changes.

### Building for Production

```bash
pnpm build
pnpm start
```

### Database Management

Open Prisma Studio to view and edit data:

```bash
npx prisma studio
```

## Learning Objectives

This project demonstrates:

1. **RESTful API Design** - Clean endpoint structure
2. **Authentication & Authorization** - JWT tokens and secure password handling
3. **Database Design** - Relational models with Prisma ORM
4. **Type Safety** - Full TypeScript implementation with Zod validation
5. **Security Best Practices** - Rate limiting, CORS, password hashing
6. **Error Handling** - Centralized error management
7. **Logging** - Request and error logging with Pino
8. **Modular Architecture** - Separated routes, plugins, and utilities

## Contributing

This is a personal learning project. Suggestions and improvements are welcome!

## License

ISC
