var sides = 0;
var e = 0;
var ed = 1;
var baseRadius = 60;
var maxRadiusDelta = baseRadius * 0.12;
var expectedChangeRange = 14;
var offset = 255 / 2;
var twist = 0.06;
var layersPerYear = 20;
var layerHeight = 0.5;
var retArr = [];

function splitCsvLine(line) {
	var values = [];
	var current = '';
	var inQuotes = false;

	for (var i = 0; i < line.length; i++) {
		var char = line[i];
		if (char === '"') {
			inQuotes = !inQuotes;
			continue;
		}
		if (char === ',' && !inQuotes) {
			values.push(current.trim());
			current = '';
			continue;
		}
		current += char;
	}

	values.push(current.trim());
	return values;
}

function parseChangeTable(text) {
	var excludedAreas = {
		'District of Columbia': true,
		'Puerto Rico': true,
		'United States': true,
		'United States1': true,
		'Northeast Region': true,
		'Midwest Region': true,
		'South Region': true,
		'West Region': true
	};
	var lines = text.trim().split('\n');
	var headerParts = splitCsvLine(lines[4]);
	var percentChangeColumns = headerParts
		.map(function (header, index) {
			var match = header.match(/^Percent Change (\d{4}) Census$/);
			return match ? { year: match[1], index: index } : null;
		})
		.filter(Boolean);
	var stateRows = lines
		.slice(5)
		.map(splitCsvLine)
		.filter(function (parts) {
			return (
				parts.length >= 27 &&
				parts[0] &&
				!excludedAreas[parts[0]] &&
				!/^\d/.test(parts[0]) &&
				parts[0].indexOf('Note:') !== 0 &&
				parts[0].indexOf('Page ') !== 0 &&
				parts[0].indexOf('Includes the resident population') === -1
			);
		})
		.map(function (parts) {
			var changesByYear = {};
			for (var i = 0; i < percentChangeColumns.length; i++) {
				var yearColumn = percentChangeColumns[i];
				changesByYear[yearColumn.year] = parseFloat(parts[yearColumn.index]) || 0;
			}
			return {
				state: parts[0],
				changesByYear: changesByYear
			};
		});

	return percentChangeColumns
		.slice()
		.reverse()
		.map(function (yearColumn) {
			return {
				year: yearColumn.year,
				values: stateRows.map(function (stateRow) {
					return stateRow.changesByYear[yearColumn.year];
				})
			};
		});
}

function lerp(start, end, t) {
	return start + (end - start) * t;
}

function clamp(value, min, max) {
	return Math.max(min, Math.min(max, value));
}

var rows = parseChangeTable(data);
sides = rows[0].values.length;

for (var rowIndex = 0; rowIndex < rows.length; rowIndex++) {
	var row = rows[rowIndex];
	var nextRow = rows[rowIndex + 1] || row;

	for (var layerIndex = 0; layerIndex < layersPerYear; layerIndex++) {
		var t = layersPerYear === 1 ? 0 : layerIndex / (layersPerYear - 1);
		var yearProgress = rowIndex + t;
		var z = (rowIndex * layersPerYear + layerIndex) * layerHeight;

		for (var cornerIndex = 0; cornerIndex < sides; cornerIndex++) {
			var value = lerp(
				row.values[cornerIndex],
				nextRow.values[cornerIndex],
				t
			);
			var radiusDelta = clamp(value, -expectedChangeRange, expectedChangeRange) / expectedChangeRange * maxRadiusDelta;
			var radius = baseRadius + radiusDelta;
			var angle = cornerIndex * 2 * Math.PI / sides + yearProgress * twist;
			var x = offset + radius * Math.cos(angle);
			var y = offset + radius * Math.sin(angle);

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
