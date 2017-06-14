var PDFdocument = require('pdfkit');
var fs = require('fs');

var data = [
    { label: '국어', value: 76 },
    { label: '수학', value: 96 },
    { label: '과학', value: 35 },
    { label: '사회', value: 72 },
    { label: '음악', value: 64 },
    { label: '영어', value: 24 }
];

var doc = new PDFdocument();
var page_w = doc.page.width;
var page_h = doc.page.height;

doc.pipe(fs.createWriteStream('output-graph.pdf'));

doc.font('H2GTRE.TTF');
doc.fontSize(30).text('성적 그래프', 20, 20);

var margin = 20;
var g_w = page_w - margin * 2 - 50;
var g_x = margin + 50;
var y = 80;
var wpx = g_w / 100;

for (var i = 0; i < data.length; i++) {
    var value = data[i].value;
    var label = data[i].label;

    doc.save()
        .rect(g_x, y, wpx * value, 20)
        .fill((i % 2) ? 'blue' : 'red');

    doc.fontSize(10)
        .fillColor("black")
        .text(label, 30, y + 5)
        .text(value, g_x + 5, y + 5);

    y += 20 + 5;
}

doc.end();