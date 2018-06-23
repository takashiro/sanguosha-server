
const General = require('../../core/General');
const Gender = require('../../core/Gender');
const Kingdom = require('../../core/Kingdom');

const generals = [];

let CaoCao = new General('caocao', Kingdom.Wei, 4, Gender.Male);
generals.push(CaoCao);

let CaoPi = new General('caopi', Kingdom.Wei, 3, Gender.Male);
generals.push(CaoPi);

let ZhenJi = new General('zhenji', Kingdom.Wei, 3, Gender.Female);
generals.push(ZhenJi);

let GuoJia = new General('guojia', Kingdom.Wei, 3, Gender.Male);
generals.push(GuoJia);

let SimaYi = new General('simayi', Kingdom.Wei, 3, Gender.Male);
generals.push(SimaYi);

let XunYu = new General('xunyu', Kingdom.Wei, 3, Gender.Male);
generals.push(XunYu);

let XiahouDun = new General('xiahoudun', Kingdom.Wei, 4, Gender.Male);
generals.push(XiahouDun);

let XiahouYuan = new General('xiahouyuan', Kingdom.Wei, 4, Gender.Male);
generals.push(XiahouYuan);

let ZhangHe = new General('zhanghe', Kingdom.Wei, 4, Gender.Male);
generals.push(ZhangHe);

let ZhangLiao = new General('zhangliao', Kingdom.Wei, 4, Gender.Male);
generals.push(ZhangLiao);

let XuHuang = new General('xuhuang', Kingdom.Wei, 4, Gender.Male);
generals.push(XuHuang);

let XuChu = new General('xuchu', Kingdom.Wei, 4, Gender.Male);
generals.push(XuChu);

let DianWei = new General('dianwei', Kingdom.Wei, 4, Gender.Male);
generals.push(DianWei);

let CaoRen = new General('caoren', Kingdom.Wei, 4, Gender.Male);
generals.push(CaoRen);

let YueJin = new General('yuejin', Kingdom.Wei, 4, Gender.Male);
generals.push(YueJin);

module.exports = generals;
