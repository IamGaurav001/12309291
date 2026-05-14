# System Design for Campus Notifications

## Stage 1: API Design

I designed the API to be simple and easy to use. It uses standard HTTP methods and JSON.

### 1. Get Notifications
- **URL:** `GET /api/v1/notifications`
- **What it does:** Gets the list of notifications for a student. I added pagination so it doesn't load too much data at once.
- **Sample Response:**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "uuid-here",
        "type": "Placement",
        "title": "Google Drive",
        "message": "Check the portal for links.",
        "isRead": false,
        "createdAt": "2026-05-14T10:30:00Z"
      }
    ]
  }
  ```

### 2. Mark as Read
- **URL:** `PATCH /api/v1/notifications/:id/read`
- **What it does:** Updates a single notification to "read" status.

### 3. Real-Time Updates
I think we should use **Server-Sent Events (SSE)** for real-time updates. It's easier than WebSockets because it's just one-way (server to student) and it works over regular HTTP.

---

## Stage 2: Database (PostgreSQL)

I chose PostgreSQL because it's reliable and handles relational data well.

### Table Schema:
```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id BIGINT NOT NULL,
    type VARCHAR(50) NOT NULL, -- Placement, Result, or Event
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT now()
);
```

---

## Stage 3: Making it Faster (Indexing)

When the table gets big (like millions of rows), searching for one student's unread notifications gets slow.

To fix this, I'll add an index:
```sql
CREATE INDEX idx_student_unread ON notifications(student_id, is_read, created_at DESC);
```
This helps the database find the exact rows without scanning the whole table. Also, we shouldn't index every column because that makes saving data (INSERT/UPDATE) much slower.

---

## Stage 4: Caching with Redis

To make the app even faster, we can use Redis to:
1. Store the unread count for each student so we don't have to count them in the DB every time.
2. Store the most recent notifications so they load instantly.

We should also use **Cursor Pagination** instead of Offset/Limit because it's more efficient for large datasets.

---

## Stage 5: Handling Bulk Notifications

If we have to send a notification to 50,000 students at once, doing it in a simple loop is a bad idea because:
1. It will take too long and might timeout.
2. If it fails halfway, we don't know who got the message and who didn't.

### My Solution:
Use a **Message Queue** (like BullMQ or Kafka).
1. The API just puts the task in the queue and returns immediately.
2. Background workers pick up the tasks and process them in small batches.
3. If a worker fails, the queue can automatically retry sending the notification.

---

## Stage 6: Priority Inbox Logic

I implemented a **Min-Heap** to find the top 10 most important notifications.

### Priority Rules:
- Placements (Weight 3) are most important.
- Results (Weight 2) are next.
- Events (Weight 1) are lowest.
- If two are the same type, the newer one is more important.

Using a Min-Heap of size 10 is very fast (**O(N log 10)**) and doesn't use much memory. I calculate a score for each notification and keep only the top ones in the heap.
