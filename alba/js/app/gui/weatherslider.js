/**
 * Created by Phil on 12.01.2018.
 */
var Weatherslider = function(birds, addendum){

    var _windDir = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];

    function _constructor(){
        var sel = '#tempselector'+addendum+', #humselector'+addendum+', #windselector'+addendum+', #winddirselector'+addendum+', #pressureselector'+addendum;
        $(sel).resizable({containment:'parent', handles:'e, w', maxWidth:150, resize: _onUpdate, stop: _onStop});
        $(sel).draggable({containment:'parent', drag: _onUpdate, stop: _onStop});
        $('#ratioslider'+addendum).on('change', _onStop);
    };


    function _onUpdate(){
        var min = parseFloat($(this).attr('min'));
        var max =  parseFloat($(this).attr('max'));

        var l = $(this).offset().left- $(this).parent().offset().left;
        var w = $(this).parent().width();
        var selmin = min + (max-min)* l/w;
        selmin = Math.round(selmin * 100) / 100;
        var selmax = min + (max-min)* (l+$(this).width()) /w;
        selmax = Math.round(selmax * 100) / 100;
        var label = '#' + $(this).attr('id').replace('selector', '').replace(addendum, '') + 'range' + addendum;
        $(label).html(selmin + '-' + selmax );
    }

    function _onStop(){
            $('#weatherFilterState'+addendum).prop('checked', true);
            $('#weatherFilterState'+addendum).removeAttr('disabled');


        var conditions = {};
        ['temp', 'hum', 'wind', 'winddir', 'pressure'].forEach(function(f){
            var tmp = $('#'+f+'range'+addendum).html().split('-');
            if (f === 'winddir') {
                conditions[f] = _degToCompass(parseFloat(tmp[0]), parseFloat(tmp[1]));
                console.log(_degToCompass(parseFloat(tmp[0]), parseFloat(tmp[1])));
            } else {
                conditions[f] = [parseFloat(tmp[0]), parseFloat(tmp[1])];
            }
        });
        conditions.ratio = parseFloat($('#ratioslider'+addendum).val())/100.0;
        $('#pointratio'+addendum).html(conditions.ratio);
        birds.requestWeatherFilter(conditions);
    }

    function _degToCompass(num1, num2 ) {
        var i = Math.round((num1 / 22.5) );
        var j = Math.round((num2 / 22.5) );
        var tempArr = [];
        var tempIndex = 0;
        if (j - i >= 15 ) {
            tempArr = _windDir; //otherwise only N is included in this case
        } else {
            for (var c = i; c != (j + 1) % 16; c = (c + 1) % 16) tempArr[tempIndex++] = _windDir[c];
        }
        return tempArr;
    }


    _constructor();
};