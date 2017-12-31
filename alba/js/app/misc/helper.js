var Helper = function(){
  var public = this;

  public.getURLParameter = function(name) {
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
  }
    public.getTransformation = function(transform) {
        /*
         transform is the result from d3.select(this).attr('transform')
         this function makes a beautiful object of those transform strings.
         in d3 v4 this function is no longer part of the actual library.
         c.f. http://stackoverflow.com/questions/38224875/replacing-d3-transform-in-d3-v4/38230545
         Thanks to altocumulus.
         */
        // Create a dummy g for calculation purposes only. This will never
        // be appended to the DOM and will be discarded once this function
        // returns.
        var g = document.createElementNS("http://www.w3.org/2000/svg", "g");

        // Set the transform attribute to the provided string value.
        g.setAttributeNS(null, "transform", transform);

        // consolidate the SVGTransformList containing all transformations
        // to a single SVGTransform of type SVG_TRANSFORM_MATRIX and get
        // its SVGMatrix.
        var matrix = g.transform.baseVal.consolidate().matrix;

        // Below calculations are taken and adapted from the private function
        // transform/decompose.js of D3's module d3-interpolate.
        // var {a, b, c, d, e, f} = matrix;   // ES6, if this doesn't work, use below assignment
        var a=matrix.a, b=matrix.b, c=matrix.c, d=matrix.d, e=matrix.e, f=matrix.f; // ES5
        var scaleX, scaleY, skewX;
        if (scaleX = Math.sqrt(a * a + b * b)) a /= scaleX, b /= scaleX;
        if (skewX = a * c + b * d) c -= a * skewX, d -= b * skewX;
        if (scaleY = Math.sqrt(c * c + d * d)) c /= scaleY, d /= scaleY, skewX /= scaleY;
        if (a * d < b * c) a = -a, b = -b, skewX = -skewX, scaleX = -scaleX;
        return {
            translateX: e,
            translateY: f,
            rotate: Math.atan2(b, a) * Math.PI/180,
            skewX: Math.atan(skewX) * Math.PI/180,
            scaleX: scaleX,
            scaleY: scaleY
        };
    };


};
