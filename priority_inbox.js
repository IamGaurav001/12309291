require('dotenv').config();
const axios = require('axios');
const { Log } = require('./logging_middleware');

const logger = {
    info: (msg) => Log('backend', 'info', 'service', msg),
    warn: (msg) => Log('backend', 'warn', 'service', msg),
    error: (msg) => Log('backend', 'error', 'service', msg)
};

const sampleNotifications = [
    { ID: "d146095a-0d86-4a34-9e69-3900a14576bc", Type: "Result", Message: "mid-sem results live", Timestamp: "2026-04-22 17:51:30" },
    { ID: "2", Type: "Placement", Message: "Google DeepMind Shortlisting", Timestamp: "2026-05-14 10:00:00" },
    { ID: "3", Type: "Event", Message: "Annual Cultural Fest Launch", Timestamp: "2026-05-10 14:00:00" },
    { ID: "4", Type: "Placement", Message: "Amazon On-Campus Drive Registration", Timestamp: "2026-05-12 09:30:00" },
    { ID: "5", Type: "Result", Message: "Semester 6 Final Grades", Timestamp: "2026-05-01 11:15:00" },
    { ID: "6", Type: "Event", Message: "AI Hackathon Information Session", Timestamp: "2026-05-13 16:00:00" },
    { ID: "7", Type: "Placement", Message: "Microsoft Code To Win Invitation", Timestamp: "2026-05-11 18:00:00" },
    { ID: "8", Type: "Result", Message: "Re-evaluation Updates Published", Timestamp: "2026-04-28 12:00:00" },
    { ID: "9", Type: "Event", Message: "Alumni Meet 2026 Registrations", Timestamp: "2026-05-05 15:30:00" },
    { ID: "10", Type: "Placement", Message: "Affordmed Campus Hiring Interview Prep", Timestamp: "2026-05-14 12:00:00" },
    { ID: "11", Type: "Result", Message: "Lab External Scores Released", Timestamp: "2026-05-08 08:45:00" },
    { ID: "12", Type: "Event", Message: "Robotics Club Core Recruitment", Timestamp: "2026-05-09 17:00:00" },
    { ID: "13", Type: "Placement", Message: "Goldman Sachs Internship Offers", Timestamp: "2026-05-13 20:00:00" }
];

class MinHeap {
    constructor(cmp) {
        this.heap = [];
        this.cmp = cmp;
    }

    size() { return this.heap.length; }
    top() { return this.heap[0]; }

    push(val) {
        this.heap.push(val);
        this._up(this.heap.length - 1);
    }

    pop() {
        if (this.heap.length === 0) return null;
        let top = this.heap[0];
        let last = this.heap.pop();
        if (this.heap.length > 0) {
            this.heap[0] = last;
            this._down(0);
        }
        return top;
    }

    _up(i) {
        while (i > 0) {
            let parent = Math.floor((i - 1) / 2);
            if (this.cmp(this.heap[i], this.heap[parent]) < 0) {
                [this.heap[i], this.heap[parent]] = [this.heap[parent], this.heap[i]];
                i = parent;
            } else break;
        }
    }

    _down(i) {
        let len = this.heap.length;
        while (true) {
            let left = 2 * i + 1;
            let right = 2 * i + 2;
            let smallest = i;

            if (left < len && this.cmp(this.heap[left], this.heap[smallest]) < 0) smallest = left;
            if (right < len && this.cmp(this.heap[right], this.heap[smallest]) < 0) smallest = right;

            if (smallest !== i) {
                [this.heap[i], this.heap[smallest]] = [this.heap[smallest], this.heap[i]];
                i = smallest;
            } else break;
        }
    }
}

function getWeight(type) {
    if (type === 'Placement') return 3;
    if (type === 'Result') return 2;
    if (type === 'Event') return 1;
    return 0;
}

function compare(a, b) {
    let wa = getWeight(a.Type);
    let wb = getWeight(b.Type);
    if (wa !== wb) return wa - wb;
    return new Date(a.Timestamp).getTime() - new Date(b.Timestamp).getTime();
}

async function getTopK(k = 10) {
    logger.info(`Computing top ${k} priority notifications`);
    let notifications = sampleNotifications;

    let token = process.env.EVALUATION_TOKEN || process.env.BEARER_TOKEN || 'TRvZWq';
    try {
        let res = await axios.get('http://4.224.186.213/evaluation-service/notifications', {
            headers: { 'Authorization': `Bearer ${token}` },
            timeout: 5000
        });
        if (res.data && res.data.notifications) {
            notifications = res.data.notifications;
            logger.info(`Got ${notifications.length} notifications from API`);
        }
    } catch (err) {
        logger.warn(`Notification API failed (${err.message}), using local data`);
    }

    let heap = new MinHeap(compare);

    for (let item of notifications) {
        if (heap.size() < k) {
            heap.push(item);
        } else if (compare(item, heap.top()) > 0) {
            heap.pop();
            heap.push(item);
        }
    }

    let topK = [];
    while (heap.size() > 0) {
        topK.unshift(heap.pop());
    }

    logger.info(`Top ${k} notifications computed successfully`);
    return topK;
}

if (require.main === module) {
    getTopK(10).then(results => {
        console.log("\n=======================================================");
        console.log("   PRIORITY INBOX - TOP 10 NOTIFICATIONS");
        console.log("=======================================================\n");
        results.forEach((n, i) => {
            console.log(`[${i + 1}] ${n.Type.padEnd(10)} | ${n.Timestamp} | ${n.Message}`);
        });
        console.log("\n=======================================================");
    }).catch(err => {
        console.error("Error:", err);
    });
}

module.exports = { getTopK, MinHeap, compare };
