var div = 60.0
var zd = 0.01/div; // z-axis increment 0.5 mm height 12 steps to complete each circle
var ed = 10.0/div; // extrusion
var z = 0.01; // should be zero?
var e = 0;
var diameter = 2;
var factor = 0.1;
var arr = [];
var retArr = [];
var converted = data.split('\n')
                .map(item=>parseFloat( (item.split('\t')[1] || '').replace('\r','')))
				.filter(item=>item);
for (var i=1; i<converted.length; i++) {
	for (var j=0; j<div; j++){
		var modifier = -1 * converted[i] * factor;
		var x = diameter + (diameter/2.0 + modifier) * Math.cos(j*2*Math.PI/div);
		var y = diameter + (diameter/2.0 + modifier) * Math.sin(j*2*Math.PI/div);
		z = z+(j*zd);
		e = e+ed;
		retArr.push({"X":x, "Y":y, "Z":z,"E":e}); // do we need e
		arr.push(`G1 X${x.toFixed(3)} Y${y.toFixed(3)} Z${z.toFixed(3)} E${e.toFixed(3)}`);
	}
}
return retArr;
