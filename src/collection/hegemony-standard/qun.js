
const General = require('../../core/General');
const Gender = require('../../core/Gender');
const Kingdom = require('../../core/Kingdom');

const generals = [];

const MaTeng = new General('mateng', Kingdom.Qun, 4, Gender.Male);
generals.push(MaTeng);

const KongRong = new General('kongrong', Kingdom.Qun, 3, Gender.Male);
generals.push(KongRong);

const ZouShi = new General('zoushi', Kingdom.Qun, 3, Gender.Male);
generals.push(ZouShi);

const TianFeng = new General('tianfeng', Kingdom.Qun, 3, Gender.Male);
generals.push(TianFeng);

const JiLing = new General('jiling', Kingdom.Qun, 4, Gender.Male);
generals.push(JiLing);

const PanFeng = new General('panfeng', Kingdom.Qun, 4, Gender.Male);
generals.push(PanFeng);

const LvBu = new General('lvbu', Kingdom.Qun, 4, Gender.Male);
generals.push(LvBu);

const DiaoChan = new General('diaochan', Kingdom.Qun, 3, Gender.Female);
generals.push(DiaoChan);

const ZhangJiao = new General('zhangjiao', Kingdom.Qun, 3, Gender.Male);
generals.push(ZhangJiao);

const YuanShao = new General('yuanshao', Kingdom.Qun, 4, Gender.Male);
generals.push(YuanShao);

const YanLiangWenChou = new General('yanliangwenchou', Kingdom.Qun, 4, Gender.Male);
generals.push(YanLiangWenChou);

const JiaXu = new General('jiaxu', Kingdom.Qun, 3, Gender.Male);
generals.push(JiaXu);

const CaiWenji = new General('caiwenji', Kingdom.Qun, 3, Gender.Female);
generals.push(CaiWenji);

const HuaTuo = new General('huatuo', Kingdom.Qun, 3, Gender.Male);
generals.push(HuaTuo);

const PangDe = new General('pangde', Kingdom.Qun, 4, Gender.Male);
generals.push(PangDe);

module.exports = generals;
