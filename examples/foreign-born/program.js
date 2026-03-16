var sides = 6;
var e = 0;
var ed = 12;
var zd = 0.5 / sides;
var z = -zd;
var baseRadius = 60;
var factor = 8;
var offset = 255 / 2;
var twist = 0.06;
var layersPerYear = 20;
var retArr = [];

function parseCsv(text) {
	return text
		.trim()
		.split('\n')
		.slice(1)
		.map(function (line) {
			var parts = line.trim().split(',');
			if (parts.length < 7) {
				return null;
			}

			return {
				year: parts[0].replace('*', ''),
				values: parts.slice(1, 7).map(function (value) {
					return parseFloat(value.replace('\r', '')) || 0;
				}),
			};
		})
		.filter(Boolean);
}

function lerp(start, end, t) {
	return start + (end - start) * t;
}

function scaleValue(value) {
	return Math.log1p(Math.max(value, 0));
}

var rows = parseCsv(data).reverse();

for (var rowIndex = 0; rowIndex < rows.length; rowIndex++) {
	var row = rows[rowIndex];
	var nextRow = rows[rowIndex + 1] || row;

	for (var layerIndex = 0; layerIndex < layersPerYear; layerIndex++) {
		var t = layersPerYear === 1 ? 0 : layerIndex / (layersPerYear - 1);
		var yearProgress = rowIndex + t;

		for (var cornerIndex = 0; cornerIndex < sides; cornerIndex++) {
			var value = lerp(
				row.values[cornerIndex],
				nextRow.values[cornerIndex],
				t
			);
			var radius = baseRadius + scaleValue(value) * factor;
			var angle = cornerIndex * 2 * Math.PI / sides + yearProgress * twist;
			var x = offset + radius * Math.cos(angle);
			var y = offset + radius * Math.sin(angle);

			z += zd;
			e += ed;
			retArr.push({
				"X": x,
				"Y": y,
				"Z": z,
				"E": e
			});
		}
	}
}

return retArr;
