
const General = require('../../core/General');
const Gender = require('../../core/Gender');
const Kingdom = require('../../core/Kingdom');

const generals = [];

let MaTeng = new General('mateng', Kingdom.Qun, 4, Gender.Male);
generals.push(MaTeng);

let KongRong = new General('kongrong', Kingdom.Qun, 3, Gender.Male);
generals.push(KongRong);

let ZouShi = new General('zoushi', Kingdom.Qun, 3, Gender.Male);
generals.push(ZouShi);

let TianFeng = new General('tianfeng', Kingdom.Qun, 3, Gender.Male);
generals.push(TianFeng);

let JiLing = new General('jiling', Kingdom.Qun, 4, Gender.Male);
generals.push(JiLing);

let PanFeng = new General('panfeng', Kingdom.Qun, 4, Gender.Male);
generals.push(PanFeng);

let LvBu = new General('lvbu', Kingdom.Qun, 4, Gender.Male);
generals.push(LvBu);

let DiaoChan = new General('diaochan', Kingdom.Qun, 3, Gender.Female);
generals.push(DiaoChan);

let ZhangJiao = new General('zhangjiao', Kingdom.Qun, 3, Gender.Male);
generals.push(ZhangJiao);

let YuanShao = new General('yuanshao', Kingdom.Qun, 4, Gender.Male);
generals.push(YuanShao);

let YanLiangWenChou = new General('yanliangwenchou', Kingdom.Qun, 4, Gender.Male);
generals.push(YanLiangWenChou);

let JiaXu = new General('jiaxu', Kingdom.Qun, 3, Gender.Male);
generals.push(JiaXu);

let CaiWenji = new General('caiwenji', Kingdom.Qun, 3, Gender.Female);
generals.push(CaiWenji);

let HuaTuo = new General('huatuo', Kingdom.Qun, 3, Gender.Male);
generals.push(HuaTuo);

let PangDe = new General('pangde', Kingdom.Qun, 4, Gender.Male);
generals.push(PangDe);

module.exports = generals;
