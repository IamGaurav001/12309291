const logger = require('./logger');

function solveKnapsack(tasks, capacity) {
    logger.info('utils', `Running knapsack: ${tasks.length} tasks, capacity=${capacity}`);
    
    let n = tasks.length;
    let cap = Math.floor(capacity);
    
    let dp = [];
    for (let i = 0; i <= n; i++) {
        dp[i] = new Array(cap + 1).fill(0);
    }

    for (let i = 1; i <= n; i++) {
        let task = tasks[i - 1];
        let dur = Math.ceil(task.Duration);
        let imp = task.Impact;

        for (let w = 0; w <= cap; w++) {
            if (dur <= w) {
                dp[i][w] = Math.max(dp[i - 1][w], dp[i - 1][w - dur] + imp);
            } else {
                dp[i][w] = dp[i - 1][w];
            }
        }
    }

    let selected = [];
    let remaining = cap;
    let totalDur = 0;
    let maxImpact = dp[n][cap];

    for (let i = n; i > 0; i--) {
        if (dp[i][remaining] !== dp[i - 1][remaining]) {
            let task = tasks[i - 1];
            selected.unshift(task);
            let dur = Math.ceil(task.Duration);
            remaining -= dur;
            totalDur += task.Duration;
        }
    }

    logger.info('utils', `Knapsack done: picked ${selected.length} tasks, duration=${totalDur}, impact=${maxImpact}`);

    return {
        selectedTasks: selected,
        totalDuration: totalDur,
        totalImpact: maxImpact
    };
}

module.exports = { solveKnapsack };
