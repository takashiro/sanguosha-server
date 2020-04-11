
const enum GameEvent {
	Invalid,

	StartingGame,
	EndingGame,

	StartingPhase,
	ProceedingPhase,
	EndingPhase,

	DrawingNCards,

	CheckingCardConstraint,
	SelectingCardTargets,
	TakingCardEffect,

	BeforeMovingCards,
	AfterMovingCards,
}

export default GameEvent;
