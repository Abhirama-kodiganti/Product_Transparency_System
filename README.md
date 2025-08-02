# Really - Product Truth Verification App 🛍️

A React Native mobile application built with Expo that helps users verify the authenticity and safety of products by scanning barcodes and providing detailed information about ingredients, side effects, and alternatives.

## 🚀 Features

### Core Features
- **Barcode Scanning**: Scan product barcodes to get instant information
- **Product Database**: Comprehensive database of medicines, cosmetics, and food products
- **Detailed Information**: Get detailed information about:
  - Product ingredients and composition
  - Side effects and warnings
  - Drug interactions
  - Age-appropriate usage
  - Pregnancy safety information
  - Diabetes compatibility
  - Trust indicators and certifications
  - Alternative products and brands

### App Sections
- **Home**: Main dashboard with quick access to scanning and categories
- **Medicine**: Comprehensive medicine database with detailed information
- **Cosmetics**: Beauty and personal care product verification
- **Category**: Browse products by categories
- **Product Details**: Detailed view of individual products

### Premium Features
- **Really Plus**: Unlock personalized insights and advanced features
- **Enhanced Scanning**: Better accuracy and faster results
- **Personalized Recommendations**: Get product suggestions based on your profile

## 🛠️ Tech Stack

- **Frontend**: React Native with Expo
- **Backend**: Node.js with Express
- **Database**: MongoDB Atlas
- **Navigation**: Expo Router (file-based routing)
- **UI Components**: Custom components with React Native
- **Icons**: Expo Vector Icons

## 📱 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- MongoDB Atlas account (for backend)

### Frontend Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Real_mobile_App
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run on your preferred platform**
   - Press `a` for Android emulator
   - Press `i` for iOS simulator
   - Scan QR code with Expo Go app on your phone

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Configure MongoDB**
   
   **Option 1: Environment Variable (Recommended)**
   ```bash
   export MONGO_URI="your-mongodb-connection-string"
   ```
   
   **Option 2: Config File**
   Create `backend/config.js`:
   ```javascript
   const MONGO_URI = 'your-mongodb-connection-string';
   module.exports = { MONGO_URI };
   ```

4. **Start the backend server**
   ```bash
   node server.js
   ```

## 🔧 Environment Configuration

### MongoDB Setup
The app uses MongoDB Atlas for data storage. To set up your database:

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Set it as an environment variable or in the config file

**Security Note**: The `config.js` file is excluded from version control to protect sensitive data.

## 📁 Project Structure

```
Real_mobile_App/
├── app/                    # Main app screens (Expo Router)
│   ├── (tabs)/            # Tab navigation screens
│   │   ├── index.tsx      # Home screen
│   │   ├── medicine.tsx   # Medicine database
│   │   └── cosmetics.tsx  # Cosmetics database
│   └── category.tsx       # Category browser
├── components/            # Reusable React components
├── constants/             # App constants and data
│   ├── Colors.ts         # Color definitions
│   └── Medical_DB.ts     # Medicine database
├── backend/              # Backend server
│   ├── server.js         # Express server
│   ├── db.js            # Database connection
│   └── config.js        # Configuration (gitignored)
├── assets/              # Images and static files
└── utils/               # Utility functions
```

## 🔒 Security Features

- **Environment Variables**: Sensitive data stored in environment variables
- **Gitignore Protection**: Configuration files with credentials excluded from version control
- **Secure Database**: MongoDB Atlas with proper authentication

## 🚀 Recent Updates

### Version 1.0.0
- ✅ **App Rebranding**: Changed from "TruthIn" to "Really" throughout the app
- ✅ **Security Enhancement**: Moved MongoDB URI to secure configuration
- ✅ **Code Organization**: Moved data files to appropriate directories
- ✅ **Route Fix**: Resolved Expo Router warnings by organizing file structure

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-username/your-repo/issues) page
2. Create a new issue with detailed information
3. Contact the development team

## 🔮 Future Roadmap

- [ ] AI-powered product analysis
- [ ] User reviews and ratings
- [ ] Offline database support
- [ ] Multi-language support
- [ ] Advanced filtering options
- [ ] Integration with e-commerce platforms

---

**Built with ❤️ using React Native and Expo**
