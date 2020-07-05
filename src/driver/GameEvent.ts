
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

	CalculatingDistance, // 计算距离时

	BeforeStartingDamage, // 伤害结算开始前
	StartingDamage, // 伤害结算开始时
	Damaging, // 造成伤害时
	Damaged, // 受到伤害时
	AfterDamaging, // 造成伤害后
	AfterDamaged, // 受到伤害后
	EndingDamage, // 伤害结算结束时
	AfterEndingDamage, // 伤害结算结束后
}

export default GameEvent;
