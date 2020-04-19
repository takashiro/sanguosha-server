import GameRule from '../../driver/GameRule';

import PhaseRule from './PhaseRule';
import StrikeEffectRule from './StrikeEffectRule';
import StrikeCountRule from './StrikeCountRule';
import StrikeLimitRule from './StrikeLimitRule';
import TrickEffectRule from './TrickEffectRule';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const rules: (new() => GameRule<any>)[] = [
	PhaseRule,
	StrikeEffectRule,
	StrikeCountRule,
	StrikeLimitRule,
	TrickEffectRule,
];

export default rules;
