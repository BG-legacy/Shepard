# Quick Reference Guide

## Default Login Credentials (after running sample-data.sql)

| Email | Password | Role |
|-------|----------|------|
| admin@church.com | password123 | Admin |
| leader@church.com | password123 | Leader |
| volunteer@church.com | password123 | Volunteer |

## Project Structure

```
Shepard/
├── backend/                    # Node.js/Express API
│   ├── database/
│   │   ├── schema.sql         # Database schema
│   │   └── sample-data.sql    # Sample test data
│   ├── scripts/
│   │   └── generate-hashes.js # Password hash generator
│   ├── src/
│   │   ├── config/            # Database configuration
│   │   ├── controllers/       # Business logic
│   │   ├── middleware/        # Auth middleware
│   │   ├── routes/           # API endpoints
│   │   ├── utils/            # Utility functions
│   │   └── server.js         # Express server
│   ├── .env.example          # Environment variables template
│   ├── Dockerfile            # Backend Docker config
│   └── package.json
│
├── frontend/                  # React application
│   ├── public/
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── context/          # React Context (Auth)
│   │   ├── pages/            # Page components
│   │   ├── services/         # API service layer
│   │   ├── App.js            # Main app component
│   │   └── index.js          # Entry point
│   ├── .env.example          # Frontend environment template
│   ├── Dockerfile            # Frontend Docker config
│   ├── nginx.conf            # Nginx configuration
│   └── package.json
│
├── docker-compose.yml         # Docker Compose configuration
├── setup.sh                   # Automated setup script
├── README.md                  # Main documentation
├── TESTING.md                 # Testing guide
└── QUICK-REFERENCE.md         # This file
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (requires auth)

### Members
- `GET /api/members` - List all members
- `GET /api/members/:id` - Get member details
- `GET /api/members/not-seen-recently` - Members not seen in 30+ days
- `POST /api/members` - Create member (admin/leader)
- `PUT /api/members/:id` - Update member (admin/leader)
- `DELETE /api/members/:id` - Delete member (admin only)

### Events
- `GET /api/events` - List all events
- `GET /api/events/:id` - Get event details
- `POST /api/events` - Create event (admin/leader)
- `PUT /api/events/:id` - Update event (admin/leader)
- `DELETE /api/events/:id` - Delete event (admin only)
- `POST /api/events/:eventId/checkin/:memberId` - Check-in member
- `GET /api/events/:eventId/attendance` - Get attendance list

### Tasks
- `GET /api/tasks` - List all tasks
- `GET /api/tasks/member/:memberId` - Get tasks for member
- `POST /api/tasks` - Create task (admin/leader)
- `PUT /api/tasks/:id` - Update task (admin/leader)
- `DELETE /api/tasks/:id` - Delete task (admin only)
- `GET /api/tasks/notes/member/:memberId` - Get notes for member
- `POST /api/tasks/notes` - Create note

### AI Insights
- `POST /api/insights/member/:memberId` - Generate AI insight (admin/leader)
- `GET /api/insights/member/:memberId` - Get member insights

## Common Commands

### Start Development

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm start
```

### Database Operations

**Create Database:**
```bash
psql -U postgres -c "CREATE DATABASE church_care"
```

**Run Schema:**
```bash
psql -U postgres -d church_care -f backend/database/schema.sql
```

**Load Sample Data:**
```bash
psql -U postgres -d church_care -f backend/database/sample-data.sql
```

**Connect to Database:**
```bash
psql -U postgres -d church_care
```

### Docker Commands

**Start All Services:**
```bash
docker-compose up -d
```

**View Logs:**
```bash
docker-compose logs -f
```

**Stop All Services:**
```bash
docker-compose down
```

**Rebuild and Start:**
```bash
docker-compose up --build -d
```

## Role Permissions

| Action | Admin | Leader | Volunteer |
|--------|-------|--------|-----------|
| View Members | ✓ | ✓ | ✓ |
| Add/Edit Members | ✓ | ✓ | ✗ |
| Delete Members | ✓ | ✗ | ✗ |
| View Events | ✓ | ✓ | ✓ |
| Add/Edit Events | ✓ | ✓ | ✗ |
| Delete Events | ✓ | ✗ | ✗ |
| Check-in Attendance | ✓ | ✓ | ✓ |
| View Tasks | ✓ | ✓ | ✓ |
| Add/Edit Tasks | ✓ | ✓ | ✗ |
| Delete Tasks | ✓ | ✗ | ✗ |
| Add Notes | ✓ | ✓ | ✓ |
| Generate AI Insights | ✓ | ✓ | ✗ |

## Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=church_care
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRE=7d
OPENAI_API_KEY=your-openai-api-key
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Database Connection Error
1. Check if PostgreSQL is running: `pg_isready`
2. Verify credentials in backend/.env
3. Ensure database exists: `psql -U postgres -l | grep church_care`

### Frontend Can't Connect to Backend
1. Check if backend is running: `curl http://localhost:5000/api/health`
2. Verify CORS is enabled in backend
3. Check frontend .env has correct API URL

### JWT Token Issues
1. Clear browser localStorage
2. Ensure JWT_SECRET is set in backend/.env
3. Check token expiration (default 7 days)

## Tips

- Use browser DevTools to inspect network requests
- Check backend console for API errors
- Monitor database with: `watch -n 1 'psql -U postgres -d church_care -c "SELECT COUNT(*) FROM members"'`
- Generate new password hashes: `node backend/scripts/generate-hashes.js`

## URLs

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Health Check: http://localhost:5000/api/health
- PostgreSQL: localhost:5432

## Support

For issues and questions:
1. Check TESTING.md for detailed test scenarios
2. Review README.md for setup instructions
3. Open an issue on GitHub
