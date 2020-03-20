function plotData(results) {
  const labels = results.map(x => x.mmdd);
  const cases = results.map(x => x.data.features[0].attributes.TotalPositive);
  const ctx = document.getElementById('myChart').getContext('2d');
  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Hillsborough Covid-19 Cases',
          backgroundColor: 'rgb(255, 99, 132)',
          borderColor: 'rgb(255, 99, 132)',
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
            date: day,
            mmdd: day.substring(10, 12) + '/' + day.slice(-2),
            data: JSON.parse(xhr2.response)
          });
        };
      });
  };
  return results;
}

const weather = getData();
setTimeout(() => {
  plotData(weather.sort((a, b) => a.date - b.date));
}, 1000);
