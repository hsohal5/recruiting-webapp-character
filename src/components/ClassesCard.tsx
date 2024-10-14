import React, { useState } from 'react';
import { CLASS_LIST } from '../consts';

interface ClassesCardProps {
  meetsClassRequirements: (classAttributes: { [key: string]: number }) => boolean;
}

const ClassesCard: React.FC<ClassesCardProps> = ({ meetsClassRequirements }) => {
  const [selectedClass, setSelectedClass] = useState<string | null>(null);

  const handleClassClick = (className: string) => {
    selectedClass === className ? setSelectedClass('') : setSelectedClass(className);
  };
  return (
    <>
    <div className="classes-card">
      <h2>Classes</h2>
      {Object.entries(CLASS_LIST).map(([className, classAttributes]) => (
        <div onClick={() => handleClassClick(className)} >
          <h3 className={meetsClassRequirements(classAttributes) ? 'min-requirement' : ''}>
            {className}
          </h3>
        </div>
      ))}
    </div>
    {selectedClass && (
      <div className="classes-card">
        <h3>{selectedClass} Minimum Requirements</h3>
        <ul>
          {Object.entries(CLASS_LIST[selectedClass]).map(([class_l, val]) => (
            <div key={class_l}>
              {class_l} : {val.toString()}
            </div>
          ))}
        </ul>
      </div>
      )}
    </>
  );
};

export default ClassesCard;