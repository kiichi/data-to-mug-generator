var div = 10.0
var e = 1; // extrusion
var ed = 1; // extrusion step
var z = 0; // initial should be zero?
var zd = 0.5/div; // z-axis increment 0.5 mm height N angle to complete each circle
var diameter = 40;
var factor = 2;
var offset = 100; // offset from edge, should be half of box
var colIndex = 1; // col 3 = p1, col 4 = p2
var vstretch = 40; // vertical stretch
var retArr = [];

// simply expand between two datapoints
function expandInterpolate(arr, rep){
	var expanded = [];
	for (var i=0; i<arr.length-1; i++){
		var cur = arr[i];
		var nxt = arr[i+1];
		var step = (nxt-cur) / rep;
		for (var j=0; j<rep; j++){
			expanded.push(cur + j*step);
		}
		
	}
	return expanded;
}

function extend(arr, n, rep){
	var expanded = [];
	for (var i=0; i<arr.length; i+=n){
		var layer = arr.slice(i,i+n);
		for (var j=0;j<rep; j++){
			expanded = expanded.concat(layer);
		}
	}
	return expanded;
}

function avg (v) {
	return v.reduce((a,b) => a+b, 0)/v.length;
}

function smoothOut (vector, variance) {
	var t_avg = avg(vector)*variance;
	var ret = Array(vector.length);
	for (var i = 0; i < vector.length; i++) {
		(function () {
		var prev = i>0 ? ret[i-1] : vector[i];
		var next = i<vector.length ? vector[i] : vector[i-1];
		ret[i] = avg([t_avg, avg([prev, vector[i], next])]);
		})();
	}
	return ret;
}

var converted = data.split('\n')
	.map((line)=>{ 
		var parts = line.split(',');
		return parseInt(parts[colIndex]);
	}).splice(1);

// Instead of number of 1, let's replicate 1 layer many times
//converted = extend(converted, 1, vstretch);
converted = expandInterpolate(converted, 30);
converted = smoothOut(converted,0.8);

for (var i=1; i<converted.length; i++) {
		var val = converted[i];
		var modifier = val*factor;
        var resizedDiameter = diameter + modifier;
		var x = offset + resizedDiameter * Math.cos(i*2*Math.PI/div + (i*0.001));
		//var y = offset + resizedDiameter * Math.sin(i*2*Math.PI/div + (i*0.001*0.001)); // flat twist
		var y = offset + resizedDiameter * Math.sin(i*2*Math.PI/div + (i*0.001));
		
		z = z+zd;
		e = e+ed;
		retArr.push({"X":x, "Y":y, "Z":z,"E":e, "Comment":``});
}
return retArr;