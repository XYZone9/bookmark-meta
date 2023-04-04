
console.info('test:', 123);

const request = require('request');
request('https://www.baidu.com', function (error, response, body) {
    console.error(error);
    if (!error && response.statusCode == 200) {
        console.log(body); // Show the HTML for the Google homepage.
    }
});
