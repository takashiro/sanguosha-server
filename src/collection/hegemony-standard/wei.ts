import {
	General,
	Gender,
	Kingdom,
} from '@karuta/sanguosha-core';

const generals: General[] = [];

const CaoCao = new General('caocao', Kingdom.Wei, 4, Gender.Male);
generals.push(CaoCao);

const CaoPi = new General('caopi', Kingdom.Wei, 3, Gender.Male);
generals.push(CaoPi);

const ZhenJi = new General('zhenji', Kingdom.Wei, 3, Gender.Female);
generals.push(ZhenJi);

const GuoJia = new General('guojia', Kingdom.Wei, 3, Gender.Male);
generals.push(GuoJia);

const SimaYi = new General('simayi', Kingdom.Wei, 3, Gender.Male);
generals.push(SimaYi);

const XunYu = new General('xunyu', Kingdom.Wei, 3, Gender.Male);
generals.push(XunYu);

const XiahouDun = new General('xiahoudun', Kingdom.Wei, 4, Gender.Male);
generals.push(XiahouDun);

const XiahouYuan = new General('xiahouyuan', Kingdom.Wei, 4, Gender.Male);
generals.push(XiahouYuan);

const ZhangHe = new General('zhanghe', Kingdom.Wei, 4, Gender.Male);
generals.push(ZhangHe);

const ZhangLiao = new General('zhangliao', Kingdom.Wei, 4, Gender.Male);
generals.push(ZhangLiao);

const XuHuang = new General('xuhuang', Kingdom.Wei, 4, Gender.Male);
generals.push(XuHuang);

const XuChu = new General('xuchu', Kingdom.Wei, 4, Gender.Male);
generals.push(XuChu);

const DianWei = new General('dianwei', Kingdom.Wei, 4, Gender.Male);
generals.push(DianWei);

const CaoRen = new General('caoren', Kingdom.Wei, 4, Gender.Male);
generals.push(CaoRen);

const YueJin = new General('yuejin', Kingdom.Wei, 4, Gender.Male);
generals.push(YueJin);

export default generals;
