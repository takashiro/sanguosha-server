import {
	General,
	Gender,
	Kingdom,
} from '@karuta/sanguosha-core';

const generals: General[] = [];

const SunQuan = new General('sunquan', Kingdom.Wu, 4, Gender.Male);
generals.push(SunQuan);

const SunShangxiang = new General('sunshangxiang', Kingdom.Wu, 3, Gender.Female);
generals.push(SunShangxiang);

const ZhouYu = new General('zhouyu', Kingdom.Wu, 3, Gender.Male);
generals.push(ZhouYu);

const XiaoQiao = new General('xiaoqiao', Kingdom.Wu, 3, Gender.Female);
generals.push(XiaoQiao);

const DaQiao = new General('daqiao', Kingdom.Wu, 3, Gender.Female);
generals.push(DaQiao);

const LuXun = new General('luxun', Kingdom.Wu, 3, Gender.Male);
generals.push(LuXun);

const LuSu = new General('lusu', Kingdom.Wu, 3, Gender.Male);
generals.push(LuSu);

const SunJian = new General('sunjian', Kingdom.Wu, 4, Gender.Male);
generals.push(SunJian);

const TaishiCi = new General('taishici', Kingdom.Wu, 4, Gender.Male);
generals.push(TaishiCi);

const GanNing = new General('ganning', Kingdom.Wu, 4, Gender.Male);
generals.push(GanNing);

const HuangGai = new General('huanggai', Kingdom.Wu, 4, Gender.Male);
generals.push(HuangGai);

const DingFeng = new General('dingfeng', Kingdom.Wu, 4, Gender.Male);
generals.push(DingFeng);

const LvMeng = new General('lvmeng', Kingdom.Wu, 4, Gender.Male);
generals.push(LvMeng);

const ZhouTai = new General('zhoutai', Kingdom.Wu, 4, Gender.Male);
generals.push(ZhouTai);

const ZhangZhaoZhangHong = new General('zhangzhaozhanghong', Kingdom.Wu, 3, Gender.Male);
generals.push(ZhangZhaoZhangHong);

export default generals;
