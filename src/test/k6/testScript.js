import http from 'k6/http';

import { sleep } from "k6";

//import { htmlReport } from '../src/test/dist/bundle.js'
import { htmlReport } from '../dist/bundle.js'
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js'

export function handleSummary(data) {
  return {
    //'/Users/praveend/Documents/GitHub/k6/tqe-perf-eng-qPerfBaseProject-k6/src/test/Reports/k6summary.html': htmlReport(data, { debug: false }),
    'k6-report/k6summary.html': htmlReport(data, { debug: false }),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  }
}

export const options = {
  discardResponseBodies: true,
  scenarios: {
   /* contacts: {
      executor: 'constant-vus',
      exec: 'contacts',
      vus: 50,
      duration: '30s',
    },*/
    news: {
      executor: 'constant-arrival-rate',
      exec: 'news',
      //vus: 10,
      //iterations: 100,
      //startTime: '30s',
      duration: '5m',
      rate: 2,
      preAllocatedVUs: 2,
      timeUnit: "1s",
    },
  },
};

export function contacts() {
  http.get('https://test.k6.io/contacts.php', {
    tags: { my_custom_tag: 'contacts' },
  });
}

export function news() {
  http.get('https://test.k6.io/news.php', { tags: { my_custom_tag: 'news' } });
}
