# Backend Engineering Assessment - 12309291

## Candidate Info
- **Name:** Gaurav Kumar Dubey
- **Roll No:** 12309291
- **Email:** hellogauravdubey@gmail.com
- **Mobile:** 7989320169
- **GitHub:** IamGaurav001
- **Access Code:** TRvZWq

---

## What is this project?

This is a backend microservice built with **Node.js** and **Express.js** that does two main things:
1. Optimizes vehicle maintenance schedules using the **0/1 Knapsack algorithm** (Dynamic Programming)
2. Implements a **Priority Inbox** system using a Min-Heap data structure

It also includes a custom **logging middleware** that logs to both a local file and a remote evaluation API.

---

## Project Structure

```
12309291/
├── logging_middleware/          # Reusable logging package
│   ├── index.js                # Log() function and Express middleware
│   ├── logs/                   # Auto-generated log files
│   └── package.json
├── vehicle_maintenance_scheduler/  # Main Express microservice
│   ├── src/
│   │   ├── app.js              # Express app setup
│   │   ├── server.js           # Entry point
│   │   ├── config/             # Environment config
│   │   ├── controllers/        # Route handlers
│   │   ├── middleware/         # Error handler
│   │   ├── routes/             # API routes
│   │   ├── services/           # Business logic + API calls
│   │   └── utils/              # Knapsack algorithm + logger wrapper
│   └── package.json
├── priority_inbox.js           # Stage 6 - Min-Heap Top-K implementation
├── notification_system_design.md  # System design document (Stages 1-6)
├── screenshots/                # Output screenshots for submission
└── README.md                   # This file
```

---

## How to Setup

### 1. Install Dependencies
```bash
cd logging_middleware
npm install

cd ../vehicle_maintenance_scheduler
npm install
```

### 2. Environment Variables
Create a `.env` file in `vehicle_maintenance_scheduler/`:
```
PORT=3000
EVALUATION_TOKEN=TRvZWq
BEARER_TOKEN=TRvZWq
EVALUATION_SERVICE_BASE_URL=http://4.224.186.213/evaluation-service
```

### 3. Run the Server
```bash
# from root directory
npm run dev

# or from vehicle_maintenance_scheduler/
node src/server.js
```

Server starts on `http://localhost:3000`

---

## API Endpoints

### Get Optimized Schedule
```
GET http://localhost:3000/api/schedule?depotId=1
```
Returns the optimal set of maintenance tasks that maximizes impact without exceeding the depot's mechanic hours budget.

**Sample Response:**
```json
{
  "depotId": 1,
  "mechanicHours": 60,
  "selectedTasks": [...],
  "totalDuration": 60,
  "totalImpact": 117
}
```

### List All Depots
```
GET http://localhost:3000/api/depots
```

### List All Vehicles
```
GET http://localhost:3000/api/vehicles
```

### Health Check
```
GET http://localhost:3000/health
```

---

## How the Optimization Works

The vehicle maintenance scheduler uses the **0/1 Knapsack Problem** approach:
- Each maintenance task has a `Duration` (weight) and `Impact` (value)
- Each depot has limited `MechanicHours` (capacity)
- The algorithm picks the best combination of tasks that gives maximum total impact without going over the available hours
- Time complexity: **O(n × W)** where n = number of tasks, W = mechanic hours

---

## Priority Inbox (Stage 6)

Run it separately:
```bash
node priority_inbox.js
```

This uses a **Min-Heap** to efficiently find the top 10 most important notifications.
- Placement notifications have highest priority (weight 3)
- Result notifications are next (weight 2)  
- Event notifications have lowest priority (weight 1)
- Within same type, newer notifications rank higher
- Time complexity: **O(n log k)** where k = 10

---

## Logging Middleware

The custom logging package exposes `Log(stack, level, package, message)` which:
1. Writes structured JSON logs to `logging_middleware/logs/service.log`
2. Sends logs to the remote evaluation API at `POST /evaluation-service/logs`
3. Works as Express middleware for automatic request/response logging

All logs follow the required format with valid `stack`, `level`, and `package` values.

---

## System Design

See `notification_system_design.md` for the complete system design covering:
- Stage 1: REST API Design
- Stage 2: PostgreSQL Database Schema
- Stage 3: Database Optimization & Indexing
- Stage 4: Caching with Redis
- Stage 5: Bulk Notification Processing with Message Queues
- Stage 6: Priority Inbox Algorithm
