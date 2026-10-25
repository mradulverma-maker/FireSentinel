const http = require('https');
const BRIDGE_URL = "https://script.google.com/macros/s/AKfycbw7JRTyoussBuVvI9Tm8xaD2PCCkeCyKXHp572VY_7i6ep8Dsfj6_tzSSK8oNny9iPb8w/exec";

async function testFetch() {
    try {
        console.log("Testing POST json...");
        const res1 = await fetch(BRIDGE_URL, {
            method: 'POST',
            body: JSON.stringify({ action: 'GET_DATA' })
        });
        const text1 = await res1.text();
        console.log("POST Fetch Status:", res1.status, JSON.stringify(text1.substring(0, 100)));

        console.log("Testing GET query params...");
        const res2 = await fetch(BRIDGE_URL + "?action=GET_DATA", {
            method: 'GET'
        });
        const text2 = await res2.text();
        console.log("GET Fetch Status:", res2.status, JSON.stringify(text2.substring(0, 100)));
    } catch (e) {
        console.error("Fetch Error:", e);
    }
}

testFetch();
