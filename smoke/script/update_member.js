import http from 'k6/http';
import { check, group, sleep, fail } from 'k6';

export let options = {
  vus: 100, // 1 user looping for 1 minute
  duration: '10s',

  thresholds: {
    http_req_duration: ['p(99)<1500'], // 99% of requests must complete below 1.5s
  },
};

const BASE_URL = 'https://my-subway.r-e.kr';
const USERNAME = 'a@a';
const PASSWORD = '1';

export default function ()  {

  var payload = JSON.stringify({
    email: USERNAME,
    password: PASSWORD,
  });

  var params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };


  let loginRes = http.post(`${BASE_URL}/login/token`, payload, params);

  check(loginRes, {
    'logged in successfully': (resp) => resp.json('accessToken') !== '',
  });


  let authHeaders = {
    headers: {
      Authorization: `Bearer ${loginRes.json('accessToken')}`,
    },
  };


  let requestBody = {
    email: "a@a",
    password: "1234",
    age: 25
  };

  let myObjects = http.put(`${BASE_URL}/members/me`, requestBody, authHeaders).json();
  check(myObjects, { 'retrieved member': (obj) => obj.id != 0 });
  sleep(1);
};