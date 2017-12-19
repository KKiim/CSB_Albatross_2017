var MapStyle = function () {
    var public = this;
    var sheet; //current sheet

    function constructor() {
        sheet = public.getDefault();
    }

    public.getDefault = function () {
        return [
            {
                //basic map styles
                stylers: [
                    {
                        "saturation": -100 //-40
                    },
                    /*
                     standard lightness: 30%
                     -> lightness values specified by the slider in
                     domain of [-90,10]
                     */
                    {
                        "lightness": -35
                    },
                    {
                        "hue": "#00000" //"#0066ff"
                    },
                    {
                        "gamma": 0.2 //0.85
                    }
                ]
            },
            //basic feature styles
            {
                featureType: "road",
                stylers: [{
                    visibility: "off"
                }]
            },
            {
                featureType: "administrative",
                stylers: [{
                    visibility: "off"

                }]
            },

            //display labels
            {
                featureType: "administrative.country",
                stylers: [{
                    weight: 1.5
                }, {
                    visibility: "on"
                },
                    //{ invert_lightness: true } white borders when whole globe is darkened? could get discussed.
                ] //additional: extra weight for country borders
            },
            {
                featureType: "administrative.locality",
                elementType: "labels",
                stylers: [{
                    visibility: "off"
                },
                    {
                        invert_lightness: true
                    }
                ]
            },
            {
                featureType: "administrative.country",
                elementType: "labels",
                stylers: [{
                    visibility: "off"
                },
                    {
                        invert_lightness: true
                    }]
            },
            {
                featureType: "water",
                elementType: "labels",
                stylers: [{
                    visibility: "off"
                },
                    {
                        invert_lightness: true
                    }
                ]
            },

            {
                featureType: "poi", //points of interest
                elementType: "labels",
                stylers: [{
                    visibility: "off"
                }, {
                    invert_lightness: true
                }]

            },
            {
                featureType: "landscape", //hide labels & icons for mountains and man-mades...
                elementType: "labels", //hiding the features completely looks very weird 
                stylers: [{
                    visibility: "off",
                },
                    {
                        invert_lightness: true
                    }]
            }
        ]
    };

    public.getNight = function(){
         return [
            {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.fill', stylers: [{color: '#ffffff'}]},

            {
                featureType: 'water',
                elementType: 'geometry',
                stylers: [{color: '#17263c'}]
            },
             {
                 featureType: "road",
                 stylers: [{
                     visibility: "off"
                 }]
             },
             {
                 featureType: "administrative",
                 stylers: [{
                     visibility: "on"

                 }]
             },
             {
                 featureType: "administrative.country",
                 elementType: 'geometry',
                 stylers: [{
                     weight: 0.4
                 }, {
                     visibility: "on"
                 },{color: '#000000'}

                 ]
             },
             {
                 featureType: "administrative.locality",
                 elementType: "labels",
                 stylers: [{
                     visibility: "off"
                 }
                 ]
             },
             {
                 featureType: "administrative.country",
                 elementType: "labels",
                 stylers: [{
                     visibility: "on"
                 }]
             },
             {
                 featureType: "water",
                 elementType: "labels",
                 stylers: [{
                     visibility: "off"
                 }
                 ]
             },

             {
                 featureType: "poi", //points of interest
                 elementType: "labels",
                 stylers: [{
                     visibility: "off"
                 }]

             },
             {
                 featureType: "landscape", //hide labels & icons for mountains and man-mades...
                 elementType: "labels", //hiding the features completely looks very weird
                 stylers: [{
                     visibility: "off",
                 }]
             }
        ];
    };

    public.setLightness = function (val) {
        sheet[0].stylers[1]["lightness"] = val;
    };

    public.setLabelsVisible = function (bool) {
        for (var i = 4; i < sheet.length; i++) sheet[i].stylers[0]["visibility"] = (bool) ? "on" : "off";
    };
    public.getSheet = function () {
        return sheet;
    };
    constructor();
};