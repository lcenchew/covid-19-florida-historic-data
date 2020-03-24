<template>
  <div class="content container">
    <div id="app">
      <h1 class="text-center">Florida Coronavirus(COVID-19) Tracker</h1>
      <p>This site captures daily numbers from the Florida Department of Health to track the Coronavirus progress over time.</p>
      <div v-if="currentCounty.attributes">
        <div class="row">
          <div class="col-sm-6">
            <div class="text-center">
              <strong>Top Coronavirus Cases by Florida County</strong>
            </div>
            <div class="rank-list">
              <div v-if="flCountiesLoading" class="text-center">
                <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i>
                <span class="sr-only">Loading...</span>
              </div>
              <div v-else>
                <div v-if="flCounties && flCounties.length">
                  <div
                    class="row item"
                    v-for="county in flCounties"
                    :class="{ active: county.attributes.COUNTYNAME == currentCounty.attributes.COUNTYNAME }"
                    @click="plotData(county.attributes.COUNTYNAME)"
                    :key="county.attributes.COUNTYNAME"
                  >
                    <div class="col-xs-6 text-right">
                      <span class="countyname">{{ county.attributes.County_1 }}</span>
                    </div>
                    <div class="col-xs-6 flex flex-row">
                      <span class="count">{{ county.attributes.TPositive | toLocal }}</span>
                      <span
                        class="ranking background-primary"
                        :style="{ width: (county.attributes.TPositive / casesSummary.max) * 100 + '%' }"
                      ></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-sm-6 text-center">
            <div class="text-danger fa-3x">
              <strong>{{currentCounty.attributes.TPositive}}</strong>
            </div>
            <strong>{{currentCounty.attributes.County_1}} Cases</strong>
            <div>
              <strong>{{(currentCounty.attributes.TPositive / currentCounty.attributes.T_total) | toPercent }}</strong>% tested are positive for COVID-19
            </div>
            <div>
              <strong>{{(currentCounty.attributes.FLandNonFLDeaths / currentCounty.attributes.T_total) | toPercent }}</strong>% have died
            </div>
            <ul class="list-group">
              <!-- <li class="list-group-item">Deaths:  <strong>{{currentCounty.attributes.FLandNonFLDeaths}}</strong></li> -->
              <li class="list-group-item">
                Total Tested:
                <strong
                  class="text-success"
                >{{currentCounty.attributes.T_total | toLocal}}</strong>
              </li>
              <li
                class="list-group-item"
              >Tests Pending: {{currentCounty.attributes.T_pending | toLocal}}</li>
              <li class="list-group-item">
                Tests Negative:
                <strong
                  class="text-success"
                >{{currentCounty.attributes.T_negative | toLocal}}</strong>
                <br />
                <small>{{(currentCounty.attributes.T_negative / currentCounty.attributes.T_total) | toPercent }}% of people tested do not have COVID-19</small>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <hr />

      <div class="row">
        <div class="col-md-6">
          <div class="header">
            <div
              class="chartjs-title"
              v-if="currentCounty.attributes"
            >{{currentCounty.attributes.County_1}} Cases</div>
            <div class="pull-right">
              <small class="trend-label">County Trend</small>
            </div>
          </div>
          <canvas id="myChart"></canvas>
          <div class="header">
            <div
              class="chartjs-title"
              v-if="currentCounty.attributes"
            >{{currentCounty.attributes.County_1}} Testing</div>
          </div>
          <canvas id="myChartTesting"></canvas>
        </div>
        <div class="col-md-6">
          <div class="header">
            <div class="chartjs-title">Florida State Cases</div>
            <div class="pull-right">
              <small class="trend-label">State Trend</small>
            </div>
          </div>
          <canvas id="myChartState"></canvas>
          <div class="header">
            <div class="chartjs-title">Florida State Testing</div>
          </div>
          <canvas id="myChartStateTesting"></canvas>
        </div>
      </div>

      <hr />
      <a
        class="btn btn-primary btn-block"
        href="https://fdoh.maps.arcgis.com/apps/opsdashboard/index.html#/8d0de33f260d444c852a615dc7837c86"
      >Florida's COVID-19 map</a>
    </div>
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
// import _find from '../node_modules/lodash/find'
// import _sortBy from '../node_modules/lodash/sortBy'
import _filter from "../node_modules/lodash/filter";
import axios from "axios";

