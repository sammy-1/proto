$(document).ready(function() {

    // the basics
    // ----------

    var substringMatcher = function(strs) {
        return function findMatches(q, cb) {
            var matches, substringRegex;

            // an array that will be populated with substring matches
            matches = [];

            // regex used to determine if a string contains the substring `q`
            substrRegex = new RegExp(q, 'i');

            // iterate through the pool of strings and for any string that
            // contains the substring `q`, add it to the `matches` array
            $.each(strs, function(i, str) {
                if (substrRegex.test(str)) {
                    matches.push(str);
                }
            });

            cb(matches);
        };
    };

    var states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California',
        'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii',
        'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
        'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
        'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
        'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
        'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island',
        'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
        'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
    ];

    $('#the-basics .typeahead').typeahead({
            hint: true,
            highlight: true,
            minLength: 1
        },
        {
            name: 'states',
            source: substringMatcher(states)
        });

    var bestPictures = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        prefetch: '/Users/sammy/Downloads/products2.json',
        remote: {
            url: '../data/films/queries/%QUERY.json',
            wildcard: '%QUERY'
        }
    });

    $('#remote .typeahead').typeahead(null, {
        name: 'best-pictures',
        display: 'value',
        source: bestPictures
    });

    // Instantiate the Bloodhound suggestion engine
    var movies = new Bloodhound({
        datumTokenizer: function (datum) {
            return Bloodhound.tokenizers.whitespace(datum.value);
        },
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        //prefetch: makeRequest(),
        remote: {
            url: 'https://www.googleapis.com/bigquery/v2/projects/isentropic-tape-184800/queries#%QUERY',
            dummy: '%QUERY',
            wildcard: '%QUERY',
            options: {
                data: resource,
                dataType:"json",
                type: "POST",
                method: "POST"
            },
            transport: function (url, options, onSuccess, onError) {
                makeRequest2(url.url.split("#")[1]);
                // Here, maybe log that we're about to look up remote data.

                // Here's where you'd do your custom lookup; for this example, we'll just use Jquery ajax as Bloodhound does.
                /*            $.ajax({
                 method: "POST",
                 url: url.url.split("#")[0], //"https://www.googleapis.com/bigquery/v2/projects/isentropic-tape-184800/queries",
                 data: {
                 "query": "SELECT name FROM `isentropic-tape-184800.sammy_test1.products` WHERE STARTS_WITH(name, '" + url.url.split("#")[0] +"')",
                 "defaultDataset": {
                 "datasetId": "sammy_test1",
                 "projectId": "isentropic-tape-184800"
                 },
                 "maxResults": 10,
                 "useLegacySql": false,
                 "dryRun": false,
                 "kind": "bigquery#queryRequest"

                 }
                 })
                 .done(function( msg ) {
                 alert( "Data Saved: " + msg );
                 }).fail(fail).always(always);

                 function done(data, textStatus, request) {
                 // Don't forget to fire the callback for Bloodhound
                 onSuccess(data);
                 }

                 function fail(request, textStatus, errorThrown) {
                 console.log("FAILED, ", textStatus);
                 makeRequest();
                 }
                 function success(data) {
                 }
                 function error(data) {
                 console.log("ERROR");
                 }
                 function always() {
                 }*/
            }
        }
    });

// Initialize the Bloodhound suggestion engine
    // movies.initialize();

// Instantiate the Typeahead UI
    $('#remote2 .typeahead').typeahead(null, {
        displayKey: 'value',
        source: movies,
        minLength: 2
    });

    //AUTH


    // Enter a client ID for a web application from the Google Developer Console.
    // The provided clientId will only work if the sample is run directly from
    // https://google-api-javascript-client.googlecode.com/hg/samples/rpcRequestBody.html
    // In your Developer Console project, add a JavaScript origin that corresponds to the domain
    // where you will be running the script.


     var apiKey = '';
    var clientId = '';

    var scopes = 'https://www.googleapis.com/auth/bigquery';
    var resource = {
        "query": "SELECT name FROM `isentropic-tape-184800.sammy_test1.products` WHERE STARTS_WITH(name, 'Du')",
        "defaultDataset": {
            "datasetId": "sammy_test1",
            "projectId": "isentropic-tape-184800"
        },
        "maxResults": 10,
        "useLegacySql": false,
        "dryRun": false,
        "kind": "bigquery#queryRequest"

    };
    function handleClientLoad() {
        gapi.load('client', initClient);
    }

    function initClient() {
        gapi.client.init({
            apiKey: apiKey,
            clientId: clientId,
            scope: scopes
        }).then();
    }

    function signIn() {
        gapi.auth2.getAuthInstance().signIn();
    }

    function makeRequest() {
        gapi.client.request({
            'path': 'https://www.googleapis.com/bigquery/v2/projects/isentropic-tape-184800/queries',
            'method': 'POST',
            'body': resource
        }).then(function(resp) {
            writeResponse(resp.result);
        });
    }

    function makeRequest2(wildcard) {
        gapi.client.request({
            'path': 'https://www.googleapis.com/bigquery/v2/projects/isentropic-tape-184800/queries',
            'method': 'POST',
            'body': {
                "query": "SELECT name FROM `isentropic-tape-184800.sammy_test1.products` WHERE STARTS_WITH(name, '" + wildcard +"')",
                "defaultDataset": {
                    "datasetId": "sammy_test1",
                    "projectId": "isentropic-tape-184800"
                },
                "maxResults": 10,
                "useLegacySql": false,
                "dryRun": false,
                "kind": "bigquery#queryRequest"
            }
        }).then(function(resp) {
            writeResponse(resp.result);
        });
    }


    var q = {
        "query": "SELECT name FROM `isentropic-tape-184800.sammy_test1.products` WHERE STARTS_WITH(name, '%wildcard')",
        "defaultDataset": {
            "datasetId": "sammy_test1",
            "projectId": "isentropic-tape-184800"
        },
        "maxResults": 10,
        "useLegacySql": false,
        "dryRun": false,
        "kind": "bigquery#queryRequest"
    }


    function writeResponse(response) {
        console.log(response);
        itemList =[];
        response.rows.forEach(function(val) {console.log(val.f[0].v); itemList.push(console.log(val.f[0].v));  });

    }
});