var DetailView = function(container){
    var public = this;
    var optionscontainer = [];
    var chartlookup = [];
    var originalID = ["4264-84830852",'"4266-84831108"',"1103-1103","4262-84830876","4267-84830990","4265-8483009431","4261-2228","2131-2131","1163-1163","3275-30662","2368-2368","3655-27659","3272-3272","3606-30668","2382-2382",'"1094-1094"',"4269-4831216","4268-8582220031","4270-84831217","4271-84831889","4272-84831758","4263-1135473","unbanded-151","unbanded-153","unbanded-154",'"unbanded-156"',"unbanded-159","unbanded-160"];



    function _constructor() {
        optionscontainer = [{title:'Time vs. Height', hAxis: {title: 'Time'}, vAxis: {title: 'Height [m]'},
                colors: ['#4682B4'], width:720, height:200, chartArea:{width:'80%'}, chartType:"LineChart", legend:'none'},
            {title:'Time vs. Groundspeed', hAxis: {title: 'Time'}, vAxis: {title: 'Speed [m/s]'},
                colors: ['#4682B4'], width:720, height:200, chartArea:{width:'80%'}, chartType:"LineChart", legend:'none'},
            {title:'Hour vs. Height', hAxis: {title: 'Time of Day'}, vAxis: {title: 'Hight [m]'},
                colors: ['#4682B4'], width:720, height:200, chartArea:{width:'80%'}, chartType:"ColumnChart", legend:'none'},
            {title:'Groundspeed vs. Height', hAxis: {title: 'Groundspeed [m/s]'}, vAxis: {title: 'Height [m]'},
                colors: ['#4682B4'], width:720, height:720, chartArea:{width:'80%'}, chartType:"ScatterChart", legend:'none'}
        ];
        google.charts.load('current', {packages: ['corechart', 'line'], callback:loadcb});
        function loadcb(){
            optionscontainer.forEach(function(o, i){
                $('#detailsWrapper').append('<div id="detailsVis'+i+'" style="width:720px"></div>');
                var vis = $('#detailsVis'+i).get(0);
                if (o.chartType === "LineChart")
                    chartlookup.push(new google.visualization.LineChart(vis));
                else if(o.chartType === "ScatterChart")
                    chartlookup.push(new google.visualization.ScatterChart(vis));
                else if(o.chartType === "ColumnChart")
                    chartlookup.push(new google.visualization.ColumnChart(vis));
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
            $('#detailsTitle').text('Details for Albatross' + birdID + ' ('+ originalID[birdID] +')' );
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
