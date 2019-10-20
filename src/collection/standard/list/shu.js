
const General = require('../../../core/General');
const Gender = require('../../../core/Gender');
const Kingdom = require('../../../core/Kingdom');

const generals = [];

const liubei = new General('liubei', Kingdom.Shu, 4, Gender.Male);
liubei.setEmperor(true);
generals.push(liubei);

const guanyu = new General('guanyu', Kingdom.Shu, 4, Gender.Male);
generals.push(guanyu);

const zhangfei = new General('zhangfei', Kingdom.Shu, 4, Gender.Male);
generals.push(zhangfei);

const zhugeliang = new General('zhugeliang', Kingdom.Shu, 3, Gender.Male);
generals.push(zhugeliang);

const zhaoyun = new General('zhaoyun', Kingdom.Shu, 4, Gender.Male);
generals.push(zhaoyun);

const machao = new General('machao', Kingdom.Shu, 4, Gender.Male);
generals.push(machao);

const huangyueying = new General('huangyueying', Kingdom.Shu, 3, Gender.Female);
generals.push(huangyueying);

module.exports = generals;
