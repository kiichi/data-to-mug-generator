var div = 60.0
var stretch = 3; // vertical stretch x3
var e = 1; // extrusion
var ed = 1; // extrusion step
var z = 0; // initial should be zero?
var zd = 10.5/div; // z-axis increment 0.5 mm height N angle to complete each circle
var diameter = 40;
var factor = 0.1;
var offset = 100; // offset from edge, should be half of box
var retArr = [];
var converted = data.split('\n')
                .map((line)=>{ 
					var parts = line.split(',')
					return [parseInt(parts[3]),parseInt(parts[4])];
				});

for (var i=1; i<converted.length; i++) {
		var val = converted[i][0];
		var modifier = val * factor;
        var resizedDiameter = diameter + modifier;
		var x = offset + resizedDiameter * Math.cos(i*2*Math.PI/div);
		var y = offset + resizedDiameter * Math.sin(i*2*Math.PI/div);
		
		z = z+zd;
		e = e+ed;
		retArr.push({"X":x, "Y":y, "Z":z,"E":e, "Comment":``}); 
		
}
return retArr;
