// CORS Proxy Server

var express = require('express'),
    request = require('request'),
    bodyParser = require('body-parser'),
    app = express();


var myLimit = typeof (process.argv[2]) != 'undefined' ? process.argv[2] : '100kb';
console.log('Using limit: ', myLimit);

app.use('*', function (req, res, next) {

    // Set CORS Headers
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
    res.header("Access-Control-Allow-Headers", req.header('access-control-request-headers'));

    if (req.method === 'OPTIONS') {
        // CORS Preflight
        res.send();
    } else {
        var targetURL = req.header('Target-URL');
        if (!targetURL) {
            res.send(500, { error: 'There is no Target-URL header in the request' });
            return;
        }
        console.log('---------------------------------------------');
        console.log('Resquest: ', Date);
        console.log('URL: ', targetURL + req.url);
        console.log('method: ', req.method);
        console.log('incoming header: ', req.headers);
        console.log('body: ',req.body);
        var headers = { 
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': req.header('Ocp-Apim-Subscription-Key'),
        };
        console.log('headers: ', headers);

        request({ url: targetURL + req.url, method: req.method, json: req.body, headers: headers },
            function (error, response, body) {
                console.log('---------------------------------------------');
                if (error) {
                    console.error('error: ' + response.statusCode);
                }
                console.log('Body: ', body);
            }).pipe(res);
    }

});

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function() {
    console.log('CORS Proxy Server listening on port ' + app.get('port'));
});
