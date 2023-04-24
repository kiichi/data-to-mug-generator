var div = 7.0
var e = 1; // extrusion
var ed = 1; // extrusion step
var z = 0; // initial should be zero?
var zd = 0.5/div; // z-axis increment 0.5 mm height N angle to complete each circle
var diameter = 15;
var factor = 0.3;
var offset = 100; // offset from edge, should be half of box
var colIndex = 5; //
var vstretch = 2; // vertical stretch
var retArr = [];

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}


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

// aggregate per day
var converted = data.split('\n')
	.splice(1,2130)
	.map((line)=>{ 
		var parts = line.split(',');
		return [parseFloat(parts[colIndex]), (new Date(parts[1])).toISOString().split('T')[0]];
	}); // cut bottom after 2021 no energy data though

var results = [];
var first = new Date(converted[0][1]);
var last = new Date(converted[converted.length-1][1]);
for (var dt = first; dt <= last; dt = dt.addDays(1)){
	results[dt.toISOString().split('T')[0]] = 0;
}

for (var i=0; i<converted.length; i++){	
	var key = converted[i][1];
	var val = converted[i][0];
	results[key] += val;
}

var keys = Object.keys(results);
keys = keys.sort();

console.log(keys)

var res2 = [];
for (var i=1; i<keys.length; i++) {
	var val = results[keys[i]];
	res2.push(val);
}

//res2 = smoothOut(res2,0.1);
//res2 = extend(res2, div, vstretch);

for (var i=1; i<res2.length; i++) {
		var val = res2[i];
		var modifier = val*factor;
        var resizedDiameter = diameter + modifier;
		var x = offset + resizedDiameter * Math.cos(i*2*Math.PI/div);
		var y = offset + resizedDiameter * Math.sin(i*2*Math.PI/div);
		
		z = z+zd;
		e = e+ed;
		retArr.push({"X":x, "Y":y, "Z":z,"E":e, "Comment":``}); 
		
}
return retArr;