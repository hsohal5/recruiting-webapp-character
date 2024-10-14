import React from 'react';
import { SKILL_LIST } from '../consts';

interface SkillsCardProps {
  skillPoints: number;
  skills: { [key: string]: number };
  modifiers: { [key: string]: number };
  incrementSkill: (skill: string) => void;
  decrementSkill: (skill: string) => void;
}

const SkillsCard: React.FC<SkillsCardProps> = ({
  skillPoints,
  skills,
  modifiers,
  incrementSkill,
  decrementSkill
}) => {

  return (
    <div className="skills-card">
      <h2>Skills</h2>
      <div>Total Skill Points Available: {skillPoints}</div>
      {SKILL_LIST.map(({ name, attributeModifier }) => {
        const modifier = modifiers[attributeModifier];
        const pointsSpent = skills[name];
        const totalSkillValue = pointsSpent + modifier;

        return (
          <div key={name}>
            <span>{name}: {pointsSpent} (Modifier {attributeModifier}): {modifier}</span>
            <button onClick={() => incrementSkill(name)}>+</button>
            <button onClick={() => decrementSkill(name)}>-</button>
            <span>Total: {totalSkillValue}</span>
          </div>
        );
      })}
    </div>
  );
};

export default SkillsCard;
