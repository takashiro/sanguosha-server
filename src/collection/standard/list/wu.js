
const General = require('../../../core/General');
const Gender = require('../../../core/Gender');
const Kingdom = require('../../../core/Kingdom');

const generals = [];

const sunquan = new General('sunquan', Kingdom.Wu, 4, Gender.Male);
sunquan.setEmperor(true);
generals.push(sunquan);

const ganning = new General('ganning', Kingdom.Wu, 4, Gender.Male);
generals.push(ganning);

const lvmeng = new General('lvmeng', Kingdom.Wu, 4, Gender.Male);
generals.push(lvmeng);

const huanggai = new General('huanggai', Kingdom.Wu, 4, Gender.Male);
generals.push(huanggai);

const zhouyu = new General('zhouyu', Kingdom.Wu, 3, Gender.Male);
generals.push(zhouyu);

const daqiao = new General('daqiao', Kingdom.Wu, 3, Gender.Female);
generals.push(daqiao);

const luxun = new General('luxun', Kingdom.Wu, 3, Gender.Male);
generals.push(luxun);

const sunshangxiang = new General('sunshangxiang', Kingdom.Wu, 3, Gender.Female);
generals.push(sunshangxiang);

module.exports = generals;
