import {
	General,
	Gender,
	Kingdom,
} from '@karuta/sanguosha-core';

const generals: General[] = [];

const huatuo = new General('huatuo', Kingdom.Qun, 3, Gender.Male);
generals.push(huatuo);

const lvbu = new General('lvbu', Kingdom.Qun, 4, Gender.Male);
generals.push(lvbu);

const diaochan = new General('diaochan', Kingdom.Qun, 3, Gender.Female);
generals.push(diaochan);

export default generals;
