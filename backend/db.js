// db.js
const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://Abhiramk:Pocom2%402004@cluster0.ugwhb.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0';

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

const Sighting = mongoose.model('Sighting', sightingSchema);

module.exports = Sighting;
