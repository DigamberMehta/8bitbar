# Square Environment Setup

This document explains how to configure Square payment integration for different environments.

## Environment Files

### Development (`.env`)

```env
VITE_SQUARE_APPLICATION_ID=sandbox-sq0idb-Y0zEcQ-gk3BITDuOwx-bBQ
VITE_SQUARE_LOCATION_ID=L40KMSWMN7GV4
VITE_SQUARE_ENVIRONMENT=sandbox
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

### Production (`.env.production`)

```env
VITE_SQUARE_APPLICATION_ID=YOUR_PRODUCTION_APP_ID
VITE_SQUARE_LOCATION_ID=YOUR_PRODUCTION_LOCATION_ID
VITE_SQUARE_ENVIRONMENT=production
VITE_API_BASE_URL=https://your-production-domain.com/api/v1
```

## How It Works

### Square SDK URLs

The `SquarePaymentForm.jsx` component automatically detects the environment and loads the appropriate Square SDK:

- **Development/Sandbox**: Uses `https://sandbox.web.squarecdn.com/v1/square.js`
- **Production**: Uses `https://web.squarecdn.com/v1/square.js`

### API Base URLs

The `axios.js` utility automatically uses the correct backend API URL:

- **Development**: Uses `http://localhost:3000/api/v1`
- **Production**: Uses `https://your-production-domain.com/api/v1`

## Setup Instructions

### For Development

1. The `.env` file is already configured for sandbox
2. Run `npm run dev` - it will use sandbox environment and local backend

### For Production

1. Update `.env.production` with your production credentials:
   - Replace `YOUR_PRODUCTION_APP_ID` with your production Square Application ID
   - Replace `YOUR_PRODUCTION_LOCATION_ID` with your production Square Location ID
   - Replace `https://your-production-domain.com/api/v1` with your actual production backend URL
2. Build for production: `npm run build`
3. Deploy the built files

## Environment Variables

| Variable                     | Description        | Development                    | Production                       |
| ---------------------------- | ------------------ | ------------------------------ | -------------------------------- |
| `VITE_SQUARE_ENVIRONMENT`    | Square environment | `sandbox`                      | `production`                     |
| `VITE_SQUARE_APPLICATION_ID` | Square App ID      | Sandbox ID                     | Production ID                    |
| `VITE_SQUARE_LOCATION_ID`    | Square Location ID | Sandbox ID                     | Production ID                    |
| `VITE_API_BASE_URL`          | Backend API URL    | `http://localhost:3000/api/v1` | `https://your-domain.com/api/v1` |

## Environment Detection

Both components use `import.meta.env.VITE_SQUARE_ENVIRONMENT` to determine the environment:

- If `VITE_SQUARE_ENVIRONMENT=production` → Production SDK and API
- Otherwise → Sandbox SDK and local API (default)

## Important Notes

- Never commit production credentials to version control
- Use environment variables for all sensitive data
- The backend also needs corresponding environment variables for Square API access
- Test thoroughly in sandbox before going to production
- Update the production domain in `.env.production` before deployment
