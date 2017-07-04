<!DOCTYPE HTML>

<head>
    <title>Lazy B Weather Informatics</title>
    <link href='https://spoqa.github.io/spoqa-han-sans/css/SpoqaHanSans-jp.css' rel='stylesheet' type='text/css'>
    <script src="jquery.min.js"></script>

    <style type="text/css">
        * {
            font-family: 'Spoqa Han Sans', 'Spoqa Han Sans JP', 'Sans-serif';
            font-weight: 200;
        }
        
        body {
            background-color: #222;
            overflow: hidden;
            margin: 0;
            padding: 0;
        }
        
        .contentCentered {
            position: absolute;
            text-align: center;
            vertical-align: middle;
            height: 100%;
            width: 100%;
        }
        
        .contentCentered:before {
            content: '';
            display: inline-table;
            height: 100%;
            vertical-align: middle;
        }
        
        .contentCentered>* {
            display: inline-table;
            vertical-align: middle;
            /*border-radius: 10%;*/
            width: 50%;
            height: 5vh;
            color: #fff;
            /*font-family: 'fonty';*/
            /*background: #222;*/
            height: auto;
        }
        
        h1:before {
            content: "";
            display: inline-table;
            width: 100%;
        }
        
        h1 {
            font-size: 2.5em;
        }
        
        p {
            /*display: inline;*/
            text-align: justify;
            /*margin: 1em;*/
            font-size: 1.75em;
            width: 100%;
        }
        
        p:after {
            content: "";
            display: inline-table;
            width: 100%;
        }
    </style>
</head>

<body>
    <div class="contentCentered">
        <div>
            <h1>Under construction.</h1>
            <h1><?php
	    $node=shell_exec('node -v');
	    echo "Using node " . $node;
	    ?>
        </h1>
        <h2 id="weather"></h2>
        <script>
        // setInterval(function() { 
            var weather;
            $.getJSON("./weather.json", function(json) { weather = JSON.stringify(json); }).done(function() {
                document.getElementById("weather").innerHTML = weather;
            }).fail(function() {
                console.log( "Could not load weather data from server.");
            });
        // }, 60000);
        </script>   
        </div>
    </div>
</body>

</html>
