var div = 100.0
var zd = 0.5/div; // z-axis increment 0.5 mm height 12 steps to complete each circle
var ed = 1.0; // extrusion
var z = 1; // should be zero?
var e = 0;
var diameter = 90;
var factor = 0.1;
var retArr = [];
var converted = data.split('\n')
                .map(item=>parseFloat( (item.split('\t')[1] || '').replace('\r','')))
				.filter(item=>item);
for (var i=1; i<converted.length; i++) {
	for (var j=0; j<div; j++){
		var modifier = -1 * converted[i] * factor;
		var x = diameter + (diameter/2.0 + modifier) * Math.cos(j*2*Math.PI/div);
		var y = diameter + (diameter/2.0 + modifier) * Math.sin(j*2*Math.PI/div);
		z = z+zd;
		e = e+ed;
		retArr.push({"X":x, "Y":y, "Z":z,"E":e, "Comment":''}); // do we need e
	}
	retArr.push({"X":0, "Y":0, "Z":0,"E":0, "Comment":`; Layer: ${i} --------`}); // do we need e
}
return retArr;
