# CodeRadar

CodeRadar is a web application that tracks coding contests from platforms like Codeforces and LeetCode. It provides a user-friendly interface to view upcoming and past contests, helping developers participate more easily in competitive programming events.

## Features

- Track upcoming and past contests from Codeforces and LeetCode
- Filter contests by platform, status, and date
- Clean, responsive interface for easy viewing on any device
- Countdown timers for upcoming contests
- Reminders for contests you're interested in

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **API Integration**: Codeforces API, LeetCode API

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB

### Installation

1. Clone the repository
```
git clone https://github.com/arjun-chouksey/coderadar.git
cd coderadar
```

2. Install backend dependencies
```
cd backend
npm install
```

3. Install frontend dependencies
```
cd ../frontend
npm install
```

4. Create a `.env` file in the backend directory with the following variables:
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
```

5. Start the development servers

Backend:
```
cd backend
npm run dev
```

Frontend:
```
cd frontend
npm run dev
```

The application should now be running at `http://localhost:3000` with the backend API at `http://localhost:5000`.

## Project Structure

```
coderadar/
├── backend/             # Express.js server code
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   └── services/        # Service layer (data fetching, etc.)
├── frontend/            # React.js client code
│   ├── public/          # Static assets
│   └── src/             # React components and logic
│       ├── components/  # Reusable UI components
│       ├── pages/       # Page components
│       ├── services/    # API services
│       └── utils/       # Utility functions
└── README.md            # Project documentation
```

## Contributing

Contributions are welcome! Please feel free to submit a pull request. 
