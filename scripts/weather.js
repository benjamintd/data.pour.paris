const fetch = require('node-fetch');


const fetchOne = async (date) => {
  const s = await fetch(`http://www.meteofrance.com/climat/meteo-date-passee?lieuId=751010&lieuType=VILLE_FRANCE&date=${date}`)
  .then(res => res.text())
  .then(t => t.split('<!-- Weather Data -->')[1].split('<strong>').map(e => e.split('</strong>')[0]).slice(2, 5))
  .then(d => [d[0].slice(0, -2), d[1].slice(0, -1), d[2].slice(0, -2)])
  return s
}



const fetchAll = async () => {
  let date = new Date(2019, 10, 1);

  while (date.getTime() < new Date().getTime()) {
    let stringDate = date.getDate() + '-' + (date.getMonth() + 1) + '-' + (1900 + date.getYear());
    let data = await fetchOne(stringDate);
    date.setDate(date.getDate() + 1);
    console.log(data.join(','))
  }

}

fetchAll();
