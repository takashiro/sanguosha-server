import { Method } from '@karuta/core';
import {
	PlayerPhase as Phase,
	SkillAreaType,
	General,
	Context,
} from '@karuta/sanguosha-core';

import {
	EventType as GameEvent,
	Player,
	PhaseChange,
} from '@karuta/sanguosha-pack';

import GameRule from '../../driver/GameRule';
import ServerPlayer from '../../driver/ServerPlayer';
import delay from '../../util/delay';

class BasicRule extends GameRule<void> {
	constructor() {
		super(GameEvent.StartingGame);
	}

	preparePlayers(): void {
		const driver = this.getDriver();
		const config = driver.getConfig();

		const users = driver.getUsers();
		const players = users.map((user) => new ServerPlayer(user));
		for (const player of players) {
			player.setRequestTimeout(config.requestTimeout);
		}
		driver.setPlayers(players);
	}

	prepareSeats(): void {
		const driver = this.getDriver();
		const players = driver.getPlayers();

		let seat = 1;
		for (const player of players) {
			player.setSeat(seat);
			seat++;
		}

		const room = driver.getRoom();
		room.broadcast(Method.Put, Context.Players, players.map((player) => ({
			uid: player.getId(),
			seat: player.getSeat(),
			name: player.getName(),
		})));
	}

	async prepareCards(): Promise<void> {
		const driver = this.getDriver();
		driver.prepareDrawPile();

		for (const player of driver.getPlayers()) {
			await driver.drawCards(player, 4);
		}
	}

	prepareSkills(): void {
		const driver = this.getDriver();
		for (const player of driver.getPlayers()) {
			const headGeneral = player.getHeadGeneral();
			if (headGeneral) {
				this.addGeneralSkills(player, headGeneral, SkillAreaType.Head);
			}
			const deputyGeneral = player.getDeputyGeneral();
			if (deputyGeneral) {
				this.addGeneralSkills(player, deputyGeneral, SkillAreaType.Deputy);
			}
		}
	}

	addGeneralSkills(player: Player, general: General, areaType: SkillAreaType): void {
		const driver = this.getDriver();
		for (const Skill of general.getSkills()) {
			const skill = new Skill(player);
			driver.addSkill(player, skill, areaType);
		}
	}

	async activatePlayer(player: Player): Promise<void> {
		const phases = [
			Phase.Start,
			Phase.Judge,
			Phase.Draw,
			Phase.Play,
			Phase.Discard,
			Phase.End,
		];

		const driver = this.getDriver();
		driver.setCurrentPlayer(player);

		player.setRound(player.getRound() + 1);
		player.setPhases(phases);
		for (let i = 0; i < phases.length; i++) {
			const phase = phases[i];

			const data = new PhaseChange(player, player.getPhase(), phase);
			if (await driver.trigger(GameEvent.ChangingPhase, data)) {
				continue;
			}

			player.setPhase(data.to);
			player.broadcastProperty('phase', data.to);

			await driver.trigger(GameEvent.StartingPhase, data);
			await driver.trigger(GameEvent.ProceedingPhase, data);
			await driver.trigger(GameEvent.EndingPhase, data);

			await delay(this.idle);
		}

		player.setPhase(Phase.Inactive);
		player.broadcastProperty('phase', Phase.Inactive);

		driver.setCurrentPlayer();
	}

	prepareBattleField(): void {
		const driver = this.getDriver();
		const room = driver.getRoom();
		room.broadcast(Method.Post, Context.Game);
	}

	async proceed(): Promise<void> {
		const driver = this.getDriver();
		let i = 0;
		const players = driver.getPlayers();
		while (driver.isRunning()) {
			const player = players[i];
			await this.activatePlayer(player);

			i++;
			if (i >= players.length) {
				i = 0;
			}
		}
	}
}

export default BasicRule;
