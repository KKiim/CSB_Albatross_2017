/**
 * Created by Phil on 12.01.2018.
 */
var Weatherslider = function(birds){

    function _constructor(){
        var sel = '#tempselector, #humselector, #windselector, #winddirselector, #pressureselector';
        $(sel).resizable({containment:'parent', handles:'e, w', maxWidth:150, resize: _onUpdate, stop: _onStop});
        $(sel).draggable({containment:'parent', drag: _onUpdate, stop: _onStop});
        $('#ratioslider').on('change', _onStop);
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
        var label = '#' + $(this).attr('id').replace('selector', '') + 'range';
        $(label).html(selmin + '-' + selmax );

    }

    function _onStop(){
            $('#weatherFilterState').prop('checked', true);
            $('#weatherFilterState').removeAttr('disabled');


        var conditions = {};
        ['temp', 'hum', 'wind', 'winddir', 'pressure'].forEach(function(f){
            var tmp = $('#'+f+'range').html().split('-');
            conditions[f] = [parseFloat(tmp[0]), parseFloat(tmp[1])];
        });
        conditions.ratio = parseFloat($('#ratioslider').val())/100.0;
        $('#pointratio').html(conditions.ratio);
        birds.requestWeatherFilter(conditions);
    }



    _constructor();
};