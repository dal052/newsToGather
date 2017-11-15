const http = require('http');
const url = require('url');
require('chromedriver');
var request = require('request').defaults({jar: true});

const { Builder, By, Key, promise, until } = require('selenium-webdriver');


///////////// for Firefox //////////////////////////////////////////////////
//const firefox = require('selenium-webdriver/firefox');
//const binary = new firefox.Binary();
//binary.addArguments("--headless");
//const driver = new Builder()
//    .forBrowser('firefox')
//    .setFirefoxOptions(new firefox.Options().setBinary(binary))
//    .build();
////////////////////////////////////////////////////////////////////////////


const driver = new Builder()
    .forBrowser('chrome')
    .build();


const usr = 'happy11go@gmail.com';
const scrt = 'Opera@2017';

var cookiesWSJ;

driver.get('https://www.wsj.com').then(function() {
    driver.wait(until.elementLocated(By.xpath("//a[contains(@href,'login')]")), 20000)
    .then(element => element.click());
}).then(function() {
    driver.wait(until.elementLocated(By.name('username')), 20000)
    .then(element => {
        driver.wait(until.elementIsVisible(element),20000).then(element => element.sendKeys(usr));
    });
}).then(function() {
    driver.wait(until.elementLocated(By.name('password')), 20000)
    .then(element => {
        driver.wait(until.elementIsVisible(element),20000).then(element => element.sendKeys(scrt));
    });
}).then(function() {
    driver.wait(until.elementLocated(By.className('sign-in')), 20000)
    .then(element => {
    driver.wait(until.elementIsVisible(element),20000).then(element => element.click());
    });
});

driver.manage().getCookies().then(function (cookies) {
    cookiesWSJ = cookies;
}).then(function() {

console.log('all cookies => ', cookiesWSJ);


    http.createServer(onRequest).listen(8888);

    function onRequest(req, res) {

        var queryData = url.parse(req.url, true).query;
        if (queryData.url) {
            request({
                url: queryData.url,
                jar: cookiesWSJ
            }).on('error', function(e) {
                res.end(e);
            }).pipe(res);
        }
        else {
            res.end("no url found");
        }
    }


});
