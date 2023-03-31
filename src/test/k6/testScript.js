import http from 'k6/http';

import { sleep } from "k6";

//import { htmlReport } from '../src/test/dist/bundle.js'
import { htmlReport } from '../dist/bundle.js'
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js'
import { Trend } from 'k6/metrics';

export const options = {
  discardResponseBodies: true,
  scenarios: {
    contacts: {
      executor: 'constant-arrival-rate',
      exec: 'contacts',
      //vus: 50,
      duration: '30s',
      rate: 1,
      preAllocatedVUs: 1,
      timeUnit: "1s",
    },
    news: {
      executor: 'constant-arrival-rate',
      exec: 'news',
      //vus: 10,
      //iterations: 100,
      //startTime: '30s',
      duration: '30s',
      rate: 2,
      preAllocatedVUs: 2,
      timeUnit: "1s",
    },
  },
  thresholds: {
      http_req_duration: ['p(95)<1000'],
      iteration_duration: ['max<7000'],
  },
  summaryTrendStats: ["min", "max", "avg","med", "p(90)", "p(95)", "rate", "count"],
};

let requestTrend1 = new Trend('Request1')
let requestTrend2 = new Trend('Request2')

export function contacts() {
  let resp;
  resp=http.get('https://test.k6.io/contacts.php', {
    tags: { my_custom_tag: 'contacts' },
  });
  requestTrend1.add(resp.timings.duration)
}

export function news() {
  let resp;
  resp=http.get('https://test.k6.io/news.php', { tags: { my_custom_tag: 'news' } });
  requestTrend2.add(resp.timings.duration)
}

export function handleSummary(data) {
  return {
    //'/Users/praveend/Documents/GitHub/k6/tqe-perf-eng-qPerfBaseProject-k6/src/test/Reports/k6summary.html': htmlReport(data, { debug: false }),
    'k6-report/k6summary.html': htmlReport(data, { debug: false }),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  }
}
