import GameRule from '../../driver/GameRule';

import PhaseRule from './PhaseRule';
import StrikeEffectRule from './StrikeEffectRule';
import StrikeCountRule from './StrikeCountRule';
import StrikeLimitRule from './StrikeLimitRule';
import TrickEffectRule from './TrickEffectRule';

const rules: (new() => GameRule<unknown>)[] = [
	PhaseRule,
	StrikeEffectRule,
	StrikeCountRule,
	StrikeLimitRule,
	TrickEffectRule,
];

export default rules;
