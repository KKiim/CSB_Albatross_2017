/**
 * Created by Phil on 14.07.2017.
 */

var ClusterWrapper = function(_map, cache){
    var public = this;
    var _centroids = [];
    var _scale;
    function constructor(){


    }


    public.process = function(zoomlevel){
        var selected = cache.getSelected();
        if (selected.length < 1) {
            public.clear();
            return;
        }
        $.post('/r/clustering/run', {zoom:zoomlevel, selected:selected.toString() }, function(d){
            public.clear();
            var max = 1;
            d.data.forEach(function(row){
                if (row.size > max ) max = row.size;
            });

           _scale = d3.scaleLog().range([1,100]).domain([1,max]);
            d.data.forEach(function(row){
                _addCentroid(row.centroid.split(' ')[0] , row.centroid.split(' ')[1], row.size )
                _addConvexHull(row.hull);
            });
            var visible = $('#convexall').hasClass('active') ? true : false;
            _map.data.setStyle(
               {
                   fillOpacity: 0.0,
                   strokeOpactiy:1.0,
                   strokeColor: 'white',
                   strokeWeight: 2,
                   visible: visible
                });
        });
    };

    function _addCentroid(lat, lng, size){
        var scaledsize =_scale(size);
        var image = {
            url: 'css/images/clustercircle3.png',
            scaledSize: new google.maps.Size(8, 8), // scaled size
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(4, 4),
            scaledSize: new google.maps.Size(scaledsize, scaledsize),
            anchor:  new google.maps.Point(scaledsize/2, scaledsize/2)
        };
        var options = {clickable: true,
            draggable: false,
            editable: false,
            opacity: 0.7,
            label: size+"",
            icon:image,
            position: new google.maps.LatLng(lat, lng),
            map: _map,
            zIndex: -1000,
            id: _centroids.length
        };
        var marker = new google.maps.Marker(options);
        if (!$('#convexall').hasClass('active')){
            marker.addListener( 'mouseover', function(){
                var hovered = this.id;
                _map.data.setStyle(function(feature) {
                    var centroid = feature.getProperty('centroid');
                    var visible = (centroid == hovered) ? true : false;
                    return {
                        fillOpacity: 0.0,
                        strokeOpacity:1.0,
                        strokeColor: 'white',
                        strokeWeight: 2,
                        zIndex:1000,
                        visible: visible
                    };
                });

            });
        }

        _centroids.push(marker);
    }

    function _addConvexHull(geojson){
        var o = JSON.parse('{"type":"Feature", "properties":{"centroid":'+(_centroids.length-1)+'},"geometry":'+geojson+'}');
       _map.data.addGeoJson(o);
    }

    public.clear = function(){
        _map.data.forEach(function(feature){
            _map.data.remove(feature);
        });
        _centroids.forEach(function(c){
            c.setMap(null);
        });
        _centroids = [];

    };

    constructor();
};