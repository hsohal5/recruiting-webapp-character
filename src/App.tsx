import { useState, useEffect } from 'react';
import './App.css';
import { ATTRIBUTE_LIST, SKILL_LIST } from './consts';
import AttributesCard from './components/AttributesCard';
import ClassesCard from './components/ClassesCard';
import SkillsCard from './components/SkillsCard';
const API_URL = "https://recruiting.verylongdomaintotestwith.ca/api/hsohal5/character";

function App() {
  const [attributes, setAttributes] = useState<{ [key: string]: number }>(
    ATTRIBUTE_LIST.reduce((acc, attr) => {
      acc[attr] = 0; // Default value for each attribute (e.g., 10)
      return acc;
    }, {} as { [key: string]: number })
  );
  const [modifiers, setModifiers] = useState({
    Strength: 0,
    Dexterity: 0,
    Constitution: 0,
    Intelligence: 0,
    Wisdom: 0,
    Charisma: 0,
  });
  const [skillPoints, setSkillPoints] = useState(0);
  const [skills, setSkills] = useState<{ [key: string]: number }>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  type Attribute = typeof ATTRIBUTE_LIST[number];
  type Attributes = Record<Attribute, number>;

  // Retrieve character data when app loads
  useEffect(() => {
    retrieveCharacter(); 
  }, []);

  const retrieveCharacter = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      if (data && data.body) {
        setAttributes(data.body.attributes || attributes);
        setSkills(data.body.skills || skills);
      }
    } catch (err) {
      setError("Failed to load character data.");
    } finally {
      setLoading(false);
    }
  };

  const saveCharacter = async () => {
    const characterData = {
      attributes,
      skills,
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(characterData),
      });

      if (!response.ok) {
        throw new Error('Failed to save character data');
      }
      setError('Character saved successfully!');
    } catch (err) {
      setError('Error saving character.');
    }
  };

  // Function to handle increment and decrement of attribute values
  const handleAttributeChange = (attr: string, increment: boolean) => {
    setAttributes((prevAttributes) => {
      const newValue = increment ? prevAttributes[attr] + 1 : prevAttributes[attr] - 1;
      const totalAttributeValue = Object.values({
        ...prevAttributes,
        [attr]: newValue,
       }).reduce((acc, val) => acc + val, 0);

      // Check if total exceeds 70
      if (totalAttributeValue > 70) {
        window.alert("Total attribute value cannot exceed 70!");
        return prevAttributes; // return previous state to prevent the change
      }

      return {
        ...prevAttributes,
        [attr]: newValue,
      };
    });
  };

  // Function to check if a character meets class requirements
  const meetsClassRequirements = (classAttributes: Attributes) => {
    return ATTRIBUTE_LIST.every((attr) => attributes[attr] >= classAttributes[attr]);
  };

  const calculateModifier = (value: number): number => {
    if (value < 10) {
      return Math.floor((value - 10) / 2);
    }
    return Math.floor((value - 10) / 2);
  };

  // update skills modifier
  useEffect(() => {
    const newModifiers = { ...modifiers };
    for (const attr in attributes) {
        newModifiers[attr] = calculateModifier(attributes[attr]);
    }
    setModifiers(newModifiers);

    const intModifier = newModifiers.Intelligence;
    const availablePoints = 10 + (4 * intModifier);
    setSkillPoints(availablePoints);

    const initialSkills = Object.fromEntries(SKILL_LIST.map(skill => [skill.name, 0]));
    setSkills(prevSkills => ({ ...initialSkills, ...prevSkills }));
  }, [attributes]);


  const incrementSkill = (skill: string) => {
    const totalSkills = Object.keys(skills).reduce((total, skill) => {
      return total + skills[skill];
    }, 0);

    if (totalSkills+1 > skillPoints) {
      window.alert(`Total attribute value cannot exceed ${skillPoints}!`);
      return;
    }
    setSkills((prev) => ({
      ...prev,
      [skill]: prev[skill] + 1,
    }));
    
  };

  const decrementSkill = (skill: string) => {
    setSkills((prev) => ({
      ...prev,
      [skill]: Math.max(0, prev[skill] - 1),
    }));
  };
  
  return (
    <div className="App">
      <header className="App-header">
        <h1>React Coding Exercise</h1>
      </header>
      <section className="App-section">
        <button onClick={saveCharacter}>Save Character</button>
        {error && <div className="error-message">{error}</div>}
        {!loading && (
          <div className='card'>
            <AttributesCard
              attributes={attributes}
              handleAttributeChange={handleAttributeChange}
              calculateModifier={calculateModifier}
            />
            <ClassesCard
              meetsClassRequirements={meetsClassRequirements}
            />
            <SkillsCard
              skillPoints={skillPoints}
              skills={skills}
              modifiers={modifiers}
              incrementSkill={incrementSkill}
              decrementSkill={decrementSkill}
            />
          </div>
        )}
      </section>
    </div>
  );
}

export default App;
