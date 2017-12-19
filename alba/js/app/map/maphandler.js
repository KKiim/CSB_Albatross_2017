var Maphandler = function(container,_cache){
    var public = this;
    var _helper;



    function constructor(){
        _helper = new Helper();
        _init();
        $('#'+container).data('public', public);
    }

    function _init() {
        var style = new MapStyle();
        _map = new google.maps.Map(document.getElementById(container), {
            center: {lat: 10.6779496, lng: 13.1732384},
            zoom: 3,
            minZoom:3,
            styles: style.getNight(),
            disableDefaultUI: true

        });


        _displaycache = _cache.getAll();

        if (_map.zoom >= 7 || _map.zoom < 5) {
            for (var id in _displaycache) _displaycache[id].setMap(null);
        }
        else {
            for (var id in _displaycache){
                if (_displaycache[id].inSelection)_displaycache[id].setMap(_map);
                console.log(_displaycache[id].inSelection);
            }

        }


         //new MarkerClusterer(_map, markers, {imagePath: 'css/images/m', maxZoom: 5});
        google.maps.event.addListener(_map, "bounds_changed", function(){
            var area= $('#contextlat').data('public');
            if (area) area.updateExtent(_map.getBounds());
        });
    }

    public.getMap = function(){
        return _map;
    };

    constructor();
    return public;
};







