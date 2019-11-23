import React, { useState } from "react";
import "./HeroPicker.css";
import { heroes } from "dotaconstants";
import data from "../../data.json";

const CDN = "http://cdn.dota2.com";

type IDs = (number)[];

type HeroProps = {
  heroId: number;
  onClick?: (id: number) => void;
};

const findHeroById = (id: number) => data.find(hero => hero.hero === id);

const getCounterPick = (selected: (number)[]) => {

  const result = selected.map(heroNumber => {
    const hero = findHeroById(heroNumber);

    if (!hero) {
      throw new Error('Hero not found');
    }

    const top5 = hero.disadvantage.slice(0, 5);

    return top5;
  });

  return result.map((heroes, index) => {
    return (
      <div key={selected[index]}>
        <Hero heroId={selected[index]} />
        <hr />
        { heroes.map(hero => <Hero heroId={hero.id} key={hero.id} />) }
        <br />
      </div>
    )
  });
};

const Hero = ({ heroId, onClick = () => {} }: HeroProps) => (
  <div className="Hero" onClick={() => onClick(heroId)}>
    <img src={CDN + heroes[heroId].img} className="HeroImage" alt="hero" />
    <p className="HeroName">{heroes[heroId].localized_name}</p>
  </div>
);

export const HeroPicker = () => {
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
      {getCounterPick(selected)}
      </div>
      <div className="Ban">Recommended ban:</div>
    </div>
  );
};
