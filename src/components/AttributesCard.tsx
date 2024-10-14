import React from "react";
import { ATTRIBUTE_LIST } from '../consts';

interface AttributesCardProps {
    attributes: { [key: string]: number };
    handleAttributeChange: (attr: string, increment: boolean) => void;
    calculateModifier: (value: number) => number;
}
const AttributesCard: React.FC<AttributesCardProps> = ({ attributes, calculateModifier, handleAttributeChange }) => {
    return (
      <div className="attribute-card">
        <h2>Attributes</h2>
        {ATTRIBUTE_LIST.map((attr) => (
          <div key={attr} style={{ margin: '10px 0' }}>
            <span>{attr}: {attributes[attr]} (Modifier: {calculateModifier(attributes[attr])})</span>
            <button onClick={() => handleAttributeChange(attr, true)}>+</button>
            <button onClick={() => handleAttributeChange(attr, false)}>-</button>
          </div>
        ))}
      </div>
    );
  };
  
export default AttributesCard;
  