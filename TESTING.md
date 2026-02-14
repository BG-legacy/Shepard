# Testing Guide for Church Care App

This guide will help you test all features of the Church Care application.

## Prerequisites

Make sure the application is running:
- Backend: `http://localhost:5000`
- Frontend: `http://localhost:3000`
- Database: PostgreSQL running with `church_care` database

## Test Scenarios

### 1. User Registration and Authentication

#### Test Case 1.1: Register as Admin
1. Navigate to `http://localhost:3000/register`
2. Fill in the form:
   - Email: `admin@church.com`
   - Password: `admin123`
   - Role: `Admin`
3. Click "Register"
4. Expected: Redirected to dashboard

#### Test Case 1.2: Logout
1. Click "Logout" in the navigation bar
2. Expected: Redirected to login page

#### Test Case 1.3: Login
1. Navigate to `http://localhost:3000/login`
2. Fill in credentials:
   - Email: `admin@church.com`
   - Password: `admin123`
3. Click "Login"
4. Expected: Redirected to dashboard

#### Test Case 1.4: Register as Leader
1. Logout and register a new user:
   - Email: `leader@church.com`
   - Password: `leader123`
   - Role: `Leader`

#### Test Case 1.5: Register as Volunteer
1. Logout and register a new user:
   - Email: `volunteer@church.com`
   - Password: `volunteer123`
   - Role: `Volunteer`

### 2. Member Management

Login as admin or leader for these tests.

#### Test Case 2.1: Add Member
1. Navigate to "Members" page
2. Click "Add Member"
3. Fill in the form:
   - First Name: `John`
   - Last Name: `Smith`
   - Email: `john.smith@email.com`
   - Phone: `555-0101`
   - Address: `123 Main St`
   - Birth Date: `1990-01-15`
   - Join Date: `2024-01-01`
   - Notes: `Active member, helps with youth ministry`
4. Click "Create"
5. Expected: Member appears in the list

#### Test Case 2.2: Add More Members
Add at least 3-4 more members with different information:

**Member 2:**
- First Name: `Mary`
- Last Name: `Johnson`
- Email: `mary.j@email.com`
- Phone: `555-0102`

**Member 3:**
- First Name: `David`
- Last Name: `Williams`
- Email: `david.w@email.com`
- Phone: `555-0103`

**Member 4:**
- First Name: `Sarah`
- Last Name: `Brown`
- Email: `sarah.b@email.com`
- Phone: `555-0104`

#### Test Case 2.3: Edit Member
1. Click "Edit" on John Smith's card
2. Update the phone number to `555-9999`
3. Click "Update"
4. Expected: Member information updated

#### Test Case 2.4: Delete Member (Admin Only)
1. Login as admin
2. Click "Delete" on a member (use caution)
3. Confirm deletion
4. Expected: Member removed from list

#### Test Case 2.5: Generate AI Insight
1. Click "AI Insight" on a member
2. Wait for generation
3. Expected: Success message (Note: Requires OpenAI API key)

### 3. Events and Attendance

#### Test Case 3.1: Create Event
1. Navigate to "Events" page
2. Click "Add Event"
3. Fill in the form:
   - Title: `Sunday Service`
   - Description: `Weekly worship service`
   - Date & Time: Select next Sunday at 10:00 AM
   - Location: `Main Sanctuary`
4. Click "Create"
5. Expected: Event appears in the list

#### Test Case 3.2: Create More Events
Add 2-3 more events:

**Event 2:**
- Title: `Bible Study`
- Date: Next Wednesday at 7:00 PM
- Location: `Fellowship Hall`

**Event 3:**
- Title: `Youth Group`
- Date: Next Friday at 6:00 PM
- Location: `Youth Room`

#### Test Case 3.3: Check-in Members
1. Click "Attendance" on Sunday Service event
2. Check in members:
   - Click "Check In" next to John Smith
   - Click "Check In" next to Mary Johnson
3. Expected: Members show as "✓ Checked In"

#### Test Case 3.4: View Attendance
1. In the attendance modal, verify the "Checked In" list shows:
   - John Smith with timestamp
   - Mary Johnson with timestamp
2. Close the modal

#### Test Case 3.5: Edit Event
1. Click "Edit" on an event
2. Update the time or description
3. Click "Update"
4. Expected: Event information updated

#### Test Case 3.6: Delete Event (Admin Only)
1. Login as admin
2. Click "Delete" on an event
3. Confirm deletion
4. Expected: Event removed from list

### 4. Care Tasks

