var DetailView = function(container){
    var public = this;
    var optionscontainer = [];
    var chartlookup = [];


    function _constructor() {
        optionscontainer = [{title:'Time vs. Height', hAxis: {title: 'Time'}, vAxis: {title: 'Height'}, colors: ['#4682B4'], width:720, height:120, chartArea:{width:'70%'}},
            {title:'Time vs. Groundspeed', hAxis: {title: 'Time'}, vAxis: {title: 'Speed'}, colors: ['#4682B4'], width:720, height:120, chartArea:{width:'70%'}}
        ];
        google.charts.load('current', {packages: ['corechart', 'line'], callback:loadcb});
        function loadcb(){
            optionscontainer.forEach(function(_, i){
                $('#detailsWrapper').append('<div id="detailsVis'+i+'" style="width:720px"></div>');
                chartlookup.push(new google.visualization.LineChart($('#detailsVis'+i).get(0)));
            });
        }

        $(container).data('public', public);
    }

    function _requestData(id, cb){
        console.log("request data for bird", id);
        var d = [];
        for (var i= 0; i<optionscontainer.length; i++){ //generate some random data, in multidim array
            var tmp = [];
            for (var j= 0; j<=31; j++) tmp.push([new Date(2015, 0, j), Math.random()*10]);
            d.push(tmp);
        }
        cb(d);
    }

    public.updateVis = function (birdID){
        _requestData(birdID, function(d){
            $('#detailsTitle').text('Details for Albatross ' + birdID);
            optionscontainer.forEach(function(o,i){
                var dataTable = new google.visualization.DataTable();
                dataTable.addColumn('date', 'X');
                dataTable.addColumn('number', o.vAxis.title);
                dataTable.addRows(d[i]);
                chartlookup[i].draw(dataTable, o);
            });
        });
    };


    _constructor();
    return public;
};
