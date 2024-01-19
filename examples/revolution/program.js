var div = 12.0
var e = 1; // extrusion
var ed = 1; // extrusion step
var z = 0; // initial should be zero?
var zd = 0.5/div; // z-axis increment 0.5 mm height N angle to complete each circle
var diameter = 30; // 30 for small cup 50 for tall vase
var factor = 0.00001; // scale the original value
var offset = 255/2; // offset from edge, should be half of box e.g Tronxy Moore 2 is 255mm box
var colIndex = 1; // col 3 = p1, col 4 = p2
var vstretch = 2; // vertical stretch - 2 for small cup 4 for tall vase
var twist = 0.001;//
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

var results = {};
var raw = data.split('\n')
	.map((line)=>{ 
		var parts = line.split(',');
		//return parseInt(parts[colIndex]);
		// extract only month
		//return [parts[0].substring(0,7),parseFloat(parts[1])];
		return [""+parts[0],parseFloat(parts[1])];
	}).splice(1);

raw.forEach(element => {
	// remove scratched
	var dateStr = element[0];
	//if(element[1]=='0'){
		if (results[dateStr]) {
			results[dateStr] += element[1];
		}
		if (dateStr && !results[dateStr]){
			// pad zero
			if (dateStr.length<9){
				dateStr = dateStr + "0";
			}
			results[dateStr] = element[1];
		}
	//}
});
//console.log(results);

var csv = '';
var converted = [];

//////////////////////////////////////////////////////////////////////
// NOTE Actual data can go upto 1781.0426 after revolutional war, the record 
// on the website about bond issued from loan office doesn't match actual war period (1775-1783)
//////////////////////////////////////////////////////////////////////

// Define the start date
const startDate = new Date('1777-04-02');

// Define the end date
const endDate = new Date('1780-08-02'); // or 1780-08-02 (after this year, no record for while) or 1789-05-28 (very end)

// Function to format the date as yyyy.mmdd
function formatDate(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}.${month}${day}`;
}

// Loop through and print the dates
let currentDate = startDate;
var prev = 0;
var cum = 0;
while (currentDate <= endDate) {
  var dateStr = formatDate(currentDate);
  
  if (results[dateStr]){
	cum += results[dateStr];
  }
  //console.log(dateStr, cum);
  csv += dateStr+','+cum+'\n';
  converted.push(cum);
  currentDate.setDate(currentDate.getDate() + 1); // Increment the date by one day
  
}

//console.log(csv); // optional to dump and visualize


// Instead of number of 1, let's replicate 1 layer many times
//converted = extend(converted, 1, vstretch);
converted = expandInterpolate(converted, vstretch);
//converted = smoothOut(converted,0.8);

// reverse
converted = converted.reverse();

for (var i=1; i<converted.length; i++) {
		var val = converted[i];
		var modifier = val*factor;
        var resizedDiameter = diameter + modifier;
		var x = offset + resizedDiameter * Math.cos(i*2*Math.PI/div + (i*twist));
		//var y = offset + resizedDiameter * Math.sin(i*2*Math.PI/div + (i*0.001*0.001)); // flat twist
		var y = offset + resizedDiameter * Math.sin(i*2*Math.PI/div + (i*twist));
		
		z = z+zd;
		e = e+ed;
		retArr.push({"X":x, "Y":y, "Z":z,"E":e, "Comment":``});
}
console.log(retArr);
return retArr;