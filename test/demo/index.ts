import { General, Kingdom, Gender } from '@karuta/sanguosha-core';
import { Card, Collection } from '@karuta/sanguosha-pack';

import DummyCard from './DummyCard';

const caopi = new General('CaoPi', Kingdom.Wei, 3, Gender.Male);
const zhenji = new General('ZhenJi', Kingdom.Wei, 3, Gender.Female);
const zhugeliang = new General('ZhugeLiang', Kingdom.Shu, 3, Gender.Male);
const huangyueying = new General('HuangYueying', Kingdom.Shu, 3, Gender.Female);
const zhouyu = new General('ZhouYu', Kingdom.Wu, 3, Gender.Male);
const xiaoqiao = new General('XiaoQiao', Kingdom.Wu, 3, Gender.Female);
const lvbu = new General('LvBu', Kingdom.Qun, 5, Gender.Male);
const diaochan = new General('DiaoChan', Kingdom.Qun, 3, Gender.Female);

class DemoPack extends Collection {
	constructor() {
		super('demo');
	}

	getGenerals(): General[] {
		return [
			caopi,
			zhenji,
			zhugeliang,
			huangyueying,
			zhouyu,
			xiaoqiao,
			lvbu,
			diaochan,
		];
	}

	createCards(): Card[] {
		const cards: Card[] = new Array(100);
		for (let i = 0; i < 100; i++) {
			cards[i] = new DummyCard('dummy', (i % 4) + 1, (i % 13) + 1);
		}
		return cards;
	}
}

export default DemoPack;
