var zd = 0.5/12.0; // z-axis increment 0.5 mm height 12 steps to complete each circle
var ed = 3.0; // extrusion
var z = 1.0; // should be zero?
var e = 0;
var retArr = [];
var converted = data.split('\n')
                .filter(item=>item.indexOf('GISTEMP')>-1)
                .map(item=>parseFloat(item.split(',')[2].replace('\r','')))
                .reverse();
for (var i=0; i<converted.length; i++) {
    // data[i] is around -0.5 to +1
    var modifier = converted[i] * 10;
    var x = 90 + (50 + modifier) * Math.cos(i*Math.PI/6.0);
    var y = 90 + (50 + modifier) * Math.sin(i*Math.PI/6.0);
    z = z+zd;
    e = e+ed;
    retArr.push({"X":x, "Y":y, "Z":z,"E":e}); // do we need e
}
return retArr;
