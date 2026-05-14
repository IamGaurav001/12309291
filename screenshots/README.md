# Screenshots

This directory contains verification screenshots for the assessment stages.

## 1. Backend Microservice (Stages 1-5)
- **schedule-api.png**: Postman request for `GET /api/schedule?depotId=1`.
- **optimization-output.png**: Detailed JSON response showing the 0/1 Knapsack optimization results.
- **logger-success.png**: Content of `logging_middleware/logs/service.log` showing structured logs and successful remote log submission.

## 2. Priority Inbox (Stage 6)
- **campus_notification.png**: Postman response from the external Notification API using the Bearer JWT.
- **priority_inbox.png**: Terminal output of `node priority_inbox.js` showing the Min-Heap algorithm sorting the top 10 notifications.
