# Church Care App

A comprehensive full-stack Church Care application built with React, Node.js, Express, PostgreSQL, and OpenAI API. This app helps churches manage their members, track attendance, manage care tasks, and generate AI-powered insights.

## Features

- **Authentication & Authorization**: JWT-based auth with role-based access control (admin, leader, volunteer)
- **Member Management**: Full CRUD operations for church members with required phone and email
- **Events & Attendance**: Create events and check-in members with attendance tracking
- **Care Tasks & Notes**: Manage care tasks with status tracking and add notes for members
- **AI Insights**: Generate AI-powered care insights for members using OpenAI
- **Dashboard**: View members not seen recently (30+ days) and key statistics

## Tech Stack

### Backend
- Node.js
- Express.js
- PostgreSQL
- JWT for authentication
- bcryptjs for password hashing
- OpenAI API for AI insights

### Frontend
- React (Create React App)
- React Router for navigation
- Axios for API calls
- Context API for state management

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- OpenAI API key (optional, for AI insights feature)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/BG-legacy/Shepard.git
cd Shepard
```

### 2. Database Setup

Install PostgreSQL and create a database:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE church_care;

# Exit psql
\q
```

Run the schema to create tables:

```bash
psql -U postgres -d church_care -f backend/database/schema.sql
```

### 3. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env file with your configuration
# Update the following:
# - DB_USER and DB_PASSWORD (your PostgreSQL credentials)
# - JWT_SECRET (generate a secure random string)
# - OPENAI_API_KEY (your OpenAI API key, optional)

# Start the server
npm start
```

The backend server will run on `http://localhost:5000`

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file (optional)
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env

# Start the development server
npm start
```

The frontend will run on `http://localhost:3000`

## Usage

### First-Time Setup

1. Open your browser and navigate to `http://localhost:3000`
2. Click on "Register" to create your first user account
3. Choose the "admin" role for full access
4. After registration, you'll be redirected to the dashboard

### User Roles

- **Admin**: Full access to all features including delete operations
- **Leader**: Can create, read, and update members, events, and tasks
- **Volunteer**: Read-only access to view members, events, and tasks

### Key Features

#### Member Management
- Add new members with required phone and email
- Edit member information
- View all members
- Generate AI insights for individual members (admin/leader only)

#### Events & Attendance
- Create events with date, time, and location
- Check-in members at events
- View attendance history
- Track who attended which events

#### Care Tasks
- Create care tasks for specific members
- Assign tasks to users
- Set priority and due dates
- Track task status (pending, in progress, completed)
- Add notes to tasks

#### Dashboard
- View total member count
- See members not seen recently (30+ days)
- Quick overview of engagement

## API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user profile

### Member Endpoints

- `GET /api/members` - Get all members
- `GET /api/members/:id` - Get member by ID
- `GET /api/members/not-seen-recently` - Get members not seen in 30+ days
- `POST /api/members` - Create new member (admin/leader)
- `PUT /api/members/:id` - Update member (admin/leader)
- `DELETE /api/members/:id` - Delete member (admin only)

### Event Endpoints

- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event by ID
- `POST /api/events` - Create event (admin/leader)
- `PUT /api/events/:id` - Update event (admin/leader)
- `DELETE /api/events/:id` - Delete event (admin only)
- `POST /api/events/:eventId/checkin/:memberId` - Check-in member
- `GET /api/events/:eventId/attendance` - Get event attendance

### Task Endpoints

- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/member/:memberId` - Get tasks for member
- `POST /api/tasks` - Create task (admin/leader)
- `PUT /api/tasks/:id` - Update task (admin/leader)
- `DELETE /api/tasks/:id` - Delete task (admin only)
- `GET /api/tasks/notes/member/:memberId` - Get notes for member
- `POST /api/tasks/notes` - Create note

### AI Insights Endpoints

- `POST /api/insights/member/:memberId` - Generate AI insight (admin/leader)
- `GET /api/insights/member/:memberId` - Get insights for member

## Project Structure

```
Shepard/
├── backend/
│   ├── database/
│   │   └── schema.sql          # Database schema
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js     # Database connection
│   │   ├── controllers/        # Request handlers
│   │   │   ├── authController.js
│   │   │   ├── membersController.js
│   │   │   ├── eventsController.js
│   │   │   ├── tasksController.js
│   │   │   └── insightsController.js
│   │   ├── middleware/
│   │   │   └── auth.js         # Authentication middleware
│   │   ├── routes/             # API routes
│   │   │   ├── auth.js
│   │   │   ├── members.js
│   │   │   ├── events.js
│   │   │   ├── tasks.js
│   │   │   └── insights.js
│   │   ├── utils/
│   │   │   └── auth.js         # Auth utilities
│   │   └── server.js           # Express server
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   │   ├── Navbar.js
│   │   │   └── PrivateRoute.js
│   │   ├── context/
│   │   │   └── AuthContext.js  # Authentication context
│   │   ├── pages/              # Page components
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Dashboard.js
│   │   │   ├── Members.js
│   │   │   ├── Events.js
│   │   │   └── Tasks.js
│   │   ├── services/           # API services
│   │   │   ├── api.js
│   │   │   └── index.js
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   ├── .gitignore
│   └── package.json
└── README.md
```

## Security Considerations

- All passwords are hashed using bcryptjs
- JWT tokens are used for authentication
- Role-based access control for sensitive operations
- API endpoints are protected with authentication middleware
- SQL injection prevention through parameterized queries

## Future Enhancements

- Email notifications for tasks and events
- SMS reminders for attendance
- Report generation (PDF/Excel)
- Mobile app version
- Calendar integration
- Volunteer scheduling
- Donation tracking
- Group management

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.