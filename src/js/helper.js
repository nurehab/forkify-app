import { TIMEOUT_SEC } from './config.js';
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};
// 2*1 -- el getJson aw el sendJson
export const AjaxCall = async function (url, uploadData = undefined) {
  try {
    const res = uploadData
      ? await Promise.race([
          fetch(url, {
            method: 'POST',
            // some snippets of text which are like information about the request itself .
            // 'application/json' : da bey2ol ll API, en el data ely gayalk f el request hatb2a b JSON format
            // so only then our API can correctly accept that data and create a new recipe in the database .
            headers: { 'Content-Type': 'application/json' },
            // body should be JSON
            body: JSON.stringify(uploadData),
          }),
          timeout(TIMEOUT_SEC),
        ])
      : await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
    const data = await res.json();
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};

export const eventDelegation = function (element) {
  const btn = e.target.closest(element);
  if (!btn) return;
  handler();
};

/*
export const getJson = async function (url) {
  try {
    const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
    const data = await res.json();
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};

// Send / Post / Upload data
export const sendJson = async function (url, uploadData) {
  try {
    const res = await Promise.race([
      fetch(url, {
        method: 'POST',
        // some snippets of text which are like information about the request itself .
        // 'application/json' : da bey2ol ll API, en el data ely gayalk f el request hatb2a b JSON format
        // so only then our API can correctly accept that data and create a new recipe in the database .
        headers: { 'Content-Type': 'application/json' },
        // body should be JSON
        body: JSON.stringify(uploadData),
      }),
      timeout(TIMEOUT_SEC),
    ]);
    const data = await res.json();
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};
*/
