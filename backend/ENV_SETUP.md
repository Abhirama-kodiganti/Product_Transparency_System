# Environment Setup

## MongoDB Configuration

To run this application, you need to set up your MongoDB connection string.

### Option 1: Environment Variable (Recommended)
Set the `MONGO_URI` environment variable with your MongoDB connection string:

```bash
export MONGO_URI="mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority"
```

### Option 2: Config File
Create a `config.js` file in the backend directory with your MongoDB URI:

```javascript
const MONGO_URI = 'your-mongodb-connection-string-here';

module.exports = {
  MONGO_URI
};
```

**Important**: The `config.js` file is already added to `.gitignore` to prevent sensitive data from being committed to version control.

### Security Note
- Never commit your actual MongoDB credentials to version control
- Use environment variables or secure config files
- The `config.js` file is excluded from git tracking 