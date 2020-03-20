function plotData(results) {
  const labels = results.map(x => x.mmdd);
  const cases = results.map(x => x.data.features[0].attributes.TotalPositive);
  const dataSets = [];
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
          results.push({
            date: day.replace("state-", ""),
            mmdd: day.substring(10, 12) + '/' + day.slice(-2),
            data: JSON.parse(xhr2.response)
          });
        };
      });
  };
  return results;
}

const savedDataState = getDataState();
setTimeout(() => {
  plotDataState(savedDataState.sort((a, b) => a.date - b.date));
}, 1000);