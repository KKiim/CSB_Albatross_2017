var GuiInit = function(birds, dwrapper){
    var public = this;

    function constructor(){
        _init();
    }

    function _init(){
        for (var i=0; i<28; i++) $('#birdselection').append('<option value="bird'+i+'">Albatross '+i+'</option>');
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
        });
        $("#settingsDialog").draggable({
            handle: ".modal-header"
        });

        $("#btn_viewsettings").on('click', function(){
            $('#settingsDialog').modal('show');
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
        $('.cesium-viewer-bottom').css('display', 'none');

        $('#cesiumContainer .cesium-viewer-toolbar').detach().appendTo('#buttonbar-right')

        $('#cesiumContainer .cesium-viewer-fullscreenContainer').detach().appendTo('#full')
        $('#cesiumContainer').css('height', $(document).height());
        $('#secondView').css('height', $(document).height());
        $('#leftpanel').on('mouseenter', function(){
            $(this).css('opacity', 1);
        }).on('mousemove', function(){
            $(this).css('opacity', 1);
        }).on('mouseleave', function(){
            $(this).css('opacity', 0.2);
        });
        $('.cesium-viewer-toolbar').on('mouseenter', function(){
            $(this).css('opacity', 1);
        }).on('mousemove', function(){
            $(this).css('opacity', 1);
        }).on('mouseleave', function(){
            $(this).css('opacity', 0.2);
        });
        $('#btn_dualview').on('click', function(){
            $('#secondView').toggle();
            $('#sep').toggle();
            $('#cesiumContainer').css('width', function(){
                if ($('#secondView').css('display') == 'none') return '100%';
                return 'calc(50% - 2px)';
            });
        })
        /*
        $('input[type=checkbox]').on('click', function(e){
            console.log("bla");
            e.stopPropagation();
        });*/

        $('#searchGeom').on('input', function(){ //filter data table, when you type:
            var dt = $('#drawoverview').dataTable();
            var query = $(this).val();
            dt.fnFilter(query); //custom search on datatable
        });
        var c = new Clock('#clock', function(){console.log("bla")});
        $('tbody').on('click','td.select-checkbox', function(){
            var tbl = $('#drawoverview').DataTable();
            var d = tbl.row($(this).parent()).data();
            dwrapper.setVisibility(d, !$(this).parent().hasClass('selected'));
            var visibles = dwrapper.getVisibles();
            if (visibles.length > 0){
                $('#areaFilterState').prop('checked', true);
                $('#areaFilterState').attr('disabled', false);
                birds.requestAreaFilter(visibles);
            } else {
                $('#areaFilterState').prop('checked', false);
                $('#areaFilterState').attr('disabled', true);
                birds.finalizeFilterUpdate();
            }
        });
        $('#drawoverview').DataTable({
                rowCallback: function ( row, data ) {
                    if (data[5]){
                        console.log("test");
                        $(row).addClass('selected');
                    }
                },
                paging: false,
                info: false, //no 'displaying x/100 items'
                scrollY: "140px",
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
                    className: 'select-checkbox',
                    targets:   0},
                    {
                        visible: false,
                        targets:   4
                    },
                    {
                        visible: false,
                        targets:   5
                    }]

            });

            $('#drawoverview tbody').on('click', 'td:not(.select-checkbox)', function(){ //blue highlighting of table rows
                $('#drawoverview tbody > tr' ).not($(this).parent()).removeClass('highlightedrow');
                $(this).parent().toggleClass('highlightedrow');
            });
    }

    function _styleUpdate(){
        var val = $('#birdselection').val();
        var sel = parseInt(val.replace("bird", ""));
        if (sel < 0 ) {
            birds.styleAll();
            return;
        }
        birds.styleSingle(sel);
    }
    constructor();
    return public;
};
