# MixTrip - Plan & Share Travel Itineraries

MixTrip is a web application that allows users to create, share, and explore travel itineraries. The platform enables travelers to plan detailed trips, share them with friends, and discover new destinations through the experiences of others.

## Phase 1: Foundation & Setup

This repository contains the initial setup and foundation of the MixTrip project, including:

- Basic Express server configuration
- MongoDB database connection
- Home page template with responsive design
- Project structure and file organization
- CSS styling system
- Environmental variables configuration

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript, EJS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: Express-session, Connect-mongo
- **Other Tools**: Morgan, Method-override, Dotenv

## Project Structure

```
MixTrip/
├── config/
│   └── db.js
├── models/
│   ├── Trip.js
│   └── User.js
├── public/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── main.js
│   └── img/
├── routes/
│   └── index.js
├── views/
│   ├── layouts/
│   │   └── main.ejs
│   ├── partials/
│   │   ├── header.ejs
│   │   └── footer.ejs
│   ├── index.ejs
│   ├── about.ejs
│   ├── 404.ejs
│   └── 500.ejs
├── .env
├── .gitignore
├── app.js
├── package.json
└── README.md
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

This is Phase 1 of a multi-phase project. Future phases will include:

- User authentication system
- Trip creation and management
- Sharing and privacy features
- Remix and comment system
- Search and recommendation functionality
- Social features and complete UI

## License

This project is licensed under the MIT License.