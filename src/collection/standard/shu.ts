import {
	General,
	Gender,
	Kingdom,
} from '@karuta/sanguosha-core';

import RenDe from './skill/RenDe';
import JiJiang from './skill/JiJiang';
import WuSheng from './skill/WuSheng';
import PaoXiao from './skill/PaoXiao';
import GuanXing from './skill/GuanXing';
import KongCheng from './skill/KongCheng';
import LongDan from './skill/LongDan';
import TieQi from './skill/TieQi';
import MaShu from './skill/MaShu';
import JiZhi from './skill/Jizhi';
import QiCai from './skill/QiCai';

const generals: General[] = [];

const liubei = new General('liubei', Kingdom.Shu, 4, Gender.Male);
liubei.setEmperor(true);
liubei.addSkill(RenDe);
liubei.addSkill(JiJiang);
generals.push(liubei);

const guanyu = new General('guanyu', Kingdom.Shu, 4, Gender.Male);
guanyu.addSkill(WuSheng);
generals.push(guanyu);

const zhangfei = new General('zhangfei', Kingdom.Shu, 4, Gender.Male);
zhangfei.addSkill(PaoXiao);
generals.push(zhangfei);

const zhugeliang = new General('zhugeliang', Kingdom.Shu, 3, Gender.Male);
zhugeliang.addSkill(GuanXing);
zhugeliang.addSkill(KongCheng);
generals.push(zhugeliang);

const zhaoyun = new General('zhaoyun', Kingdom.Shu, 4, Gender.Male);
zhaoyun.addSkill(LongDan);
generals.push(zhaoyun);

const machao = new General('machao', Kingdom.Shu, 4, Gender.Male);
machao.addSkill(TieQi);
machao.addSkill(MaShu);
generals.push(machao);

const huangyueying = new General('huangyueying', Kingdom.Shu, 3, Gender.Female);
huangyueying.addSkill(JiZhi);
huangyueying.addSkill(QiCai);
generals.push(huangyueying);

export default generals;
