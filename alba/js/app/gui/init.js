var GuiInit = function(birds){
    var public = this;

    function constructor(){
        _init();
    }

    function _init(){
        for (var i=0; i<28; i++)        $('#birdselection').append('<option value="bird'+i+'">Albatross '+i+'</option>');
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
        $('.cesium-navigationHelpButton-wrapper').css('display','none');
        $('.cesium-home-button').css('display', 'none');
        $('.cesium-baseLayerPicker-selected').parent().detach().appendTo('#tiletype');
        $('.cesium-baseLayerPicker-dropDown').detach().appendTo('#tiletype');
        $('#btn_viewsettings').detach().appendTo('.cesium-viewer-toolbar');
        $('#btn_viewsettings').css('display', 'inline');
        $('.cesium-viewer-bottom').css('display', 'none');

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
        $('input[type=checkbox]').on('click', function(e){
            e.stopPropagation();
        });
        var c = new Clock('#clock', function(){console.log("bla")});
            $('#drawoverview').DataTable({
                paging: false,
                info: false, //no 'displaying x/100 items'
                scrollY: "140px",
                order: [[ 1, "desc" ]],
                responsive: true,
                select: {
                    style:    'os',
                    selector: 'td:first-child'
                },
                columnDefs: [{
                    orderable: false,
                    className: 'select-checkbox',
                    targets:   0
                }]
            });
            $('#drawoverview tbody').on('click', 'tr', function(){ //blue highlighting of table rows
                $(this).toggleClass('selectedrow');
                var tbl = $('#dboverview').DataTable();
                var d = tbl.row( this).data();
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
