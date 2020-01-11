
const General = require('../../../core/General');
const Gender = require('../../../core/Gender');
const Kingdom = require('../../../core/Kingdom');

const generals = [];

const caocao = new General('caocao', Kingdom.Wei, 4, Gender.Male);
caocao.setEmperor(true);
generals.push(caocao);

const simayi = new General('simayi', Kingdom.Wei, 3, Gender.Male);
generals.push(simayi);

const xiahoudun = new General('xiahoudun', Kingdom.Wei, 4, Gender.Male);
generals.push(xiahoudun);

const zhangliao = new General('zhangliao', Kingdom.Wei, 4, Gender.Male);
generals.push(zhangliao);

const xuchu = new General('xuchu', Kingdom.Wei, 4, Gender.Male);
generals.push(xuchu);

const guojia = new General('guojia', Kingdom.Wei, 3, Gender.Male);
generals.push(guojia);

const zhenji = new General('zhenji', Kingdom.Wei, 3, Gender.Female);
generals.push(zhenji);

module.exports = generals;
