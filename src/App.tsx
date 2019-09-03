import React, { useState } from "react";
import "./App.css";
import { heroes } from "dotaconstants";
import data from "./data.json";

const CDN = "http://cdn.dota2.com/";

type IDs = (string | number)[];

type HeroProps = {
  heroId: string | number;
  onClick: (id: string | number) => void;
};

const getCounterPick = (selected: (string | number)[]) => {
  const heroScore = Object.keys(heroes).reduce(
    (res, key) => {
      res[key] = 0;
      return res;
    },
    {} as any
  );

   return selected.reduce((score, heroId) => {
    const disadvantage = (data.find(
      item => item.hero.toString() === heroId
    ) as any).disadvantage;

    return disadvantage.map(
      ({ id, performance }: { id: string; performance: string }) => {
        score[id] += parseFloat(performance);

        return score;
      }
    );
  }, heroScore);
};

const Hero = ({ heroId, onClick }: HeroProps) => (
  <div className="Hero" onClick={() => onClick(heroId)}>
    <img src={CDN + heroes[heroId].img} className="HeroImage" alt="hero" />
    <p className="HeroName">{heroes[heroId].localized_name}</p>
  </div>
);

const App: React.FC = () => {
  const [selected, selectHeroes] = useState([] as IDs);

  return (
    <div className="App">
      <div className="HeroList">
        Choose enemy:
        {Object.values(heroes)
          .filter(({ id }) => !selected.includes(id))
          .map(({ id }) => (
            <Hero
              key={id}
              heroId={id}
              onClick={id => {
                selectHeroes([...selected, id]);
              }}
            />
          ))}
      </div>
      <div className="EnemyPick">
        Enemy pick:
        {selected.map(id => (
          <Hero
            key={id}
            heroId={id}
            onClick={deleteId => {
              selectHeroes(selected.filter(id => id !== deleteId));
            }}
          />
        ))}
      </div>
      <div className="RecommendedPick">Recommended pick:
      { Object.entries(getCounterPick(selected)) }
      </div>
      <div className="Ban">Recommended ban:</div>
    </div>
  );
};

export default App;
