const heroes = require("dotaconstants").heroes;
const request = require("request-promise");
const parse = require("cheerio").load;
const fs = require("fs");

const ROOT = "https://dotabuff.com/heroes";
const selector =
  "body > div.container-outer.seemsgood > div.container-inner.container-inner-content > div.content-inner > section:nth-child(4) > article > table > tbody > tr";
const findHeroByName = name =>
  Object.values(heroes).find(({ localized_name }) => name === localized_name);
const HEROES_COUNT = Object.keys(heroes).length;
const MAX_STEPS = HEROES_COUNT;
const START = 0;
let counter = 0;

const timeout = fn => new Promise((res) => {
  setTimeout(() => {
    fn().then(res);
  }, 2000);
})

const getData = index => {
  return new Promise(res => {
    const promises = Object.values(heroes)
      .slice(index, index + 1)
      .map(item => {
        const url =
          ROOT +
          "/" +
          item.localized_name.toLocaleLowerCase().replace(/\s/g, "-").replace('\'', '') +
          "/counters";
        const options = {
          url,
          headers: {
            "user-agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36",
            cookie:
              "_ga=GA1.2.1447628245.1534690541; __qca=P0-1897421190-1534690541555; _ats=1542585905; _player_token=c03055fdddea174b6e47a8cf7ac8e06014806ae79e40f246179ef04b1c9a7v01; _player_id=322733294; _tz=Europe%2FMoscow; _s=cXJPZytaVTdWdzdadlgxRnB5Z0VlTmNETndnd0pZRTZiN09Od0U3aU1FRTRrejNsM3lqN2lMcTlWRTZEMy9XR1V2MmlDUHpmME0rcGgzNW42K0s0eWRzakJzaVRiQ2dORTByK0VNWFZwVmQvTXNna1lGaUtCZmpwQnlvNE9zWDM4eWxicXpUS1JFb3FsaEIxNlNRWldTVGtweC8xV0htQjNvdlJrNlRHVDY2WmZCNGd3NjJ2Mmk3dFIwcWtIcEEvLS1xZDdGYVJWZUlTamp2bC9FUGQrTElRPT0%3D--6398fb845387aa4a3123e0956b7530b6a1edfcbe; _hi=1567262340011"
          }
        };
        console.log('url:', url);
        return request(options).then(htmlString => {
          const document = parse(htmlString);
          const counters = document(selector);

          const disadvantage = counters
            .map((i, row) => {
              const name = row.children[0].attribs["data-value"];
              const performance = row.children[2].attribs["data-value"];

              const hero = findHeroByName(name);

              return { id: hero.id, performance };
            })
            .get();

          counter++;
          console.log("Progress:", counter + "/" + (MAX_STEPS - START));

          return {
            disadvantage,
            hero: item.id
          };
        });
      });

    Promise.all(promises).then(items => {
      let data = [];

      if (fs.existsSync("./data.json")) {
        data = JSON.parse(fs.readFileSync("./data.json"));
      }

      // console.log(items);

      fs.writeFileSync(
        "./data.json",
        JSON.stringify([...data, ...items], null, 2)
      );

      res();
    });
  });
};

let promiseChain = Promise.resolve();
for (let i = START; i < HEROES_COUNT; i++) {
  promiseChain = promiseChain.then(() => timeout(() => getData(i)) );
}
