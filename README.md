# MixTrip - Plan & Share Travel Itineraries

MixTrip is a web application that allows users to create, share, and explore travel itineraries. The platform enables travelers to plan detailed trips, share them with friends, and discover new destinations through the experiences of others.

## Current Development Status - Phase 3

The project has completed the following phases:

### ✅ Phase 1: Foundation & Setup
- Basic Express server configuration
- MongoDB database connection
- Home page template with responsive design
- Project structure and file organization
- CSS styling system
- Environmental variables configuration

### ✅ Phase 2: User Authentication System
- User registration and login
- Session management
- User profiles with customizable information
- Authentication middleware
- Secure password handling

### ✅ Phase 3: Trip Creation
- Trip model implementation
- Trip creation functionality
- Google Maps API integration (basic)
- Daily activities management
- Trip storage in database
- Trip display in user profiles
- Trip editing and deletion

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript, EJS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: Express-session, Connect-mongo
- **Other Tools**: Morgan, Method-override, Dotenv

## Project Structure

```
MixTrip/
├── config/                 # Configuration files
│   ├── db.js               # MongoDB connection
│   └── passport.js         # Authentication configuration
├── middleware/             # Custom middleware
│   └── auth.js             # Authentication middleware
├── models/                 # MongoDB models
│   ├── Trip.js             # Trip model
│   └── User.js             # User model
├── public/                 # Static assets
│   ├── css/                # Stylesheets
│   │   ├── style.css       # Main styles
│   │   ├── auth.css        # Authentication page styles
│   │   ├── profile.css     # Profile page styles
│   │   ├── user-tabs.css   # User tabs component styles
│   │   └── trip-create.css # Trip creation page styles
│   ├── js/                 # Client-side JavaScript
│   │   ├── main.js         # Main JavaScript
│   │   └── trip-utils.js   # Trip utilities
│   └── images/             # Images
├── routes/                 # Route handlers
│   ├── index.js            # Main routes
│   ├── users.js            # User-related routes
│   └── trips.js            # Trip-related routes
├── views/                  # EJS templates
│   ├── layouts/            # Layout templates
│   │   └── main.ejs        # Main layout
│   ├── partials/           # Reusable template parts
│   │   ├── header.ejs      # Header partial
│   │   ├── footer.ejs      # Footer partial
│   │   └── messages.ejs    # Flash messages partial
│   ├── users/              # User-related views
│   │   ├── login.ejs       # Login page
│   │   ├── register.ejs    # Registration page
│   │   ├── profile.ejs     # User profile page
│   │   └── edit-profile.ejs# Edit profile page
│   ├── trips/              # Trip-related views
│   │   ├── create.ejs      # Create trip page
│   │   ├── edit.ejs        # Edit trip page
│   │   ├── detail.ejs      # Trip details page
│   │   ├── explore.ejs     # Explore trips page
│   │   └── user-trips.ejs  # User's trips page
│   ├── index.ejs           # Home page
│   ├── about.ejs           # About page
│   ├── 404.ejs             # Not found page
│   └── 500.ejs             # Server error page
├── .env                    # Environment variables
├── .gitignore              # Git ignore file
├── app.js                  # Express application
├── package.json            # Dependencies
└── README.md               # Project documentation
```

## Getting Started

1. Clone the repository
   ```
   git clone https://github.com/witoon-skydea/mixtrip-slowstep.git
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Create a .env file with the following variables:
   ```
   PORT=5678
   MONGODB_URI=your_mongodb_connection_string
   NODE_ENV=development
   SESSION_SECRET=your_session_secret
   ```

4. Start the development server
   ```
   npm run dev
   ```

5. Open your browser and navigate to http://localhost:5678

## Future Development

This project is being developed in 7 phases. Completed phases are marked above, and future development will include:

### 🔄 Phase 4: Sharing & Privacy
- Public/private trip options
- Trip detail pages
- Trip sharing links
- Public trips on home page
- Explore page for discovering trips
- Access control permissions

### 🔄 Phase 5: Remix & Comments
- Trip remixing/forking feature
- Original trip reference
- Comment system
- Remix history
- Notifications for remixes and comments

### 🔄 Phase 6: Search & Recommendation
- Advanced trip search
- Filters (by location, duration, activities)
- Tagging system for trips
- Personalized trip recommendations
- Popular trips ranking
- Interactive map integration

### 🔄 Phase 7: Social Features & UI Completion
- User following system
- Activity feed
- Complete UI/UX polishing
- Responsive design for all devices
- Performance and speed optimization
- System stability testing
- Security review

## License

This project is licensed under the MIT License.