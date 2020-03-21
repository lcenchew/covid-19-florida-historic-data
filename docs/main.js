function plotData(results) {
  const labels = results.map(x => x.mmdd);
  const cases = results.map(x => x.data.features[0].attributes.T_positive);
  const ctx = document.getElementById('myChart').getContext('2d');
  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Hillsborough Covid-19 Cases',
          backgroundColor: 'rgba(255, 99, 132, 0)',
          borderColor: '#ea0000',
          data: cases
        }
      ]
    },
    options: {
      scales: {
        yAxes: [{
            ticks: {
                suggestedMin: 0,
                // suggestedMax: 100
            }
        }]
      }
    }
  });
}

function getData() {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'assets/tampa-data.txt');
  xhr.send();
  const results = [];
  xhr.onload = function() {
    xhr.response
      .split('\n')
      .filter(d => d)
      .splice(-30)
      .forEach(day => {
        const xhr2 = new XMLHttpRequest();
        xhr2.open('GET', `assets/data/${day}.json`);
        xhr2.send();
        xhr2.onload = function () {
          results.push({
            date: day.replace("tampa-", ""),
            mmdd: day.substring(10, 12) + '/' + day.slice(-2),
            data: JSON.parse(xhr2.response)
          });
        };
      });
  };
    // get now data
    const xhr2 = new XMLHttpRequest();
    xhr2.open('GET', `https://services1.arcgis.com/CY1LXxl9zlJeBuRZ/arcgis/rest/services/Florida_COVID19_Cases/FeatureServer/0/query?f=json&where=OBJECTID%20=%2020&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&orderByFields=T_positive%20desc&outSR=102100&resultOffset=0&resultRecordCount=67&cacheHint=true`);
    xhr2.send();
    xhr2.onload = function () {
      let today = new Date();
      let todayMonth = ("0"+(today.getMonth() + 1)).slice(-2); //month with leading 0
      let todayDay = (today.getDate());
      results.push({
        date: `${today.getFullYear()}${todayMonth}${todayDay}`,
        mmdd: `${todayMonth}/${todayDay}`,
        data: JSON.parse(xhr2.response)
      });
    };
    return results;
}

const savedData = getData();
setTimeout(() => {
  plotData(savedData.sort((a, b) => a.date - b.date));
}, 1000);



// State Chart
function plotDataState(results) {
  const labels = results.map(x => x.mmdd);
  const ctx = document.getElementById('myChartState').getContext('2d');
  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Pending',
          backgroundColor: 'rgba(255, 197, 67, 1)',
          borderColor: 'rgba(202, 0, 0, 0)',
          data: results.map(x => x.data.features[0].attributes.Pending)
        },
        {
          label: 'Negative',
          backgroundColor: 'green',
          borderColor: 'rgba(202, 0, 0, 0)',
          data: results.map(x => x.data.features[0].attributes.Negative)
        },
        {
          label: 'Positive',
          backgroundColor: '#ea0000',
          borderColor: 'rgba(202, 0, 0, 0)',
          data: results.map(x => x.data.features[0].attributes.Positive)
        },
        {
          label: 'Hospitalized',
          backgroundColor: 'yellow',
          borderColor: 'rgba(202, 0, 0, 0)',
          data: results.map(x => x.data.features[0].attributes.Hospitalized)
        },
        {
          label: 'Deaths',
          backgroundColor: 'black',
          borderColor: 'rgba(202, 0, 0, 0)',
          data: results.map(x => x.data.features[0].attributes.Deaths)
        }
      ]
    },
    options: {
      scales: {
        yAxes: [{
            stacked: true,
            ticks: {
                suggestedMin: 0,
                // suggestedMax: 100
            }
        }]
      }
    }
  });
}

function getDataState() {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'assets/state-data.txt');
  xhr.send();
  const results = [];
  xhr.onload = function() {
    xhr.response
      .split('\n')
      .filter(d => d)
      .splice(-30)
      .forEach(day => {
        const xhr2 = new XMLHttpRequest();
        xhr2.open('GET', `assets/data/${day}.json`);
        xhr2.send();
        xhr2.onload = function () {
          day = day.replace("state-", "");
          results.push({
            date: day,
            mmdd: day.substring(4, 6) + '/' + day.slice(-3),
            data: JSON.parse(xhr2.response)
          });
        };
      });
  };
  // get now data
  const xhr2 = new XMLHttpRequest();
  xhr2.open('GET', `https://services1.arcgis.com/CY1LXxl9zlJeBuRZ/arcgis/rest/services/Florida_COVID19_Cases/FeatureServer/0/query?f=json&where=1%3D1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&outStatistics=%5B%7B%22statisticType%22%3A%22sum%22%2C%22onStatisticField%22%3A%22FLandNonFLDeaths%22%2C%22outStatisticFieldName%22%3A%22Deaths%22%7D%2C%7B%22statisticType%22%3A%22sum%22%2C%22onStatisticField%22%3A%22T_positive%22%2C%22outStatisticFieldName%22%3A%22Positive%22%7D%2C%7B%22statisticType%22%3A%22sum%22%2C%22onStatisticField%22%3A%22PUIHosp_No%22%2C%22outStatisticFieldName%22%3A%22Hospitalized%22%7D%2C%7B%22statisticType%22%3A%22sum%22%2C%22onStatisticField%22%3A%22T_total%22%2C%22outStatisticFieldName%22%3A%22TotalTests%22%7D%2C%7B%22statisticType%22%3A%22sum%22%2C%22onStatisticField%22%3A%22T_negative%22%2C%22outStatisticFieldName%22%3A%22Negative%22%7D%2C%7B%22statisticType%22%3A%22sum%22%2C%22onStatisticField%22%3A%22T_pending%22%2C%22outStatisticFieldName%22%3A%22Pending%22%7D%5D&outSR=102100&cacheHint=true`);
  xhr2.send();
  xhr2.onload = function () {
    let today = new Date();
    let todayMonth = ("0"+(today.getMonth() + 1)).slice(-2); //month with leading 0
    let todayDay = (today.getDate());
    results.push({
      date: `${today.getFullYear()}${todayMonth}${todayDay}`,
      mmdd: `${todayMonth}/${todayDay}`,
      data: JSON.parse(xhr2.response)
    });
  };
  return results;
}

const savedDataState = getDataState();
setTimeout(() => {
  plotDataState(savedDataState.sort((a, b) => a.date - b.date));
}, 1000);