import {
	General,
	PlayerRole as Role,
} from '@karuta/sanguosha-core';

import { Player } from '@karuta/sanguosha-pack';

import BasicRule from '../basic/BasicRule';

import shuffle from '../../util/shuffle';
import randsub from '../../util/randsub';

function fillArray<Element>(arr: Element[], value: Element, n: number): void {
	for (let i = 0; i < n; i++) {
		arr.push(value);
	}
}

class StandardRule extends BasicRule {
	private candidateGeneralNum = 3;

	async process(): Promise<boolean> {
		this.preparePlayers();
		this.prepareRoles();
		this.prepareSeats();
		await this.prepareGenerals();
		this.prepareSkills();
		this.prepareBattleField();
		await this.prepareCards();
		this.proceed();
		return false;
	}

	prepareRoles(): void {
		const driver = this.getDriver();
		const players = driver.getPlayers();
		if (!players || players.length <= 1) {
			return;
		}
		shuffle(players);

		const rebelNum = Math.floor(players.length / 2);
		let loyalistNum = players.length - rebelNum - 1;
		let renegadeNum = 0;
		if (loyalistNum > 1) {
			renegadeNum++;
			loyalistNum--;
		}

		const roles: Role[] = [];
		fillArray(roles, Role.Rebel, rebelNum);
		fillArray(roles, Role.Loyalist, loyalistNum);
		fillArray(roles, Role.Renegade, renegadeNum);
		shuffle(roles);
		roles.unshift(Role.Emperor);

		for (let i = 0; i < roles.length; i++) {
			players[i].setRole(roles[i]);
			players[i].updateProperty('role', roles[i]);
		}
	}

	async prepareGenerals(): Promise<void> {
		const driver = this.getDriver();

		const { packs } = driver.getConfig();
		if (packs) {
			for (const pack of packs) {
				await driver.loadCollection(pack);
			}
		}

		const generals = driver.getGenerals();
		if (generals.length <= 0) {
			return;
		}

		// Set up the Emperor first
		const players = driver.getPlayers();
		const emperor = players.find((player) => player.getRole() === Role.Emperor);
		if (!emperor) {
			return;
		}

		const emperorGeneral = await this.prepareEmperor(emperor, generals);
		emperor.setKingdom(emperorGeneral.getKingdom());
		emperor.broadcastProperty('kingdom', emperor.getKingdom());
		emperor.broadcastProperty('general', emperorGeneral.toJSON());

		// Remove the Emperor's general from the candidate list
		for (let i = 0; i < generals.length; i++) {
			if (generals[i] === emperorGeneral) {
				generals.splice(i, 1);
				break;
			}
		}

		const maxGeneralNum = Math.floor(generals.length / players.length);
		if (this.candidateGeneralNum > maxGeneralNum) {
			this.candidateGeneralNum = maxGeneralNum;
		}

		// Shuffle and set up others' generals
		shuffle(generals);
		const others = players.filter((player) => player.getRole() !== Role.Emperor);
		await Promise.all(others.map((player) => this.prepareGeneral(player, generals)));
		for (const player of others) {
			const general = player.getGeneral();
			if (general) {
				player.setKingdom(general.getKingdom());
				player.broadcastProperty('kingdom', player.getKingdom());
				player.broadcastProperty('general', general.toJSON());
			}
		}
	}

	async prepareEmperor(player: Player, generals: General[]): Promise<General> {
		const candidates = generals.filter((general) => general.isEmperor());

		const others = generals.filter((general) => !general.isEmperor());
		candidates.push(...randsub(others, 2));

		const [general] = await player.askForGeneral(candidates, { num: 1 });
		player.setGeneral(general);

		const hp = general.getMaxHp() + 1;
		player.setMaxHp(hp);
		player.setHp(hp);
		player.broadcastProperty('maxHp', hp);
		player.broadcastProperty('hp', hp);

		return general;
	}

	async prepareGeneral(player: Player, generals: General[]): Promise<void> {
		const offset = this.candidateGeneralNum * (player.getSeat() - 2);
		const candidates = generals.slice(offset, offset + this.candidateGeneralNum);

		const [general] = await player.askForGeneral(candidates, { num: 1 });
		player.setGeneral(general);

		const hp = general.getMaxHp();
		player.setMaxHp(hp);
		player.setHp(hp);
		player.broadcastProperty('maxHp', hp);
		player.broadcastProperty('hp', hp);
	}
}

export default StandardRule;