export default {
  name: "App",
  data: function() {
    return {
      flCounties: [],
      flCountiesLoading: true,
      alldata: [],
      selectedCounty: {}
    };
  },
  mounted: function() {
    // get info
    var self = this;
    axios
      .get(
        "https://services1.arcgis.com/CY1LXxl9zlJeBuRZ/arcgis/rest/services/Florida_COVID19_Cases/FeatureServer/0/query?f=json&where=1%3D1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&orderByFields=TPositive%20desc&outSR=102100&resultOffset=0&resultRecordCount=67&cacheHint=true"
      )
      .then(response => {
        self.flCounties = response.data.features;
        self.flCountiesLoading = false;
      });
    self.getData();
  },
  filters: {
    toLocal: function(value) {
      return value.toLocaleString();
    },
    toPercent: function(value) {
      return (value * 100).toFixed(1);
    }
  },
  computed: {
    hillsborough: function hillsborough() {
      var matches = _filter(this.flCounties, {
        attributes: {
          COUNTYNAME: "HILLSBOROUGH"
        }
      });
      return matches[0];
    },
    casesSummary: function casesSummary() {
      return {
        min: this.flCounties[this.flCounties.length - 1].attributes.TPositive,
        max: this.flCounties[0].attributes.TPositive
      };
    },
    currentCounty: function currentCounty() {
      return this.selectedCounty;
    }
  },
  methods: {
    track () {
      this.$ga.page('/')
    },
    plotData: function plotData(county) {
      var self = this;
      const results = self.alldata.sort((a, b) => a.date - b.date);
      const labels = results.map(x => x.mmdd);
      const ctx = document.getElementById("myChart").getContext("2d");
      const thisCountyData = results.map(x => {
        var countyResults = _filter(x.data.features, {
          attributes: {
            COUNTYNAME: county.toUpperCase()
          }
        });
        return countyResults[0];
      });
      // most recent results move to selected county
      self.selectedCounty = thisCountyData[thisCountyData.length - 1];
      var gradient = ctx.createLinearGradient(0, 0, 0, 450);
      gradient.addColorStop(0, "rgba(255, 0,0, 0.5)");
      gradient.addColorStop(0.5, "rgba(255, 0, 0, 0.25)");
      gradient.addColorStop(1, "rgba(255, 0, 0, 0)");
      const chart = new Chart(ctx, {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: county + " Covid-19 Cases",
              backgroundColor: gradient,
              borderColor: "#ea0000",
              data: results.map(x => {
                var countyResults = _filter(x.data.features, {
                  attributes: {
                    COUNTYNAME: county.toUpperCase()
                  }
                });
                return countyResults[0].attributes.T_positive
                  ? parseInt(countyResults[0].attributes.T_positive)
                  : 0;
              }),
              trendlineLinear: {
                style: "blue",
                lineStyle: "dotted",
                width: 2
              }
            },
            {
              label: "Deaths",
              backgroundColor: "black",
              borderColor: "rgba(202, 0, 0, 0)",
              data: results.map(x => {
                var countyResults = _filter(x.data.features, {
                  attributes: {
                    COUNTYNAME: county.toUpperCase()
                  }
                });
                return countyResults[0].attributes.FLandNonFLDeaths
                  ? countyResults[0].attributes.FLandNonFLDeaths
                  : 0;
              })
            }
          ]
        },
        options: {
          scales: {
            yAxes: [
              {
                ticks: {
                  suggestedMin: 0,
                  precision: 0
                }
              }
            ]
          }
        }
      });
      // bottom testing chart
      const labels2 = results.map(x => x.mmdd);
      const ctx2 = document.getElementById("myChartTesting").getContext("2d");
      const chart2 = new Chart(ctx2, {
        type: "line",
        data: {
          labels: labels2,
          datasets: [
            {
              label: "Pending",
              backgroundColor: "rgba(255, 197, 67, 1)",
              borderColor: "rgba(202, 0, 0, 0)",
              data: results.map(x => {
                var countyResults = _filter(x.data.features, {
                  attributes: {
                    COUNTYNAME: county.toUpperCase()
                  }
                });
                return countyResults[0].attributes.T_pending
                  ? countyResults[0].attributes.T_pending
                  : 0;
              })
            },
            {
              label: "Positive",
              backgroundColor: "#ea0000",
              borderColor: "rgba(255, 99, 132, 0)",
              data: results.map(x => {
                var countyResults = _filter(x.data.features, {
                  attributes: {
                    COUNTYNAME: county.toUpperCase()
                  }
                });
                return countyResults[0].attributes.T_positive
                  ? countyResults[0].attributes.T_positive
                  : 0;
              })
            },
            {
              label: "Negative",
              backgroundColor: "green",
              borderColor: "rgba(202, 0, 0, 0)",
              data: results.map(x => {
                var countyResults = _filter(x.data.features, {
                  attributes: {
                    COUNTYNAME: county.toUpperCase()
                  }
                });
                return countyResults[0].attributes.T_negative
                  ? countyResults[0].attributes.T_negative
                  : 0;
              })
            }
          ]
        },
        options: {
          scales: {
            yAxes: [
              {
                stacked: true,
                ticks: {
                  suggestedMin: 0,
                  precision: 0
                }
              }
            ]
          }
        }
      });
    },
    plotDataState: function plotDataState(results) {
      debugger
      const labels = results.map(x => x.mmdd);
      const ctx = document.getElementById("myChartState").getContext("2d");
      var gradient = ctx.createLinearGradient(0, 0, 0, 450);
      gradient.addColorStop(0, "rgba(255, 0,0, 0.5)");
      gradient.addColorStop(0.5, "rgba(255, 0, 0, 0.25)");
      gradient.addColorStop(1, "rgba(255, 0, 0, 0)");
      const chart = new Chart(ctx, {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Positive",
              backgroundColor: gradient,
              borderColor: "#ea0000",
              data: results.map(x =>
                parseInt(x.data.features[0].attributes.Positive)
              ),
              trendlineLinear: {
                style: "blue",
                lineStyle: "dotted",
                width: 2
              }
            },
            {
              label: "Deaths",
              backgroundColor: "",
              borderColor: "black",
              data: results.map(x => x.data.features[0].attributes.Deaths)
            }
          ]
        },
        options: {
          scales: {
            yAxes: [
              {
                ticks: {
                  suggestedMin: 0,
                  precision: 0
                }
              }
            ]
          }
        }
      });
      const labels2 = results.map(x => x.mmdd);
      const ctx2 = document
        .getElementById("myChartStateTesting")
        .getContext("2d");
      const chart2 = new Chart(ctx2, {
        type: "line",
        data: {
          labels: labels2,
          datasets: [
            {
              label: "Pending",
              backgroundColor: "rgba(255, 197, 67, 1)",
              borderColor: "rgba(202, 0, 0, 0)",
              data: results.map(x => x.data.features[0].attributes.Pending)
            },
            {
              label: "Negative",
              backgroundColor: "green",
              borderColor: "rgba(202, 0, 0, 0)",
              data: results.map(x => x.data.features[0].attributes.Negative)
            },
            {
              label: "Positive",
              backgroundColor: "#ea0000",
              borderColor: "rgba(202, 0, 0, 0)",
              data: results.map(x => x.data.features[0].attributes.Positive)
            },
            {
              label: "Hospitalized",
              backgroundColor: "yellow",
              borderColor: "rgba(202, 0, 0, 0)",
              data: results.map(x => x.data.features[0].attributes.Hospitalized)
            },
            {
              label: "Deaths",
              backgroundColor: "black",
              borderColor: "rgba(202, 0, 0, 0)",
              data: results.map(x => x.data.features[0].attributes.Deaths)
            }
          ]
        },
        options: {
          scales: {
            yAxes: [
              {
                stacked: true,
                ticks: {
                  suggestedMin: 0,
                  precision: 0
                }
              }
            ]
          }
        }
      });
    },
    getData: function getData() {
      var self = this;
      axios.get("/assets/data.txt").then(response => {
        var results = [];
        response.data
          .split("\n")
          .filter(d => d)
          .splice(-30)
          .forEach(day => {
            axios.get(`/assets/data/${day}.json`).then(response => {
              day = day.replace("tampa-", "").trim();
              results.push({
                date: day,
                mmdd: day.substring(4, 6) + "/" + day.slice(-2),
                data: response.data
              });
            });
          });
        // get now data
        axios
          .get(
            "https://services1.arcgis.com/CY1LXxl9zlJeBuRZ/arcgis/rest/services/Florida_COVID19_Cases/FeatureServer/0/query?f=json&where=T_positive%20IS%20NOT%20NULL&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&orderByFields=T_positive%20desc&outSR=102100&resultOffset=0&resultRecordCount=67&cacheHint=true"
          )
          .then(response => {
            let today = new Date();
            let todayMonth = ("0" + (today.getMonth() + 1)).slice(-2); //month with leading 0
            let todayDay = today.getDate();
            results.push({
              date: `${today.getFullYear()}${todayMonth}${todayDay}9`,
              mmdd: `now`,
              data: response.data
            });
            self.alldata = results; //all done fetching data
            self.plotData("HILLSBOROUGH"); // plot default

            // get state data Now
            const stateResults = [];
            axios.get(`assets/state-data.txt`).then(response => {
              response.data
                .split("\n")
                .filter(d => d)
                .splice(-30)
                .forEach(day => {
                  axios.get(`/assets/data/${day}.json`).then(response => {
                    day = day.replace("state-", "").trim();
                    stateResults.push({
                      date: day,
                      mmdd: day.substring(4, 6) + "/" + day.slice(-2),
                      data: response.data
                    });
                  });
                });
                // get now state data
                axios.get(`https://services1.arcgis.com/CY1LXxl9zlJeBuRZ/arcgis/rest/services/Florida_COVID19_Cases/FeatureServer/0/query?f=json&where=1%3D1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&outStatistics=%5B%7B%22statisticType%22%3A%22sum%22%2C%22onStatisticField%22%3A%22FLandNonFLDeaths%22%2C%22outStatisticFieldName%22%3A%22Deaths%22%7D%2C%7B%22statisticType%22%3A%22sum%22%2C%22onStatisticField%22%3A%22T_positive%22%2C%22outStatisticFieldName%22%3A%22Positive%22%7D%2C%7B%22statisticType%22%3A%22sum%22%2C%22onStatisticField%22%3A%22C_Hosp_Yes%22%2C%22outStatisticFieldName%22%3A%22Hospitalized%22%7D%2C%7B%22statisticType%22%3A%22sum%22%2C%22onStatisticField%22%3A%22T_total%22%2C%22outStatisticFieldName%22%3A%22TotalTests%22%7D%2C%7B%22statisticType%22%3A%22sum%22%2C%22onStatisticField%22%3A%22T_negative%22%2C%22outStatisticFieldName%22%3A%22Negative%22%7D%2C%7B%22statisticType%22%3A%22sum%22%2C%22onStatisticField%22%3A%22T_pending%22%2C%22outStatisticFieldName%22%3A%22Pending%22%7D%5D&outSR=102100&cacheHint=true`).then(response => {
                  let today = new Date();
                  let todayMonth = ("0" + (today.getMonth() + 1)).slice(-2); //month with leading 0
                  let todayDay = (today.getDate());
                  stateResults.push({
                      date: `${today.getFullYear()}${todayMonth}${todayDay}9`,
                      mmdd: `now`,
                      data: response.data
                  });
                  self.plotDataState(stateResults.sort((a, b) => a.date - b.date));
                });
            });
          });
      });
    }
  }
};
</script>

<style>
.ranking {
  height: 32px;
  min-width: 1%;
  display: inline-block;
}

.count {
  min-width: 30px;
  padding-right: 5px;
  display: inline-block;
  font-weight: bold;
  text-align: right;
  font-size: 18px;
}

.rank-list {
  max-height: 300px;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 1rem 2rem;
}

.rank-list .item {
  padding: 5px 0;
}

.rank-list .item:nth-child(1) .teamname {
  font-size: 150%;
  font-weight: 700;
}

.rank-list .item:nth-child(2) .teamname {
  font-size: 120%;
  font-weight: 600;
}

.active {
  border: dashed 3px #0072bc;
}

.item:hover {
  cursor: pointer;
}

.trend-label::before {
  content: "....";
  color: blue;
  padding-right: 1.5rem;
  font-size: 2rem;
  display: inline-block;
  transform: rotate(-33deg) translate(14px, 1px);
}

.trend-label {
  font-size: 12px;
}
</style>
