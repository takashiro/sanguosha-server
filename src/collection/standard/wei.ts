import {
	General,
	Gender,
	Kingdom,
} from '@karuta/sanguosha-core';

import JianXiong from './skill/JianXiong';
import HuJia from './skill/HuJia';
import GuiCai from './skill/GuiCai';
import FanKui from './skill/FanKui';
import GangLie from './skill/GangLie';
import TuXi from './skill/TuXi';
import LuoYi from './skill/LuoYi';
import YiJi from './skill/YiJi';
import TianDu from './skill/TianDu';
import LuoShen from './skill/LuoShen';
import QingGuo from './skill/QingGuo';

const generals: General[] = [];

const caocao = new General('caocao', Kingdom.Wei, 4, Gender.Male);
caocao.setEmperor(true);
caocao.addSkill(JianXiong);
caocao.addSkill(HuJia);
generals.push(caocao);

const simayi = new General('simayi', Kingdom.Wei, 3, Gender.Male);
simayi.addSkill(GuiCai);
simayi.addSkill(FanKui);
generals.push(simayi);

const xiahoudun = new General('xiahoudun', Kingdom.Wei, 4, Gender.Male);
xiahoudun.addSkill(GangLie);
generals.push(xiahoudun);

const zhangliao = new General('zhangliao', Kingdom.Wei, 4, Gender.Male);
zhangliao.addSkill(TuXi);
generals.push(zhangliao);

const xuchu = new General('xuchu', Kingdom.Wei, 4, Gender.Male);
xuchu.addSkill(LuoYi);
generals.push(xuchu);

const guojia = new General('guojia', Kingdom.Wei, 3, Gender.Male);
guojia.addSkill(YiJi);
guojia.addSkill(TianDu);
generals.push(guojia);

const zhenji = new General('zhenji', Kingdom.Wei, 3, Gender.Female);
zhenji.addSkill(LuoShen);
zhenji.addSkill(QingGuo);
generals.push(zhenji);

export default generals;
