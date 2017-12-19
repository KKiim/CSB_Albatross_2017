
var Cache = function(){
    var _o = {};
    var _coords = {};
    var public = this;
    var scale;
    function _constructor(){
        scale = d3.scaleLog().domain([0.01, 60000000]).range([1,20]);
    }

    public.empty = function(){
        _o = {};
    };

    public.print = function(){
        console.log(_o);
    };

    public.insert = function(d){
        if (d.coords && d.mass && d.mass !== null) {
            var image = {
                url: 'css/images/octamedium50.png',
                scaledSize: new google.maps.Size(8, 8), // scaled size
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(4, 4),
                scaledSize: new google.maps.Size(scale(d.mass), scale(d.mass)),
                anchor:  new google.maps.Point(scale(d.mass)/2, scale(d.mass)/2)
            };
            var options = {clickable: false,
                draggable: false,
                editable: false,
                opacity: 0.2,
                icon:image,
                position: new google.maps.LatLng(d.coords.split(' ')[0], d.coords.split(' ')[1]),
                id: d.id,
                name: d.name,
                mass: d.mass,
                year: d.year,
                nametype: d.nametype,
                class: d.recclass,
                fall: d.fall,
                superclass: d.superclass,
                visible:true,
                inSelection:true
            };
            for (var att in d) {
                options[att] = d[att];
            }
            _o[d.id] = new google.maps.Marker(options);
            _coords[d.id] = {lat: d.coords.split(' ')[0], lon: d.coords.split(' ')[1]};
        }
    };

    public.getSelected = function(){
        var ids= [];
        for (var id in _o){
            if (_o[id].inSelection) ids.push(id);
        }
        return ids;

    };

    public.getAll = function(){
        return _o;
    };
    public.getAllCoordinates = function(){ //actually only the selected ;)
        var res = {};
        for (var id in _coords){
            if (_o[id].inSelection) res[id] = _coords[id];
        }
        return res;
    };

    public.getGeom = function( id){

    };
    _constructor();
    return public;
};
