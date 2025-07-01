# Product Availability Backend

This is the Express backend for crowdsourced product availability tracking.

## Setup

```bash
cd react-app/backend
npm install
npm run dev # for development (auto-reloads)
```

## MongoDB Setup
- Make sure you have MongoDB running locally or provide a MongoDB Atlas connection string.
- You can set the MongoDB URI with the `MONGO_URI` environment variable (defaults to `mongodb://localhost:27017/product_availability`).

## API Endpoints

### POST /sighting
Report a product sighting.
- Body: `{ productId, lat, lon, [userId] }`

### GET /sightings?productId=...
Get recent sightings for a product (last 6 hours).

### POST /sighting/validate
Validate if a sighting is still available.
- Body: `{ sightingId, available: true|false }`

## Database
- Uses MongoDB (collection: `sightings`) 