#### Test Case 4.1: Create Task
1. Navigate to "Tasks" page
2. Click "Add Task"
3. Fill in the form:
   - Member: Select `John Smith`
   - Title: `Hospital Visit`
   - Description: `Follow up after surgery`
   - Status: `Pending`
   - Priority: `High`
   - Due Date: Tomorrow
4. Click "Create"
5. Expected: Task appears in the list

#### Test Case 4.2: Create More Tasks
Add 2-3 more tasks for different members:

**Task 2:**
- Member: `Mary Johnson`
- Title: `Welcome Call`
- Status: `In Progress`
- Priority: `Medium`

**Task 3:**
- Member: `David Williams`
- Title: `Prayer Request Follow-up`
- Status: `Completed`
- Priority: `Low`

#### Test Case 4.3: Update Task Status
1. Click "Edit" on the Hospital Visit task
2. Change status to `In Progress`
3. Click "Update"
4. Expected: Task status updated and badge color changes

#### Test Case 4.4: Verify Task Badges
1. Check that task cards show correct badges:
   - Yellow for Pending
   - Blue for In Progress
   - Green for Completed
   - Red for High priority
   - Orange for Medium priority
   - Gray for Low priority

#### Test Case 4.5: Delete Task (Admin Only)
1. Login as admin
2. Click "Delete" on a task
3. Confirm deletion
4. Expected: Task removed from list

### 5. Dashboard

#### Test Case 5.1: View Statistics
1. Navigate to "Dashboard"
2. Verify statistics cards show:
   - Total Members count
   - Not Seen Recently count

#### Test Case 5.2: Members Not Seen Recently
1. The dashboard should show members who:
   - Have never attended an event, OR
   - Haven't attended in 30+ days
2. Members you checked in recently should NOT appear here

### 6. Role-Based Access Control

#### Test Case 6.1: Volunteer Access
1. Logout and login as volunteer (`volunteer@church.com`)
2. Navigate through the app:
   - Dashboard: ✓ Should work
   - Members: ✓ Should view, but NO "Add Member" button
   - Events: ✓ Should view, check-in allowed, but NO "Add Event" button
   - Tasks: ✓ Should view, but NO "Add Task" button
3. Expected: Read-only access

#### Test Case 6.2: Leader Access
1. Logout and login as leader (`leader@church.com`)
2. Navigate through the app:
   - Dashboard: ✓ Should work
   - Members: ✓ Can add, edit, generate AI insights
   - Events: ✓ Can add, edit, check-in
   - Tasks: ✓ Can add, edit
3. Try to delete:
   - Expected: NO delete buttons (admin only)

#### Test Case 6.3: Admin Access
1. Logout and login as admin (`admin@church.com`)
2. Navigate through the app:
   - Dashboard: ✓ Should work
   - Members: ✓ Full access including delete
   - Events: ✓ Full access including delete
   - Tasks: ✓ Full access including delete
3. Expected: Full access to all features

### 7. Data Validation

#### Test Case 7.1: Required Fields
1. Try to create a member without required fields
2. Expected: Form validation errors

#### Test Case 7.2: Email Format
1. Try to enter an invalid email format
2. Expected: Browser validation error

#### Test Case 7.3: Duplicate Check-in
1. Try to check in the same member twice for the same event
2. Expected: Error message "Member already checked in"

### 8. UI/UX Tests

#### Test Case 8.1: Navigation
1. Test all navigation links in the navbar
2. Expected: Smooth navigation between pages

#### Test Case 8.2: Responsive Design
1. Resize browser window
2. Expected: Layout adjusts appropriately

#### Test Case 8.3: Modal Forms
1. Open and close various forms
2. Expected: Modals open/close smoothly, background dims

#### Test Case 8.4: Loading States
1. Observe loading messages during API calls
2. Expected: "Loading..." messages displayed appropriately

## API Testing (Optional)

You can also test the API directly using curl or Postman:

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","role":"admin"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

### Get Members (with token)
```bash
curl -X GET http://localhost:5000/api/members \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Expected Results Summary

✓ All features work as described
✓ Role-based access control enforced
✓ Data validation working
✓ UI is responsive and user-friendly
✓ No console errors in browser developer tools
✓ No server errors in terminal

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check credentials in backend/.env
- Verify database 'church_care' exists

### API Connection Issues
- Check if backend is running on port 5000
- Verify CORS is enabled
- Check frontend .env has correct API URL

### Authentication Issues
- Clear localStorage and try again
- Check if JWT_SECRET is set in backend/.env
- Verify token is being stored in localStorage

## Notes

- The "Not Seen Recently" feature requires 30+ days of no attendance
- To test this feature immediately, you can manually update the database or create events in the past
- AI Insights require a valid OpenAI API key in the backend .env file
