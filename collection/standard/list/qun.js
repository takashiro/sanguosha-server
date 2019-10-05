
const General = require('../../../core/General');
const Gender = require('../../../core/Gender');
const Kingdom = require('../../../core/Kingdom');

const generals = [];

const huatuo = new General('huatuo', Kingdom.Qun, 3, Gender.Male);
generals.push(huatuo);

const lvbu = new General('lvbu', Kingdom.Qun, 4, Gender.Male);
generals.push(lvbu);

const diaochan = new General('diaochan', Kingdom.Qun, 3, Gender.Female);
generals.push(diaochan);

module.exports = generals;
