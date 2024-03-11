var div = 20.0
var e = -1; // extrusion
var ed = 1; // extrusion step
var z = 0; // initial should be zero?
var zd = 0.5/div; // z-axis increment 0.5 mm height N angle to complete each circle
var diameter = 40;
var factor = 0.1;
var offset = 100; // offset from edge, should be half of box
var retArr = [];
var converted = data.split('\n')
                .map((item)=>{ return parseFloat(item) });
for (var i=1; i<converted.length; i++) {
		var modifier = converted[i] * factor;
        var resizedDiameter = diameter + modifier;
		var x = offset + resizedDiameter * Math.cos(i*2*Math.PI/div);
		var y = offset + resizedDiameter * Math.sin(i*2*Math.PI/div);
		z = z+zd;
		e = e+ed;
		retArr.push({"X":x, "Y":y, "Z":z,"E":e, "Comment":``}); //Layer: ${ (i%div) + 1} --------
}
return retArr;
