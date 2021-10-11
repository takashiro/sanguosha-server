import GameRule from '../driver/GameRule';

import StandardRules from './standard';

type GameRuleCreator = new() => GameRule<unknown>;

const ModeMap = new Map<string, GameRuleCreator[]>();
ModeMap.set('standard', StandardRules);

export default ModeMap;
