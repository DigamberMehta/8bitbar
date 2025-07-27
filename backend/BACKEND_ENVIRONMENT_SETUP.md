# Backend Environment Setup

This document explains how to configure the backend for different environments.

## Environment Files

### Development (`.env`)

```env
SECRET_KEY=dfsgbdfgiiujyhgdfgtertrefvdbghjghfvdsghb

SQUARE_ACCESS_TOKEN=EAAAl4aW070ZdBx7b81sPttvicHJmCoNBC9oeQEjZnSebPeM1xy8os3KeJwF7eqf
SQUARE_APPLICATION_ID=sandbox-sq0idb-Y0zEcQ-gk3BITDuOwx-bBQ
SQUARE_LOCATION_ID=L40KMSWMN7GV4
SQUARE_ENVIRONMENT=sandbox
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/8bitbar
PORT=3000
```

### Production (`.env.production`)

```env
# Production Environment - Backend
SECRET_KEY=YOUR_PRODUCTION_SECRET_KEY
SQUARE_ACCESS_TOKEN=YOUR_PRODUCTION_SQUARE_ACCESS_TOKEN
SQUARE_APPLICATION_ID=YOUR_PRODUCTION_SQUARE_APP_ID
SQUARE_LOCATION_ID=YOUR_PRODUCTION_SQUARE_LOCATION_ID
SQUARE_ENVIRONMENT=production
NODE_ENV=production
MONGODB_URI=YOUR_PRODUCTION_MONGODB_URI
PORT=3000
```

## How It Works

### Square API Configuration

The backend automatically detects the environment and uses the appropriate Square API endpoints:

- **Development/Sandbox**: Uses `https://connect.squareupsandbox.com`
- **Production**: Uses `https://connect.squareup.com`

### CORS Configuration

CORS origins are automatically set based on the environment:

- **Development**: Allows `http://localhost:5173` and `http://192.168.31.163:5173`
- **Production**: Allows `https://8bitbar.com.au` and `https://www.8bitbar.com.au`

### Database Configuration

MongoDB connection string is configurable via environment variables:

- **Development**: Uses local MongoDB (`mongodb://localhost:27017/8bitbar`)
- **Production**: Uses production MongoDB (set via `MONGODB_URI`)

## Environment Variables

| Variable                | Description               | Development     | Production         |
| ----------------------- | ------------------------- | --------------- | ------------------ |
| `SQUARE_ENVIRONMENT`    | Square environment        | `sandbox`       | `production`       |
| `SQUARE_ACCESS_TOKEN`   | Square API access token   | Sandbox token   | Production token   |
| `SQUARE_APPLICATION_ID` | Square application ID     | Sandbox ID      | Production ID      |
| `SQUARE_LOCATION_ID`    | Square location ID        | Sandbox ID      | Production ID      |
| `NODE_ENV`              | Node.js environment       | `development`   | `production`       |
| `MONGODB_URI`           | MongoDB connection string | Local URI       | Production URI     |
| `PORT`                  | Server port               | `3000`          | `3000` (or custom) |
| `SECRET_KEY`            | JWT secret key            | Development key | Production key     |

## Setup Instructions

### For Development

1. The `.env` file is already configured for development
2. Run `npm start` - it will use sandbox environment and local database

### For Production

1. Update `.env.production` with your production credentials:
   - Replace `YOUR_PRODUCTION_SECRET_KEY` with a strong secret key
   - Replace `YOUR_PRODUCTION_SQUARE_ACCESS_TOKEN` with your production Square access token
   - Replace `YOUR_PRODUCTION_SQUARE_APP_ID` with your production Square application ID
   - Replace `YOUR_PRODUCTION_SQUARE_LOCATION_ID` with your production Square location ID
   - Replace `YOUR_PRODUCTION_MONGODB_URI` with your production MongoDB connection string
2. Set the environment to production: `export NODE_ENV=production`
3. Start the server: `npm start`

## Environment Detection

The backend uses `process.env.SQUARE_ENVIRONMENT` to determine the environment:

- If `SQUARE_ENVIRONMENT=production` → Production Square API and CORS
- Otherwise → Sandbox Square API and development CORS (default)

## Important Notes

- Never commit production credentials to version control
- Use strong, unique secret keys for production
- Ensure your production MongoDB is properly secured
- Test thoroughly in sandbox before going to production
- Update CORS origins if your frontend domain changes
- Consider using a process manager like PM2 for production deployment
