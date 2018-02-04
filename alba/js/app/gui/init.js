var GuiInit = function(birds, dwrapper, widget, addendum){
    var public = this;
    var left_lookup = {};

	    var _windDir = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];

    public.initBasis= function(){
        for (var i=0; i<28; i++) $('#birdselection').append('<option value="bird'+i+'">Alba ' + i +' ('+ birds.getOriginalID(i) +') ' +'</option>');
        $('.modal').on('shown.bs.modal', function() {
            $(".modal-header").css("padding",'2px');
            $(".modal-header").css("margin",'5px');
            $(".modal-footer").css("padding",'2px');
            $(".modal-footer").css("margin",'2px');
            $(".modal-body").css("padding",'2px');
            $(".modal-body").css("margin",'2px');
            $(".modal-dialog").css({
                'position': 'relative',
                'display': 'table',
                'overflow-y': 'auto',
                'overflow-x': 'auto',
                'width': '40px',
                'min-width': '10px'
            });
            $('.modal-backdrop').removeClass("modal-backdrop");
        });

        $('.accordion-toggle').on('click', function(){
            $(this).toggleClass('accordion-highlighted');
        });
        $('#settingsDialog, #detailsDialog').modal({backdrop: 'static', keyboard: false, show:false});

        $("#settingsDialog, #detailsDialog").draggable({handle: ".modal-header"});


        $("#btn_viewsettings").on('click', function(){
            $('#settingsDialog').modal('show');
            $('body').removeClass('modal-open');
        });
        $('#widthselection').slider();

        $('#colorselection,#transselection,#widthselection').on('change', _styleUpdate);
        $('#secondView .cesium-viewer-toolbar').css('display', 'none');
        $('.cesium-navigationHelpButton-wrapper').css('display','none');
        $('.cesium-home-button').css('display', 'none');
        $('.cesium-baseLayerPicker-selected').parent().detach().appendTo('#tiletype');
        $('.cesium-baseLayerPicker-dropDown').detach().appendTo('#tiletype');


        $('#btn_viewsettings').detach().appendTo('.cesium-viewer-toolbar');
        $('#btn_viewsettings').css('display', 'inline');

         $('#btn_dualview').detach().appendTo('.cesium-viewer-toolbar');
        $('#btn_dualview').css('display', 'inline');
        $('#btn_dualviewsel').detach().appendTo('.cesium-viewer-toolbar');

        $('.cesium-viewer-bottom').css('display', 'none');

        $('#cesiumContainer .cesium-viewer-toolbar').detach().appendTo('#buttonbar-right')

        $('#cesiumContainer .cesium-viewer-fullscreenContainer').detach().appendTo('#full');
        $('#cesiumContainer').css('height', $(document).height());
        $('#secondView').css('height', $(document).height());


        $('#leftpanel').on('mouseenter', function(){
            $(this).css('opacity', 1);
        }).on('mousemove', function(){
            $(this).css('opacity', 1);
        });
        $('#cesiumContainer, #secondView').on('mouseenter', function(){
            $('#leftpanel').css('opacity', 0.2);
            $('.cesium-viewer-toolbar').css('opacity', 0.2);
        });

        $('.cesium-viewer-toolbar').on('mouseenter', function(){
            $(this).css('opacity', 1);
        }).on('mousemove', function(){
            $(this).css('opacity', 1);
        });

        $('#btn_dualview').on('click', function(){
            if ($(this).text() === 'Mono'){
                //move to mono

                $('#accordiondual').hide();
                $('#accordion').show();
                $(this).text('Dual');
                $('#btn_dualviewsel').hide();
                var visbirds = $('#birds').data('public').getVisibleBirds();
                $('#areachart').data('public').update(visbirds,'left');

                var visbirds2 = $('#birds').data('public').getVisibleBirds();
                $('#areachart').data('public').update(visbirds2,'right');
                $('#areachart').data('public').hideSecond();
				$('#weatherinner > .selector').rangeSlider('resize'); 
				$('#altselector').rangeSlider('resize');
            } else if ($(this).text() === 'Dual'){
                var visbirds = $('#birdsdual').data('public').getVisibleBirds();
                $('#areachart').data('public').update(visbirds, 'right');
                //move to dual
                $('#accordiondual').show();
                $('#accordion').hide();
                $(this).text('Mono');
                $('#btn_dualviewsel').show();
                $('#areachart').data('public').showSecond();
				$('#weatherinnerdual > .selector').rangeSlider('resize'); 
				$('#altselectordual').rangeSlider('resize');
            }
            $('#secondView').toggle();
            $('#sep').toggle();
            $('#cesiumContainer').css('width', function(){
                if ($('#secondView').css('display') == 'none') return '100%';
                return 'calc(50% - 2px)';
            });

        });
		$('#chartsel').on('change', function(){
			$('#detailsWrapper').data('public').updateWeatherChart()
		}); 
        $('#btn_dualviewsel').on('click', function(){
            if ($(this).text() === 'L'){
                $('#accordiondual').hide();
                $('#accordion').show();
                $(this).text('R');
				$('#weatherinner > .selector').rangeSlider('resize'); 
				$('#altselector').rangeSlider('resize');
            } else if ($(this).text() === 'R'){
                $('#accordion').hide();
                $('#accordiondual').show();
                $(this).text('L');
				$('#weatherinnerdual > .selector').rangeSlider('resize'); 
				$('#altselectordual').rangeSlider('resize');
            }
        });

        $('input[type=checkbox]').on('click', function(e){
            e.stopPropagation();
        });

        $('#contextselection').on('change', function(){
            var visbirds1 = $('#birds').data('public').getVisibleBirds();
			
           $('#areachart').data('public').update(visbirds1, 'left');
		   if ($('#accordiondual').is(':visible')){
			   var visbirds2 = $('#birdsdual').data('public').getVisibleBirds();
				$('#areachart').data('public').update(visbirds2, 'right');
		   }
        });






		$("#accordion, #accordiondual").on("shown.bs.collapse", function () {
			                      $(".selector").rangeSlider("resize");

		}); 
        $('#drawoverview, #drawoverviewdual').DataTable({
                paging: false,
                info: false, //no 'displaying x/100 items'
                scrollY: "100px",
                order: [[ 4, "desc" ]],
                language: {
                    emptyTable: "Please draw some geometries."
                },
                select: {
                    style:    'multi',
                    selector: 'td:first-child'
                },
                columnDefs: [{
                    orderable: false,
                    width:'20px',
                    render: function ( data, type, row ) {
                        if (type === 'display') {
                            var addendumchecked = (data)  ? 'checked' : '';
                            return '<input type="checkbox" '+addendumchecked +' class="geomcheck">';
                        }
                        return data;
                    },
                    targets:   0},
                    {
                        visible: false,
                        targets:   4
                    }]

            });


    }

    public.initListeners = function(){
		
        $('#searchGeom'+addendum).on('input', function(){ //filter data table, when you type:
            var dt = $('#drawoverview'+addendum).dataTable();
            var query = $(this).val();
            dt.fnFilter(query); //custom search on datatable
        });
        $('#drawoverview'+addendum+' tbody').on('click','input.geomcheck', function(){
            var tbl = $('#drawoverview'+addendum).DataTable();
            var d = tbl.row($(this).parent().parent()).data();
            dwrapper.setVisibility(d, $(this).prop('checked'));
            var visibles = dwrapper.getVisibles();
            if (visibles.length > 0){
                $('#areaFilterState'+addendum).prop('checked', true);
                $('#areaFilterState'+addendum).attr('disabled', false);
				if ($('#weatherFilterState'+addendum).prop('checked')){
					birds.requestBothFilter(getWeatherConditions(), visibles); 
				} else {
					 birds.requestAreaFilter(visibles);
				}
            } else {
                $('#areaFilterState'+addendum).prop('checked', false);
                $('#areaFilterState'+addendum).attr('disabled', true);
                $('#areachart').data('public').update(birds.getVisibleBirds());
                birds.finalizeFilterUpdate();
            }
            $('#leftpanel').css('opacity', 1);
        });

        $('#areaFilterState'+addendum).on('click', function(){
            if ($(this).prop('checked')){
                dwrapper.showAllChecked();
                var visibles = dwrapper.getVisibles();
                if (visibles.length > 0){
					if ($('#weatherFilterState'+addendum).prop('checked')){
						birds.requestBothFilter(getWeatherConditions(), visibles); 
					} else {
						birds.requestAreaFilter(visibles);
					}
				}
            } else {
                dwrapper.hideAll();
				if ($('#weatherFilterState'+addendum).prop('checked')){
					birds.requestWeatherFilter(getWeatherConditions());
				} else {
					birds.finalizeFilterUpdate();
					$('#areachart').data('public').update(birds.getVisibleBirds());
				}
                
                $('#altcontainer'+addendum).hide();
                $('#drawoverview'+addendum+' tbody > .highlightedrow').removeClass('highlightedrow');
            }

        });

        $('#weatherFilterState'+addendum).on('click', function(){
            if ($(this).prop('checked')){
				if ($('#areaFilterState'+addendum).prop('checked')){
					var visibles = dwrapper.getVisibles(); 
					if (visibles.length > 0) birds.requestBothFilter(getWeatherConditions(), visibles); 
				} else {
					birds.requestWeatherFilter(getWeatherConditions());
				}
                
            } else {
                birds.finalizeFilterUpdate();
                $('#areachart').data('public').update(birds.getVisibleBirds());
            }
        });

        $('#drawoverview'+addendum+' tbody').on('click', 'td:not(.select-checkbox)', function(){ //blue highlighting of table rows
            $('#drawoverview'+addendum+' tbody > tr' ).not($(this).parent()).removeClass('highlightedrow');
            var tbl = $('#drawoverview'+addendum).DataTable();
            var d = tbl.row($(this).parent()).data();
            $(this).parent().toggleClass('highlightedrow');
            if ($('#drawoverview'+addendum+' tbody > .highlightedrow').length > 0){
				  $('#altcontainer'+addendum).show();
				    $('#altselector'+addendum).rangeSlider('resize');
                var selmin = parseInt(d[3].split('-')[0]);
                var selmax = parseInt(d[3].split('-')[1]);
                var w = ((selmax-selmin)/170) * $('#altwrapper').width();
                var l = left_lookup.hasOwnProperty(d[1])? left_lookup[d[1]] : 0;
                $('#altselector'+addendum).rangeSlider('values', selmin, selmax); 
                dwrapper.highlightBounds(d);
              
            } else {
                dwrapper.unhighlightBounds();
                $('#altcontainer'+addendum).hide();
            }
        });
        $('#altselector'+addendum).rangeSlider({range:true, valueLabels: "hide",defaultValues: {min:0,max:170}, range:{min:0,max:170}, bounds:{min:0,max:170}});
		$('#altselector'+addendum).bind('valuesChanging', _onAltChange); 
		$('#altselector'+addendum).bind('valuesChanged', _onAltStop); 
    }
	
	function getWeatherConditions(){
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
		return conditions; 
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
    function _onAltChange(){
        var tbl = $('#drawoverview'+addendum).DataTable();
        var sel = $('#drawoverview'+addendum+' tbody > .highlightedrow');
        var d = tbl.row(sel).data();

        if (d){
            var selected = $("#altselector"+addendum).rangeSlider("values");
			var min = Math.round(selected.min*100.0)/100.0; 
			var max = Math.round(selected.max*100.0)/100.0; 
            dwrapper.setHeights(d, min+"-"+max);
        }
    }

    function _onAltStop(){
        $('#areaFilterState'+addendum).prop('checked', true);
        var visibles = dwrapper.getVisibles();
        if (visibles.length > 0){
			if ($('#areaFilterState'+addendum).prop('checked')){
				birds.requestAreaFilter(getWeatherConditions(), visibles);
			} else {
				birds.requestAreaFilter(visibles);
			}
		}
    };

    function _styleUpdate(){
        var val = $('#birdselection').val();
        var sel = parseInt(val.replace("bird", ""));
        if (sel < 0 ) {
            birds.styleAll();
            return;
        }
        birds.styleSingle(sel);
    }

    function _setSelectElement(birdID)
    {
        var selectedBird = document.getElementById('birdselection');
        console.log("Selected: bird" + birdID);
        selectedBird.value = 'bird' + birdID;
    }


    widget.screenSpaceEventHandler.setInputAction(function onLeftClick(movement) {
        var pickedFeature = widget.scene.pick(movement.position);
        if (Cesium.defined(pickedFeature)){
            var id = birds.getIdByEntityId(pickedFeature.id.id);
            _setSelectElement(id)
        }
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);


    widget.screenSpaceEventHandler.setInputAction(function onLeftClick(movement) {
        var pickedFeature = widget.scene.pick(movement.position);
        if (!pickedFeature || !pickedFeature.id || !pickedFeature.id.id) return;
        if (Cesium.defined(pickedFeature) && Cesium.defined(birds.getIdByEntityId(pickedFeature.id.id))) {
            $('#detailsWrapper').data('public').updateVis(birds.getIdByEntityId(pickedFeature.id.id));
            $('#detailsDialog').modal('show');
            $('body').removeClass('modal-open');

        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    return public;
};
