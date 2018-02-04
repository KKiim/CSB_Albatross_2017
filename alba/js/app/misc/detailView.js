var DetailView = function(container){
    var public = this;
    var optionscontainer = [];
    var chartlookup = [];
    var originalID = ["4264-84830852","4266-84831108","1103-1103","4262-84830876","4267-84830990","4265-8483009431","4261-2228","2131-2131","1163-1163","3275-30662","2368-2368","3655-27659","3272-3272","3606-30668","2382-2382","1094-1094","4269-4831216","4268-8582220031","4270-84831217","4271-84831889","4272-84831758","4263-1135473","unbanded-151","unbanded-153","unbanded-154","unbanded-156","unbanded-159","unbanded-160"];
	var weatherhelper = {windspeed:{birdheight: [], birdspeed: []}, temperature:{birdheight: [], birdspeed: []}}; 


    function _constructor() {
        //var ex =    {actions: ['dragToZoom', 'rightClickToReset'], axis: 'horizontal', keepInBounds: true, maxZoomIn: 8.0};
        var ex =    {axis: 'horizontal', keepInBounds: true, maxZoomIn: 12.0};
        var ex2 =    {axis: 'both', keepInBounds: true, maxZoomIn: 12.0};
		var ex3 =    {actions: ['dragToZoom', 'rightClickToReset'], axis: 'horizontal', keepInBounds: true, maxZoomIn: 8.0};
        optionscontainer = [{title:'Time vs. Height', hAxis: {title: 'Time'}, vAxis: {title: 'Height [m]'},
                colors: ['#4682B4'], width:720, height:200, chartArea:{width:'80%'}, chartType:"LineChart", legend:'none', explorer:ex },
            {title:'Time vs. Groundspeed', hAxis: {title: 'Time'}, vAxis: {title: 'Speed [m/s]', logScale:false},
                colors: ['#4682B4'], width:720, height:200, chartArea:{width:'80%'}, chartType:"ScatterChart", legend:'none', explorer:ex, pointSize: 1.5},
            {title:'Groundspeed vs. Height', hAxis: {title: 'Groundspeed [m/s]'}, vAxis: {title: 'Height [m]'},
                colors: ['#4682B4'], width:400, height:400, chartArea:{width:'80%'}, chartType:"ScatterChart", legend:'none', xtype:'number', explorer:ex2, pointSize:1.5},
            {title:'Wind Speed vs. Bird Height', hAxis: {title: 'Wind Speed'}, vAxis: {title: 'Bird Height'},
                colors: ['#4682B4'], width:400, height:400, chartArea:{width:'80%'}, chartType:"ScatterChart", legend:'none', pointSize:1.5, explorer:ex3, xtype:'number'}
        ];
        google.charts.load('upcoming', {packages: ['corechart', 'line'], callback:loadcb});
        function loadcb(){
            optionscontainer.forEach(function(o, i){
				if (i === 3){
					$('#chartsel').detach().appendTo('#detailsWrapper');
				} 
                $('#detailsWrapper').append('<div class="detailVis" id="detailsVis'+i+'" style="text-align:center"></div>');
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

        $.post('/r/details/statistics', {birdid:id}, function(res){
			console.log(res); 
            if (res.data && res.data.length > 0 ){
                var alt = [];
                var speed = [];
                var altspeed = [];
                res.data[0].rows.forEach(function(o){
                    alt.push([new Date(o.ts),o.height]);
                    speed.push([new Date(o.ts),o.groundspeed]);
                    altspeed.push([o.groundspeed, o.height])
                });
				var heightwindspeed = []; 
				var heighttemperature = []; 
				var speedwindspeed = []; 
				var speedtemperature = []; 
				
				res.data[1].rows.forEach(function(o){
                    heightwindspeed.push([o.windspeed, o.height ]);
					speedwindspeed.push([o.windspeed, o.groundspeed ]);
					heighttemperature.push([o.temperature, o.height]);
					speedtemperature.push([o.temperature, o.groundspeed]);
                });
				weatherhelper.windspeed.birdheight = heightwindspeed; 
				weatherhelper.windspeed.birdspeed = speedwindspeed; 
				weatherhelper.temperature.birdheight = heighttemperature; 
				weatherhelper.temperature.birdspeed = speedtemperature; 
				console.log(weatherhelper); 
                cb([alt,speed, altspeed]);
            }
        });

        console.log("request data for bird", id);
        /*
        var d = [];
        for (var i= 0; i<optionscontainer.length; i++){ //generate some random data, in multidim array
            var tmp = [];
            for (var j= 0; j<=31; j++) tmp.push([new Date(2015, 0, j), Math.random()*10]);
            d.push(tmp);
        }*/

    }

    public.updateVis = function (birdID){
        _requestData(birdID, function(d){
            $('#detailsTitle').text('Details for Albatross' + birdID + ' ('+ originalID[birdID] +')' );
            optionscontainer.forEach(function(o,i){
					var rows; 
					if (i == 3){
						rows = weatherhelper[$('#weatherdim').val()][$('#birddim').val()]
						o.hAxis.title = $('#weatherdim option:selected').text(); 
						o.vAxis.title = $('#birddim option:selected').text(); 
						o.title = o.hAxis.title + ' vs. ' + o.vAxis.title; 
					} else {
						rows = d[i]; 
					}
                    var dataTable = new google.visualization.DataTable();
                    var xtype = o.hasOwnProperty('xtype')? o.xtype : 'date';
                
               
                    dataTable.addColumn(xtype, 'X');
                    dataTable.addColumn('number', o.vAxis.title);
                    dataTable.addRows(rows);
                    chartlookup[i].draw(dataTable, o);
                

            });
			$('#chartsel').show(); 
        });
    };
	
	public.updateWeatherChart = function(){
		var o = optionscontainer[3]; 
		var rows = weatherhelper[$('#weatherdim').val()][$('#birddim').val()]
		console.log(rows); 
		o.hAxis.title = $('#weatherdim option:selected').text(); 
		o.vAxis.title = $('#birddim option:selected').text(); 
		o.title = o.hAxis.title + ' vs. ' + o.vAxis.title; 
		var dataTable = new google.visualization.DataTable();
		              dataTable.addColumn('number', o.hAxis.title);
                    dataTable.addColumn('number', o.vAxis.title);
                    dataTable.addRows(rows);
                    chartlookup[3].draw(dataTable, o);
	}

    _constructor();
    return public;
};
