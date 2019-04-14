
const Enum = require('./Enum');

const cmd = new Enum(
	'Invalid',

	'StartGame',
	'ArrangeSeats',
	'ChooseGeneral',
	'UpdatePlayer',
	'ToBattle',
	'MoveCards',
);

module.exports = cmd;
