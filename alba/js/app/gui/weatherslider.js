/**
 * Created by Phil on 12.01.2018.
 */
var Weatherslider = function(birds, dwrapper, addendum){

    var _windDir = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];

    function _constructor(){
        var sel = '#tempselector'+addendum+', #humselector'+addendum+', #windselector'+addendum+', #winddirselector'+addendum+', #pressureselector'+addendum;
      
       
		  $(sel).each(function(){
			  var perc = {min:0,max:1};
			  $(this).rangeSlider({range:true, valueLabels: "hide", defaultValues: perc, range:perc, bounds:perc});
			  var id = $(this).attr('id'); 
			  var min = parseFloat($(this).attr('min'));
			  var r = parseFloat($(this).attr('max')) - min; 
			  var label = '#' + id.replace('selector', '').replace(addendum, '') + 'range' + addendum;
			  
			  $(this).bind('valuesChanging', function(e, d){
				   var v1 = min + d.values.min*r; 
				   v1 = Math.round(v1*100.0)/100.0;
				   var v2 = min + d.values.max*r; 
				   v2 = Math.round(v2*100.0)/100.0;				   
				   $(label).html( v1+ '-' + v2); 
			  }); 
			  
			  $(this).bind('valuesChanged', _onStop); 
		  });
        $('#ratioslider'+addendum).on('change', _onStop);
    };


    function _onStop(){
            $('#weatherFilterState'+addendum).prop('checked', true);
            $('#weatherFilterState'+addendum).removeAttr('disabled');


        var conditions = {};
        ['temp', 'hum', 'wind', 'winddir', 'pressure'].forEach(function(f){
            var tmp = $('#'+f+'range'+addendum).html().split('-');
            if (f === 'winddir') {
                conditions[f] = _degToCompass(parseFloat(tmp[0]), parseFloat(tmp[1]));
            } else {
                conditions[f] = [parseFloat(tmp[0]), parseFloat(tmp[1])];
            }
        });
        conditions.ratio = parseFloat($('#ratioslider'+addendum).val())/100.0;
        $('#pointratio'+addendum).html(conditions.ratio);
		if ($('#areaFilterState'+addendum).prop('checked')){
			var visibles = dwrapper.getVisibles(); 
			if (visibles.length > 0) birds.requestBothFilter(conditions, visibles); 
		} else {
			birds.requestWeatherFilter(conditions);
		}
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