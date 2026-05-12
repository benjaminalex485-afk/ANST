const https = require('https');

https.get('https://api.twelvedata.com/statistics?symbol=AAPL&apikey=demo', (resp) => {
  let data = '';
  resp.on('data', (chunk) => { data += chunk; });
  resp.on('end', () => {
    console.log("AAPL STATISTICS DATA:", data);
  });
}).on("error", (err) => {
  console.log("Error: " + err.message);
});
