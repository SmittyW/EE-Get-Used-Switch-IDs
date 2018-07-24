function convertToRanges(array) {

	if (array[0] !== undefined) {
		var text = array[0].toString();

		var lastNum = array[0];
		var curNum = array[0];
		for (var i = 1; i < array.length; i++) {
			if (array[i] - curNum !== 1) {
				if (array[i - 1] !== lastNum) text += `-${array[i-1]}`;
				text += `, ${array[i]}`;
				lastNum = array[i];
			}
			curNum = array[i];
		}
		if (array[array.length - 1] !== lastNum) text += `-${array[i-1]}`;
		return text;
	}
	return "none";
}

function callbackError(error) {
	console.log("error: " + error);
	$('input').prop('disabled', false);
}

$("document").ready(function() {

	$("#login").submit(function(e) {
		e.preventDefault();
		$('input').prop('disabled', true);
		PlayerIO.useSecureApiRequests = true;

		PlayerIO.authenticate("everybody-edits-su9rn58o40itdbnw69plyw", "public", {
			userId: "user"
		}, {}, client => {
			client.multiplayer.useSecureConnections = true;
			var roomID = $("#roomID").val();
			client.bigDB.load("worlds", roomID, dbObj => {
				if (dbObj !== null) {
					let purple = [];
					let orange = [];

					let worldData = dbObj["worlddata"];
					for (var k in worldData) {
						var type = worldData[k]["type"];
						if (type == 113) {
							let goal = worldData[k]["goal"];
							if (purple.indexOf(goal) === -1) purple.push(goal);
						} else if (type == 467) {
							let goal = worldData[k]["goal"];
							if (orange.indexOf(goal) === -1) orange.push(goal);
						}
					}

					purple.sort((a, b) => a - b);
					orange.sort((a, b) => a - b);

					$('#purpleText').val(convertToRanges(purple));
					$('#orangeText').val(convertToRanges(orange));
					$('input').prop('disabled', false);
				} else callbackError("Room doesn't exist!");
			}, callbackError);
		}, callbackError);
	});
});