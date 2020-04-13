
const enum GameEvent {
	Invalid,

	StartingGame,
	EndingGame,

	StartingPhase,
	ProceedingPhase,
	EndingPhase,

	DrawingNCards,

	CheckingCardConstraint,
	SelectingCardTargets, // 选择目标时
	UsingCard, // 使用牌时
	ConfirmingCardTargets, // 指定目标时
	BeingCardTargets, // 成为目标时
	AfterConfirmingCardTargets, // 指定目标后
	AfterBeingCardTargets, // 成为目标后
	PreparingCardEffect, // 使用结算开始时
	BeforeTakingCardEffect, // 生效前
	TakingCardEffect, // 生效时
	AfterUsingCard, // 使用结算结束后

	BeforeMovingCards,
	AfterMovingCards,

	Judging, // 判定时
	BeforeIssuingJudgement, // 判定生效前
	AfterIssuingJudgement, // 判定生效后
}

export default GameEvent;
