import http from 'k6/http';
import { sleep } from "k6";

import { htmlReport } from '../dist/bundle.js'
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js'

export function handleSummary(data) {
  return {
    'summary.html': htmlReport(data, { debug: false }),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  }
}

export const options = {
    scenarios: {
        k6_demo: {
            executor: 'ramping-arrival-rate',
            startRate: 10,
            stages: [
                // Level at 10 iters/s for 10 seconds
                { target: 10, duration: "10s" },
                // Spike from 10 iters/s to 150 iters/s in 5 seconds!
                { target: 150, duration: "5s" },
                // Level at 150 iters/s for 10 seconds
                { target: 150, duration: "10s" },
                // Slowing down from 150 iters/s to 100 iters/s over 20 seconds
                { target: 100, duration: "20s" },
                // Leveled off at 30 iters/s for remainder
                { target: 80, duration: "10s" },
            ],
            preAllocatedVUs: 5,
            maxVUs: 50,
        },
    },
}

export default function () {
    http.get('https://test.k6.io/');
    sleep(0.25);
}