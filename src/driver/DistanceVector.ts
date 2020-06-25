import ServerPlayer from './ServerPlayer';

export default class DistanceVector {
	readonly from: ServerPlayer;

	readonly to: ServerPlayer;

	distance: number;

	constructor(from: ServerPlayer, to: ServerPlayer, distance: number) {
		this.from = from;
		this.to = to;
		this.distance = distance;
	}
}
