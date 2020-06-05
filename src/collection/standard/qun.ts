import {
	General,
	Gender,
	Kingdom,
} from '@karuta/sanguosha-core';

import QingNang from './skill/QingNang';
import JiJiu from './skill/JiJiu';
import WuShuang from './skill/WuShuang';
import LiJian from './skill/LiJian';
import BiYue from './skill/BiYue';

const generals: General[] = [];

const huatuo = new General('huatuo', Kingdom.Qun, 3, Gender.Male);
huatuo.addSkill(JiJiu);
huatuo.addSkill(QingNang);
generals.push(huatuo);

const lvbu = new General('lvbu', Kingdom.Qun, 4, Gender.Male);
lvbu.addSkill(WuShuang);
generals.push(lvbu);

const diaochan = new General('diaochan', Kingdom.Qun, 3, Gender.Female);
diaochan.addSkill(LiJian);
diaochan.addSkill(BiYue);
generals.push(diaochan);

export default generals;
