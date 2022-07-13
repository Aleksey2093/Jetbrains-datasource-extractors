function eachWithIdx(iterable, f) { var i = iterable.iterator(); var idx = 0; while (i.hasNext()) f(i.next(), idx++); }
function mapEach(iterable, f) { var vs = []; eachWithIdx(iterable, function (i) { vs.push(f(i));}); return vs; }
function escape(str) {
    str = str.replaceAll("\t|\b|\\f", "");
    str = com.intellij.openapi.util.text.StringUtil.escapeXml(str);
    str = str.replaceAll("\\r|\\n|\\r\\n", "<br/>");
    return str;
}
var isHTML = RegExp.prototype.test.bind(/^<.+>$/);

var NEWLINE = "\n";

function output() { for (var i = 0; i < arguments.length; i++) { OUT.append(arguments[i]); } }
function outputRow(items, tag) {
    output("<tr>");
    for (var i = 0; i < items.length; i++)
        output("<", tag, ">", isHTML(items[i]) ? items[i] : escape(items[i]), "</", tag, ">");
    output("</tr>", NEWLINE);
}


output("<!DOCTYPE html>", NEWLINE,
    "<html>", NEWLINE,
    "<head>", NEWLINE,
    "<title></title>", NEWLINE,
    "<meta charset=\"UTF-8\">", NEWLINE);

output('<link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.10.25/css/jquery.dataTables.css">', NEWLINE);

output("</head>", NEWLINE,
    "<body>", NEWLINE);

output('<script type="text/javascript" src="https://code.jquery.com/jquery-3.6.0.min.js"></script>', NEWLINE);

output('<script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/1.10.25/js/jquery.dataTables.js"></script>', NEWLINE);

output("<table id='table_one' border=\"1\" width=\"100%\">", NEWLINE);

if (TRANSPOSED) {
    var values = mapEach(COLUMNS, function(col) { return [col.name()]; });
    eachWithIdx(ROWS, function (row) {
        eachWithIdx(COLUMNS, function (col, i) {
            values[i].push(FORMATTER.format(row, col));
        });
    });
    eachWithIdx(COLUMNS, function (_, i) { outputRow(values[i], "td"); });
}
else {
    output("<thead>", NEWLINE)
    outputRow(mapEach(COLUMNS, function (col) { return col.name(); }), "th");
    output("</thead>", NEWLINE);
    output("<tbody>", NEWLINE)
    eachWithIdx(ROWS, function (row) {
        outputRow(mapEach(COLUMNS, function (col) { return FORMATTER.format(row, col); }), "td")
    });
    output("</tbody>", NEWLINE)
}

output("</table>", NEWLINE);

output('<script type="text/javascript">', NEWLINE);
output('$(window).ready( function () {', NEWLINE);
output('    var table = $("#table_one").DataTable({', NEWLINE);
output('        "order": [[ 0, "asc" ]],', NEWLINE);
output('        "iDisplayLength": 100', NEWLINE);
output('    });', NEWLINE);
output('} );', NEWLINE);
output('</script>', NEWLINE);

output("</body>", NEWLINE);
output("</html>", NEWLINE);