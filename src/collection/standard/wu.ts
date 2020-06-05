import {
	General,
	Gender,
	Kingdom,
} from '@karuta/sanguosha-core';

import ZhiHeng from './skill/ZhiHeng';
import JiuYuan from './skill/JiuYuan';
import QiXi from './skill/QiXi';
import KeJi from './skill/KeJi';
import KuRou from './skill/KuRou';
import YingZi from './skill/YingZi';
import FanJian from './skill/FanJian';
import GuoSe from './skill/GuoSe';
import LiuLi from './skill/LiuLi';
import LianYing from './skill/LianYing';
import QianXun from './skill/QianXun';
import XiaoJi from './skill/XiaoJi';
import JieYin from './skill/JieYin';

const generals: General[] = [];

const sunquan = new General('sunquan', Kingdom.Wu, 4, Gender.Male);
sunquan.setEmperor(true);
sunquan.addSkill(ZhiHeng);
sunquan.addSkill(JiuYuan);
generals.push(sunquan);

const ganning = new General('ganning', Kingdom.Wu, 4, Gender.Male);
ganning.addSkill(QiXi);
generals.push(ganning);

const lvmeng = new General('lvmeng', Kingdom.Wu, 4, Gender.Male);
lvmeng.addSkill(KeJi);
generals.push(lvmeng);

const huanggai = new General('huanggai', Kingdom.Wu, 4, Gender.Male);
huanggai.addSkill(KuRou);
generals.push(huanggai);

const zhouyu = new General('zhouyu', Kingdom.Wu, 3, Gender.Male);
zhouyu.addSkill(YingZi);
zhouyu.addSkill(FanJian);
generals.push(zhouyu);

const daqiao = new General('daqiao', Kingdom.Wu, 3, Gender.Female);
daqiao.addSkill(GuoSe);
daqiao.addSkill(LiuLi);
generals.push(daqiao);

const luxun = new General('luxun', Kingdom.Wu, 3, Gender.Male);
luxun.addSkill(LianYing);
luxun.addSkill(QianXun);
generals.push(luxun);

const sunshangxiang = new General('sunshangxiang', Kingdom.Wu, 3, Gender.Female);
sunshangxiang.addSkill(XiaoJi);
sunshangxiang.addSkill(JieYin);
generals.push(sunshangxiang);

export default generals;
