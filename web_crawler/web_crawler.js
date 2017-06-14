/* 웹페이지 다운로드 */
/*
var url = "http://jpub.tistory.com/";
var savepath = "test.html";

var http = require('http');
var fs = require('fs');

var outfile = fs.createWriteStream(savepath);

http.get(url, function(res) {
    res.pipe(outfile);
    res.on('end', function() {
        outfile.close();
        console.log('ok');
    });
});
*/

/* 코드 리팩토링 */
/*
download(
    "http://jpub.tistory.com/539",
    "spring.html",
    function() {
        console.log("ok, spring")
    });

download(
    "http://jpub.tistory.com/537",
    "angular.html",
    function() {
        console.log("ok, angular")
    });

function download(url, savepath, callback) {
    var http = require('http');
    var fs = require('fs');
    var outfile = fs.createWriteStream(savepath);

    var req = http.get(url, function(res) {
        res.pipe(outfile);
        res.on('end', function() {
            outfile.close();
            callback();
        });
    });
};
*/

/* 
 * Title       : HTML 해석(링크와 이미지 추출)
 * Module      : cheerio-httpcli, request 
 * Description : 페이지를 다운로드하고 HTML 요소에서 링크와 이미지를 추출한다
 */
/*
var client = require('cheerio-httpcli');
var urlType = require('url');

var url = "http://jpub.tistory.com";
var param = {};

client.fetch(url, param, function(err, $, res) {
    if (err) { console.log('Error:', err); return; }

    $("a").each(function(idx) {
        var text = $(this).text();
        var href = $(this).attr('href');

        if (!href) { return; }

        var href2 = urlType.resolve(url, href);
        console.log(text + ":" + href2);
    });
})
*/

/* request 모듈을 이용해 이미지 다운로드 */
/*
var client = require('cheerio-httpcli');
var request = require('request');
var fs = require('fs');
var urlType = require('url');

var savedir = __dirname + "/img";
if (!fs.existsSync(savedir)) {
    fs.mkdirSync(savedir);
}

var url = "http://ko.wikipedia.org/wiki/" + encodeURIComponent("강아지");
var param = {};

client.fetch(url, param, function(err, $, res) {
    if (err) { console.log('Error:', err); return; }

    $("img").each(function(idx) {
        var src = $(this).attr('src');
        src = urlType.resolve(url, src);

        var fname = urlType.parse(src).pathname;
        fname = savedir + "/" + fname.replace(/[^a-zA-Z0-9\.]+/g, '_');

        request(src).pipe(fs.createWriteStream(fname));
    });
})
*/

/* 주간 기상예보 RSS 취득 (xml2js 이용)*/
/*
var RSS = "http://web.kma.go.kr/weather/forecast/mid-term-rss3.jsp?stnId=109";

var parseString = require('xml2js').parseString;
var request = require('request');

request(RSS, function(err, response, body) {
    if (!err && response.statusCode == 200) {
        analyzeRSS(body);
    }
});

function analyzeRSS(xml) {
    parseString(xml, function(err, obj) {
        if (err) { console.log(err); return; }

        var datas = obj.rss.channel[0].item[0].description[0].body[0].location[0].data;
        var city = obj.rss.channel[0].item[0].description[0].body[0].location[0].city;

        for (var i in datas) {
            var data = datas[i];
            console.log(city + " " + data.tmEf + " " + data.wf + " " + data.tmn + "~" + data.tmx);
        }
    });
}
*/

/*  주간 기상예보 RSS 취득 (cheerio-httpcli 이용) */

var RSS = "http://web.kma.go.kr/weather/forecast/mid-term-rss3.jsp?stnId=109";

var client = require('cheerio-httpcli');

client.fetch(RSS, {}, function(err, $, res) {
    if (err) { console.log("error"); return; }

    var city = $("location:nth-child(1) > city").text();
    $("location:nth-child(1) > data").each(function(idx) {

        var tmEf = $(this).find('tmEf').text();
        var wf = $(this).find('wf').text();
        var tmn = $(this).find('tmn').text();
        var tmx = $(this).find('tmx').text();

        console.log(city + " " + tmEf + " " + wf + " " + tmn + "~" + tmx);
    });
})