// db.js
const mongoose = require('mongoose');
const { MONGO_URI } = require('./config');

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const sightingSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  lat: { type: Number, required: true },
  lon: { type: Number, required: true },
  timestamp: { type: Date, required: true },
  userId: { type: String },
  available: { type: Boolean, default: true },
});

const userPreferenceSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    name: { type: String },
    age: { type: Number },
    skin_type: { type: String },
    skin_concern: { type: String },
    hair_type: { type: String },
    hair_concern: { type: String },
    allergens: { type: String },
    ingredients: { type: String },
    vegan: { type: String },
    fragrance_free: { type: String },
    budget: { type: String },
  },
  { timestamps: true }
);

const Sighting = mongoose.model('Sighting', sightingSchema);
const UserPreference = mongoose.model('UserPreference', userPreferenceSchema);

module.exports = { Sighting, UserPreference };
