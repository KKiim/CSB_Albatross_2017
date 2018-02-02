var DetailView = function(container){
    var public = this;
    var _data;


    function _constructor() {
        google.charts.load('current', {packages: ['corechart', 'line']});

        $(container).data('public', public);
    }

    function _requestData(cb){
        var d = [
            [new Date(2015, 0, 1), 5],  [new Date(2015, 0, 2), 7],  [new Date(2015, 0, 3), 3],
            [new Date(2015, 0, 4), 1],  [new Date(2015, 0, 5), 3],  [new Date(2015, 0, 6), 4],
            [new Date(2015, 0, 7), 3],  [new Date(2015, 0, 8), 4],  [new Date(2015, 0, 9), 2],
            [new Date(2015, 0, 10), 5], [new Date(2015, 0, 11), 8], [new Date(2015, 0, 12), 6],
            [new Date(2015, 0, 13), 3], [new Date(2015, 0, 14), 3], [new Date(2015, 0, 15), 5],
            [new Date(2015, 0, 16), 7], [new Date(2015, 0, 17), 6], [new Date(2015, 0, 18), 6],
            [new Date(2015, 0, 19), 3], [new Date(2015, 0, 20), 1], [new Date(2015, 0, 21), 2],
            [new Date(2015, 0, 22), 4], [new Date(2015, 0, 23), 6], [new Date(2015, 0, 24), 5],
            [new Date(2015, 0, 25), 9], [new Date(2015, 0, 26), 4], [new Date(2015, 0, 27), 9],
            [new Date(2015, 0, 28), 8], [new Date(2015, 0, 29), 6], [new Date(2015, 0, 30), 4],
            [new Date(2015, 0, 31), 6], [new Date(2015, 1, 1), 7],  [new Date(2015, 1, 2), 9]
        ];
        console.log("I was here");
        cb(d);
    }

    public.updateVis = function (birdID , ){
        _requestData( function(d){
            var dataTable = new google.visualization.DataTable();
            dataTable.addColumn('date', 'X');
            dataTable.addColumn('number', 'ID: ' + birdID.toString());


            dataTable.addRows(d);

            var options = {
                hAxis: {
                    title: 'Time',
                    logScale: false
                },
                vAxis: {
                    title: 'Hight',
                    logScale: false
                },
                colors: ['#a52714']
            };

            var chart = new google.visualization.LineChart(document.getElementById('detailChart'));
            chart.draw(dataTable, options);

        });

    }
    //google.charts.setOnLoadCallback(drawLogScales);

    function drawLogScales() {
        var dataTable = new google.visualization.DataTable();
        dataTable.addColumn('date', 'X');
        dataTable.addColumn('number', 'Bird 1');


        dataTable.addRows(_data);

        var options = {
            hAxis: {
                title: 'Time',
                logScale: false
            },
            vAxis: {
                title: 'Hight',
                logScale: false
            },
            colors: ['#a52714']
        };

        var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
        chart.draw(dataTable, options);
    }

    _constructor();
    return public;
};
