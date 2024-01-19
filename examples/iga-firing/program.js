var div = 30.0
var e = 1; // extrusion
var ed = 0.8; // extrusion step
var z = 0; // initial should be zero?
var zd = 0.5/div; // z-axis increment 0.5 mm height N angle to complete each circle
var diameter = 10;
var factor = 0.02;
var offset = 100; // offset from edge, should be half of box
var colIndex = 3; // col 3 = p1, col 4 = p2
var vstretch = 3; // vertical stretch
var retArr = [];

// vartically streth - multiply N layers of original one layer contains data points (div)
// to repeat  (x rep to stretch)
// e.g. 
// -- take original array which contains 60 data points per layer, stretch x10
// streatch(arr, 60, 10); 
function extend(arr, n, rep){
	var expanded = [];
	for (var i=0; i<arr.length-n-1; i+=n){
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
//https://stackoverflow.com/questions/32788836/smoothing-out-values-of-an-array
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

// var converted = data.split('\n')
//                 .map((line)=>{ 
// 					var parts = line.split(',')
// 					return [parseInt(parts[3]),parseInt(parts[4])];
// 				});

var converted = data.split('\n')
	.splice(1)
	.map((line)=>{ 
		var parts = line.split(',')
		return parseInt(parts[colIndex]);
	}).reverse();

//console.log(converted);
converted = smoothOut(converted,0.6);
converted = extend(converted, div, vstretch);

//console.log(converted);

for (var i=1; i<converted.length; i++) {
		//var val = converted[i][0];
		var val = converted[i];
		var modifier =  val*factor;
        var resizedDiameter = diameter + modifier;
		var x = offset + resizedDiameter * Math.cos(i*2*Math.PI/div);
		var y = offset + resizedDiameter * Math.sin(i*2*Math.PI/div);
		
		z = z+zd;
		e = e+ed;
		retArr.push({"X":x, "Y":y, "Z":z,"E":e, "Comment":``}); 
		
}
return retArr;
