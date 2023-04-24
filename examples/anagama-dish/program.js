var e = 1; // extrusion
var ed = 0.2; // extrusion step
var z = 0; // initial should be zero?
var zd = 0.5; // z-axis increment 0.5 mm height N angle to complete each circle
var offset = 20; // offset from edge, should be half of box
var colIndex = 3; // col 3 = p1, col 4 = p2
var layers = 60;
var retArr = [];

var converted = data.split('\n')
	.splice(400)
	.map((line)=>{ 
		var parts = line.split(',')
		return parseInt(parts[colIndex]);
	});
var filtered = [];
for (var i=0;i<converted.length; i=i+60){
	filtered.push(converted[i]);
}
for (var j=0; j<layers; j++){
	for (var i=0; i<filtered.length; i++) {
			var val = filtered[i];
			var x = offset + i;
			var y = offset + val/20;			
			z = z+zd/(filtered.length);
			e = e+ed;
            
			if (i == 0){
				e = e + ed*30;
			}
			retArr.push({"X":x, "Y":y, "Z":z,"E":e, "Comment":``}); 
	}
}
return retArr;
