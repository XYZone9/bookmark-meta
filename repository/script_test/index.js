
const params = $$.params;

console.info('test name:', params.name);

const cheerio = require('cheerio');

const request = require('request');

module.exports = new Promise(resolve => {
    request('https://www.baidu.com', function (error, response, body) {
        if (error) {
            console.error(error);
        } else if (response.statusCode == 200) {
            const $ = cheerio.load(body);
            console.log('title:', $('title').text()); // Show the HTML for the Google homepage.
        }
        resolve(body);
    });
});
