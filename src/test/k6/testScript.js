import http from 'k6/http';

import { sleep } from "k6";

import { htmlReport } from '../lib/bundle.js'
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js'
import { Trend } from 'k6/metrics';

export const options = {
  discardResponseBodies: true,
  scenarios: {
    contacts: {
      executor: 'constant-arrival-rate',
      exec: 'contacts',
      duration: '60m',
      rate: 200,
      preAllocatedVUs: 200,
      timeUnit: "1s",
    },
    news: {
      executor: 'constant-arrival-rate',
      exec: 'news',
      duration: '60m',
      rate: 200,
      preAllocatedVUs: 200,
      timeUnit: "1s",
    },
  },
  tags: {
      test_name: 'Test3'
  },
  summaryTrendStats: ["min", "max", "avg","med", "p(90)", "p(95)", "count"],
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
  resp=http.get('https://test.k6.io/news.php', {
    tags: { my_custom_tag: 'news' } ,
  });
  requestTrend2.add(resp.timings.duration)
}

export function handleSummary(data) {
  return {
    'k6-report/k6summary.html': htmlReport(data, { debug: false }),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  }
}
