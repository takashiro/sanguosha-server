
const General = require('../../core/General');
const Gender = require('../../core/Gender');
const Kingdom = require('../../core/Kingdom');

const generals = [];

let LiuBei = new General('liubei', Kingdom.Shu, 4, Gender.Male);
generals.push(LiuBei);

let GanFuren = new General('ganfuren', Kingdom.Shu, 3, Gender.Female);
generals.push(GanFuren);

let ZhugeLiang = new General('zhugeliang', Kingdom.Shu, 3, Gender.Male);
generals.push(ZhugeLiang);

let HuangYueying = new General('huangyueying', Kingdom.Shu, 3, Gender.Female);
generals.push(HuangYueying);

let Wolong = new General('wolong', Kingdom.Shu, 3, Gender.Male);
generals.push(Wolong);

let PangTong = new General('pangtong', Kingdom.Shu, 3, Gender.Male);
generals.push(PangTong);

let GuanYu = new General('guanyu', Kingdom.Shu, 4, Gender.Male);
generals.push(GuanYu);

let ZhangFei = new General('zhangfei', Kingdom.Shu, 4, Gender.Male);
generals.push(ZhangFei);

let ZhaoYun = new General('zhaoyun', Kingdom.Shu, 4, Gender.Male);
generals.push(ZhaoYun);

let MaChao = new General('machao', Kingdom.Shu, 4, Gender.Male);
generals.push(MaChao);

let HuangZhong = new General('huangzhong', Kingdom.Shu, 4, Gender.Male);
generals.push(HuangZhong);

let WeiYan = new General('weiyan', Kingdom.Shu, 4, Gender.Male);
generals.push(WeiYan);

let LiuShan = new General('liushan', Kingdom.Shu, 3, Gender.Male);
generals.push(LiuShan);

let MengHuo = new General('menghuo', Kingdom.Shu, 4, Gender.Male);
generals.push(MengHuo);

let ZhuRong = new General('zhurong', Kingdom.Shu, 4, Gender.Female);
generals.push(ZhuRong);

module.exports = generals;
