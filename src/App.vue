<template>
  <div class="content container">
    <div id="app">
      <div class="">
        <div class="text-center">
          <h1 class="text-white text-center">Florida Coronavirus (COVID-19) Tracker</h1>
        </div>
        <div class="solid-bk">
        <div class="text-center">
            <div style="line-height:1.5;">Daily numbers from the <a
              href="https://fdoh.maps.arcgis.com/apps/opsdashboard/index.html#/8d0de33f260d444c852a615dc7837c86"
            >Florida Department of Health</a> tracking the Coronavirus progress.
            <div class=""><small>State data is updated after approximately 11 a.m. and 6 p.m. daily.</small></div>
          </div>
          <div v-if="installBtn" class="btn btn-success p-2" @click="installer()"><i class="fa fa-download"></i> Install App for Latest Updates</div>
        </div>
          <div v-if="latestStateValue" class="row flex-column flex-sm-row padded align-middle align-items-center">
            <div class="col">
              <div class="row">
                <div class="col-4 text-right-desktop"><h2 class="h4">Florida Cases</h2></div>
                <div class="col-8 text-left">
                  <div class="badge fa-2x"> <countTo :endVal='latestStateValue' :duration='2200'></countTo></div>
                  <span class="p-2" v-if="parseInt(stateCasesIncrease[stateCasesIncrease.length - 1]) === 0" v-html="stateCasesIncrease[stateCasesIncrease.length - 2]"></span><span class="p-2" v-else v-html="stateCasesIncrease[stateCasesIncrease.length - 1]"></span>
                  <div class="badge" style="background-color:black;">
                  <span class="fa-2x"> <countTo :endVal='latestDeaths' :duration='1200'></countTo></span> Deaths
                  </div>
                </div>
              </div>
            </div>
            <div class="col">
              <div class="row flex-column flex-sm-row">
                <div class="col text-right-desktop">
                  <h3 class="h5">Projected Cases</h3>
                </div>
                <div class="col  text-right-desktop">
                  <strong class="badge background-secondary fa-1x"><countTo :endVal='compoundInterest(latestStateValue, stateAvg, 3)' :duration='3000'></countTo></strong> in 3 days
                </div>
                <div class="col">
                  <strong class="badge background-secondary fa-1x"><countTo :endVal='compoundInterest(latestStateValue, stateAvg, 7)' :duration='3500'></countTo></strong> in 7 days
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      <div>
        <div class="row padded">
          <div class="col-md-6 col-lg-7">
            <div class="text-center background-primary">
              <strong class="text-white">Top Coronavirus Cases by Florida County</strong>
            </div>
            <div class="rank-list solid-bk">
              <div v-if="flCountiesLoading" class="text-center">
                <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i>
                <span class="sr-only">Loading...</span>
              </div>
              <div v-else>
                <div v-if="flCounties && flCounties.length">
                  <div
                    class="item"
                    v-for="county in flCounties"
                    :class="{ active: currentCounty ? county.attributes.COUNTYNAME == currentCounty.attributes.COUNTYNAME : false }"
                    @click="plotData(county.attributes.COUNTYNAME)"
                    :key="county.attributes.COUNTYNAME"
                  >
                    <div class="col-name text-right">
                      <span class="countyname">{{ county.attributes.County_1 }}</span> -
                    </div>
                    <div class="col-cnt flex flex-row">
                      <span class="count">{{ county.attributes.TPositive | toLocal }}</span>
                      <span
                        class="ranking background-primary"
                        :style="{ width: (county.attributes.TPositive / casesSummary.max) * 100 + '%' }"
                      ></span>
                    </div>
                    <div class="col-capital text-center" v-if="countyInfo[county.attributes.COUNTYNAME] && countyInfo[county.attributes.COUNTYNAME].pop">
                      <span class="badge fa-1x"><i class="fa fa-university small" aria-hidden="true"></i> {{((county.attributes.TPositive / countyInfo[county.attributes.COUNTYNAME].pop) * 100000).toFixed(0)}}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-6 col-lg-5">
            <div v-if="currentCounty && currentCounty.attributes" class="border-primary">
              <div class="background-primary  text-center"><strong>{{currentCounty.attributes.County_1}} Cases</strong></div>
              <ul class="list-group">
                <li class="list-group-item">
                  <div class="row">
                    <div class="col-6 text-right-desktop">
                      <div class="badge fa-3x" >
                        <strong><countTo :endVal='currentCounty.attributes.TPositive' :duration='1200'></countTo></strong>
                      </div>
                    </div>
                    <div class="col-6">
                      <strong>{{currentCounty.attributes.County_1}}<br> Positive Cases <span v-if="parseInt(selectedCountyCasesIncrease[selectedCountyCasesIncrease.length - 1]) === 0" v-html="selectedCountyCasesIncrease[selectedCountyCasesIncrease.length - 2]"></span><span v-else v-html="selectedCountyCasesIncrease[selectedCountyCasesIncrease.length - 1]"></span></strong>
                    </div>
                  </div>
                </li>
                <li class="list-group-item">
                  <strong>Projected Cases</strong> if {{selectedCountyAvg.toFixed(0)}}% avg. trend continues
                  <div class="row">
                    <div class="col-6 col-sm-6  text-right-desktop"><strong class="badge background-secondary fa-1x">{{compoundInterest(currentCounty.attributes.TPositive, selectedCountyAvg, 3) | toLocal }}</strong> in 3 days</div>
                    <div class="col-6 col-sm-6"><strong class="badge background-secondary fa-1x">{{compoundInterest(currentCounty.attributes.TPositive, selectedCountyAvg, 7) | toLocal }}</strong> in 7 days</div>
                  </div>

                </li>
                <li class="list-group-item">
                  <div class="row">
                    <div class="col-6 text-right-desktop">
                      <div class="badge fa-2x"><i class="fa fa-university small" aria-hidden="true"></i> {{((currentCounty.attributes.TPositive / countyInfo[currentCounty.attributes.COUNTYNAME].pop) * 100000).toFixed(0)}}</div>
                    </div>
                    <div class="col-6">
                      <strong>Cases per Capita</strong><br><small>{{((currentCounty.attributes.TPositive / countyInfo[currentCounty.attributes.COUNTYNAME].pop) * 100000).toFixed(0)}} out of 100k people</small>
                    </div>
                  </div>
                </li>
                <li class="list-group-item">
                  <div class="row">
                    <div class="col-6 text-right-desktop">
                      <div class="fa-2x">
                        {{(currentCounty.attributes.TPositive / currentCounty.attributes.T_total) | toPercent }}<sup>%</sup>
                      </div>
                    </div>
                    <div class="col-6">
                      <strong>Tested are positive <br> for COVID-19</strong>
                    </div>
                  </div>
                </li>
                <li class="list-group-item">
                  <div class="row">
                    <div class="col-6 text-right-desktop">
                      <div class="badge fa-2x" style="background-color:black;">
                        {{currentCounty.attributes.FLResDeaths | toLocal }}
                      </div>
                    </div>
                    <div class="col-6">
                      <div class="d-flex" style="align-items:center;">
                        <strong>Deaths</strong>
                      </div>
                    </div>
                  </div>
                </li>
                <li class="list-group-item">
                  <div class="row">
                    <div class="col-6 text-right-desktop">
                      <div >
                        <strong><countTo :endVal='currentCounty.attributes.T_total' :duration='1200'></countTo></strong>
                      </div>
                    </div>
                    <div class="col-6">
                      <div class="d-flex" style="align-items:center;">
                        <strong>Total Tested</strong>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <hr />

      <div class="row">
        <div class="col-md-6">
          <div class="solid-bk">
          <div class="header">
            <div
              class="chartjs-title"
              v-if="currentCounty.attributes"
            >{{currentCounty.attributes.County_1}} Cases</div>
          </div>
          <line-chart chart-id="county-chart" :chart-data="lineData" :options="lineOptions" :height="330" :width="400"></line-chart>
          <div class="percentChange">
            <div>Latest Daily Changes</div>
            <div v-for="percent in selectedCountyCasesIncrease.slice(selectedCountyCasesIncrease.length -5)" v-html="percent"></div>
          </div>
          </div>
          <hr>
          <div class="solid-bk">
          <div class="header">
            <div
              class="chartjs-title"
              v-if="currentCounty.attributes"
            >{{currentCounty.attributes.County_1}} Testing</div>
          </div>
          <line-chart chart-id="county-testing-chart" :chart-data="lineTestingData" :options="lineTestingOptions" :height="330" :width="400"></line-chart>
          </div>
        </div>
        <div class="col-md-6">
           <div class="solid-bk">
          <div class="header">
            <div class="chartjs-title">Florida State Cases</div>
          </div>
          <line-chart chart-id="state-chart" :chart-data="stateLineData" :options="stateLineOptions" :height="330" :width="400"></line-chart>
          <div class="percentChange">
            <div>Latest Daily Changes</div>
            <div v-for="percent in stateCasesIncrease.slice(stateCasesIncrease.length -5)" v-html="percent"></div>
          </div>
           </div>
          <hr>
           <div class="solid-bk">
          <div class="header">
            <div class="chartjs-title">Florida State Testing</div>
          </div>
          <line-chart chart-id="state-testing-chart" :chart-data="stateLineTestingData" :options="stateLineTestingOptions" :height="330" :width="400"></line-chart>
           </div>
        </div>
      </div>

      <hr />

      <footer class="mt-5 py-4 text-center border-top">
        <div class="container">
          <div class="row">
            <div class="col-12"><p>Created by <a href="https://www.nicholasstees.com/" rel="noopener nofollow" target="_blank">Nicholas Stees</a> a web developer in Tampa Florida</p></div>
          </div>
        </div>
      </footer>

    </div>
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import _remove from '../node_modules/lodash/remove'
// import _sortBy from '../node_modules/lodash/sortBy'
import _filter from "../node_modules/lodash/filter";
import countTo from 'vue-count-to';
import axios from "axios";
import LineChart from "./components/LineChart.js";
let ROOT_PATH = 'https://flacoronavirustracker.com/'

export default {
  name: "App",
  components: { countTo, LineChart },
  data: function() {
    return {
      logo: ROOT_PATH + require('./assets/logo.png'),
      installBtn: false,
      installer: undefined,
      flCounties: [],
      flCountiesLoading: true,
      alldata: [],
      selectedCounty: {},
      selectedCountyAvg: 0,
      selectedCountyCases: [],
      selectedCountyCasesIncrease: [],
      stateCases: [],
      latestDeaths: null,
      stateCasesIncrease: [],
      stateAvg: 0,
      latestStateValue: 0,
      countyInfo: null,
      lineOptions: {
          scales: {
             xAxes: [{
               gridLines: {
                  color: 'rgba(255,255,255,.15)'
                },
             }],
            yAxes: [
              {
                // color: red,
                ticks: {
                  suggestedMin: 0,
                  precision: 0
                },
                // gridLines: {
                //   color: 'rgba(255,255,255,.15)'
                // },
              }
            ],
          },
          legend: {
            position: 'top',
            labels: {
              fontColor: 'rgba(255,255,255,.75)'
            }
          },

        },
      lineData: {},
      lineTestingOptions: {
          scales: {
            xAxes: [{
               gridLines: {
                  color: 'rgba(255,255,255,.15)'
                },
             }],
             yAxes: [
              {
                stacked: true,
                ticks: {
                  suggestedMin: 0,
                  precision: 0
                }
              }
            ]
          },
          legend: {
            position: 'top',
            labels: {
              fontColor: 'rgba(255,255,255,.75)'
            }
          },
        },
      lineTestingData: {},
      stateLineOptions:{
          scales: {
            xAxes: [{
               gridLines: {
                  color: 'rgba(255,255,255,.15)'
                },
             }],
             yAxes: [
              {
                ticks: {
                  suggestedMin: 0,
                  precision: 0
                }
              }
            ]
          },
          legend: {
            position: 'top',
            labels: {
              fontColor: 'rgba(255,255,255,.75)'
            }
          },
        },
      stateLineData:{},
      stateLineTestingOptions:{
          scales: {
            xAxes: [{
               gridLines: {
                  color: 'rgba(255,255,255,.15)'
                },
             }],
             yAxes: [
              {
                stacked: true,
                ticks: {
                  suggestedMin: 0,
                  precision: 0
                }
              }
            ]
          },
          legend: {
            position: 'top',
            labels: {
              fontColor: 'rgba(255,255,255,.75)'
            }
          },
        },
      stateLineTestingData:{},
    };
  },
  created (){
    let installPrompt;
    var self = this;

    window.addEventListener("beforeinstallprompt" , e => {
      e.preventDefault();
      installPrompt = e;
      this.installBtn = true;
    })

    this.installer = () => {
      this.installBtn = 'none';
      installPrompt.prompt();
      installPrompt.userChoice.then(result =>{
        if (result.outcome === 'accepted'){
          console.log('user accepted')
          self.$ga.event('pwa', 'accepted', 'yes')
        }else{
          console.log("user denied")
          self.$ga.event('pwa', 'denied', 'no')
        }
        installPrompt = null;
      })
    }

  },
  async mounted() {
    // get info
    var self = this;
    var hour = new Date().getHours();
    try {
      var results = [];
      var stateResults = [];
      let today = new Date();
      let todayMonth = ("0" + (today.getMonth() + 1)).slice(-2); //month with leading 0
      let todayDay = today.getDate();
      // start requests
      let counties = await axios.get(
        "https://services1.arcgis.com/CY1LXxl9zlJeBuRZ/arcgis/rest/services/Florida_COVID19_Cases/FeatureServer/0/query?f=json&where=1%3D1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&orderByFields=TPositive%20desc&outSR=102100&resultOffset=0&resultRecordCount=67&cacheHint=true"
      );
      let fetchedData = await axios.get("/assets/data.txt");
      fetchedData.data
        .split("\n")
        .filter(d => d)
        .splice(-30)
        .forEach(async day => {
          try {
          let response = await axios.get(`/assets/data/${day}.json`);
          day = day.replace("tampa-", "").trim();
          results.push({
            date: day,
            mmdd: day.substring(4, 6) + "/" + day.slice(-2),
            data: response.data
          });
          } catch (err) {
            console.log(err);
          }
        });
      // get now data
      if (hour >= 11) {
        let nowData = await axios.get(
          "https://services1.arcgis.com/CY1LXxl9zlJeBuRZ/arcgis/rest/services/Florida_COVID19_Cases/FeatureServer/0/query?f=json&where=T_positive%20IS%20NOT%20NULL&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&orderByFields=T_positive%20desc&outSR=102100&resultOffset=0&resultRecordCount=67&cacheHint=true"
        );
        results.push({
          date: `${today.getFullYear()}${todayMonth}${todayDay}9`,
          mmdd: `now`,
          data: nowData.data
        });
      }

      // State data
      let fetchedStateData = await axios.get("assets/state-data.txt");
      fetchedStateData.data
        .split("\n")
        .filter(d => d)
        .splice(-30)
        .forEach(async day => {
          try {
          let response = await axios.get(`/assets/data/${day}.json`);
          day = day.replace("state-", "").trim();
          stateResults.push({
            date: day,
            mmdd: day.substring(4, 6) + "/" + day.slice(-2),
            data: response.data
          });
          } catch (err) {
            console.log(err);
          }
        });
        console.log(hour)
        if (hour >= 11) {
          // Now state data
          let fetchedNowStateData = await axios.get(
            "https://services1.arcgis.com/CY1LXxl9zlJeBuRZ/arcgis/rest/services/Florida_COVID19_Cases/FeatureServer/0/query?f=json&where=1%3D1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&outStatistics=%5B%7B%22statisticType%22%3A%22sum%22%2C%22onStatisticField%22%3A%22FLResDeaths%22%2C%22outStatisticFieldName%22%3A%22Deaths%22%7D%2C%7B%22statisticType%22%3A%22sum%22%2C%22onStatisticField%22%3A%22T_positive%22%2C%22outStatisticFieldName%22%3A%22Positive%22%7D%2C%7B%22statisticType%22%3A%22sum%22%2C%22onStatisticField%22%3A%22C_Hosp_Yes%22%2C%22outStatisticFieldName%22%3A%22Hospitalized%22%7D%2C%7B%22statisticType%22%3A%22sum%22%2C%22onStatisticField%22%3A%22T_total%22%2C%22outStatisticFieldName%22%3A%22TotalTests%22%7D%2C%7B%22statisticType%22%3A%22sum%22%2C%22onStatisticField%22%3A%22T_negative%22%2C%22outStatisticFieldName%22%3A%22Negative%22%7D%2C%7B%22statisticType%22%3A%22sum%22%2C%22onStatisticField%22%3A%22TPending%22%2C%22outStatisticFieldName%22%3A%22Pending%22%7D%5D&outSR=102100&cacheHint=true"
          );
          stateResults.push({
            date: `9${today.getFullYear()}${todayMonth}${todayDay}`,
            mmdd: `now`,
            data: fetchedNowStateData.data
          });
        }
      let countyInfo = await axios.get('/assets/data/county-info.json');
      self.countyInfo = countyInfo.data;
      self.alldata = results; //all done fetching data
      // remove unkown county
      _remove(counties.data.features, {
        attributes: {
          COUNTY: "999"
        }
      });
      self.flCounties = counties.data.features;
      self.flCountiesLoading = false;
      setTimeout(function(){
        let county = self.$route.params.county ? self.$route.params.county.toUpperCase() : "HILLSBOROUGH";
        self.plotData(county); // plot default
        self.plotDataState(stateResults);
      }, 300);
    } catch (err) {
      console.log(err);
    }
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
      if(this.selectedCounty && this.selectedCounty.attributes){
        return this.selectedCounty;
      }else{
        return false;
      }
    }
  },
  methods: {
    track() {
      this.$ga.page("/");
    },
    getData: async function getData() {
      var self = this;
      try {
      } catch (err) {
        console.log(err);
      }
    },
    plotData: function plotData(county) {
      var self = this;
      self.$router.push('/'+county.toUpperCase()).catch(err => {console.log(err)})
      const results = self.alldata.sort((a, b) => a.date - b.date);
      let labels = results.map(x => x.mmdd);
      const thisCountyData = results.map(x => {
        var countyResults = _filter(x.data.features, {
          attributes: {
            COUNTYNAME: county.toUpperCase()
          }
        });
        return countyResults ? countyResults[0] : null;
      });
      // most recent results move to selected county
      let selectedCountyRecent = thisCountyData[thisCountyData.length - 1];
      if(!selectedCountyRecent.attributes) {
        self.$router.push("HILLSBOROUGH").catch(err => {console.log(err)})
        return null
          }
      self.selectedCounty = selectedCountyRecent;
      var gradient = document.getElementById("county-chart").getContext("2d").createLinearGradient(0, 0, 0, 450);
      gradient.addColorStop(0, "rgba(255, 0,0, 0.5)");
      gradient.addColorStop(0.5, "rgba(255, 0, 0, 0.25)");
      gradient.addColorStop(1, "rgba(255, 0, 0, 0)");
      var projectedData = [];
      let countyData = results.map(x => {
                projectedData.push(null)
                var countyResults = _filter(x.data.features, {
                  attributes: {
                    COUNTYNAME: county.toUpperCase()
                  }
                });
                if(countyResults.length && countyResults[0].attributes){
                  return countyResults[0].attributes.T_positive
                    ? parseInt(countyResults[0].attributes.T_positive)
                    : 0;
                }else{
                  return 0
                }
              })
      self.selectedCountyCases = countyData;
      let justPercentNumbers = [];
      self.selectedCountyCasesIncrease = countyData.map((x, index) => {
        let prevDay = index >= 1 ? index - 1 : 0;
        let prevDayCnt = countyData[prevDay];
        let dayChange = self.percentChangeNum(x, prevDayCnt);
        justPercentNumbers.push(dayChange)
        return self.percentChange(x, prevDayCnt);
      });
      let last3Days = justPercentNumbers.slice(Math.max(justPercentNumbers.length - 4, 0))
      let average = last3Days.reduce((a, b) => a + b) / last3Days.length;
      self.selectedCountyAvg = average;
      let countyLatestNum = countyData[countyData.length - 1]
      let plusOne = self.compoundInterest(countyLatestNum, average, 1);
      let plusTwo = self.compoundInterest(countyLatestNum, average, 2);
      let plusThree = self.compoundInterest(countyLatestNum, average, 3);
      projectedData = projectedData.concat(plusOne, plusTwo, plusThree);
      labels = labels.concat("+1","+2","+3");
      // console.log(projectedData)
      self.lineData = {
          labels: labels,
          datasets: [
            {
              label: "Covid-19 Cases",
              backgroundColor: gradient,
              borderColor: "#ea0000",
              data: countyData
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
                if(countyResults.length && countyResults[0].attributes){
                  return countyResults[0].attributes.FLResDeaths
                    ? parseInt(countyResults[0].attributes.FLResDeaths)
                    : 0;
                }else{
                  return 0
                }
              })
            },
            {
              label: "Projected Cases",
              borderColor: "#00bc8c",
              data: projectedData,
              borderDash: [5,3]
            }
          ]
        }
      // bottom testing chart
      const labels2 = results.map(x => x.mmdd);
      self.lineTestingData = {
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
                if(countyResults.length && countyResults[0].attributes){
                  return countyResults[0].attributes.TPending
                  ? countyResults[0].attributes.TPending
                  : 0;
                }else{
                  return 0
                }
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
                if(countyResults.length && countyResults[0].attributes){
                return countyResults[0].attributes.T_negative
                  ? countyResults[0].attributes.T_negative
                  : 0;
                }else{
                  return 0
                }
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
                if(countyResults.length && countyResults[0].attributes){
                return countyResults[0].attributes.T_positive
                  ? countyResults[0].attributes.T_positive
                  : 0;
                }else{
                  return 0
                }
              })
            },
            {
              label: "Hospitalized",
              backgroundColor: "yellow",
              borderColor: "rgba(202, 0, 0, 0)",
              data: results.map(x => {
                var countyResults = _filter(x.data.features, {
                  attributes: {
                    COUNTYNAME: county.toUpperCase()
                  }
                });
                if(countyResults.length && countyResults[0].attributes){
                return countyResults[0].attributes.C_Hosp_Yes
                  ? countyResults[0].attributes.C_Hosp_Yes
                  : 0;
                }else{
                  return 0
                }
              })
            },
          ]
        }
    },
    plotDataState: function plotDataState(results) {
      var self = this;
      const resultsSorted = results.sort((a, b) => a.date - b.date)
      let labels = resultsSorted.map(x => x.mmdd);
      let gradient = document.getElementById("state-chart").getContext("2d").createLinearGradient(0, 0, 0, 450);
      gradient.addColorStop(0, "rgba(255, 0,0, 0.5)");
      gradient.addColorStop(0.5, "rgba(255, 0, 0, 0.25)");
      gradient.addColorStop(1, "rgba(255, 0, 0, 0)");
      let projectedData = [];
      let justPercentNumbers = [];
      let stateCases = resultsSorted.map(x =>{
        projectedData.push(null)
        return parseInt(x.data.features[0].attributes.Positive)
      });
      let stateDeaths = resultsSorted.map(x =>{
        return parseInt(x.data.features[0].attributes.Deaths)
      });
      this.stateCasesIncrease = stateCases.map((x, index) => {
        let prevDay = index >= 1 ? index - 1 : 0;
        let prevDayCnt = stateCases[prevDay];
        let dayChange = self.percentChangeNum(x, prevDayCnt);
          justPercentNumbers.push(dayChange)
        return self.percentChange(x, stateCases[prevDay]);
      });
      let last3Days = justPercentNumbers.slice(Math.max(justPercentNumbers.length - 4, 0))
      let average = last3Days.reduce((a, b) => a + b) / last3Days.length;
      self.stateAvg = average;
      let latestValue = stateCases[stateCases.length - 1];
      self.latestDeaths = stateDeaths[stateDeaths.length - 1];
      self.latestStateValue = latestValue;
      let plusOne = self.compoundInterest(latestValue, average, 1);
      let plusTwo = self.compoundInterest(latestValue, average, 2);
      let plusThree = self.compoundInterest(latestValue, average, 3);
      projectedData = projectedData.concat(plusOne, plusTwo, plusThree);
      labels = labels.concat("+1","+2","+3");
      this.stateLineData =  {
          labels: labels,
          datasets: [
            {
              label: "Positive",
              backgroundColor: gradient,
              borderColor: "#ea0000",
              data: stateCases,
            },
            {
              label: "Deaths",
              backgroundColor: "",
              borderColor: "black",
              data: stateDeaths
            },
            {
              label: "Projected Cases",
              borderColor: "#00bc8c",
              data: projectedData,
              borderDash: [5,3]
            }
          ]
        }
      const labels2 = resultsSorted.map(x => x.mmdd);

      this.stateLineTestingData = {
          labels: labels2,
          datasets: [
            {
              label: "Pending",
              backgroundColor: "rgba(255, 197, 67, 1)",
              borderColor: "rgba(202, 0, 0, 0)",
              data: resultsSorted.map(x => x.data.features[0].attributes.Pending)
            },
            {
              label: "Negative",
              backgroundColor: "green",
              borderColor: "rgba(202, 0, 0, 0)",
              data: resultsSorted.map(x => x.data.features[0].attributes.Negative)
            },
            {
              label: "Positive",
              backgroundColor: "#ea0000",
              borderColor: "rgba(202, 0, 0, 0)",
              data: resultsSorted.map(x => x.data.features[0].attributes.Positive)
            },
            {
              label: "Hospitalized",
              backgroundColor: "yellow",
              borderColor: "rgba(202, 0, 0, 0)",
              data: resultsSorted.map(x => x.data.features[0].attributes.Hospitalized)
            },
            {
              label: "Deaths",
              backgroundColor: "black",
              borderColor: "rgba(202, 0, 0, 0)",
              data: resultsSorted.map(x => x.data.features[0].attributes.Deaths)
            }
          ]
        }
    },
    percentChange: function percentChange(val1 = 0, val2) {
      let percent = ((val1 - val2) / val1 ) * 100
      if(percent > 0){
        return `<span class="text-danger">+${(percent).toFixed(0)}%</span>`;
      }else if(percent == 0){
        return `${(percent).toFixed(0)}%`;
      }else{
        return `<span class="text-success">-${(percent).toFixed(0)}%</span>`;
      }
    },
    percentChangeNum: function percentChangeNum(val1 = 0, val2) {
      return  parseInt((((val1 - val2) / val1 ) * 100).toFixed(0));
    },
    compoundInterest(present_val,interest,times){
      var x=(1+interest/100)
      var future_val=present_val*(Math.pow(x,times))
      return parseInt(future_val.toFixed(0));
    }
  },
  metaInfo() {
    return {
      meta: [
          // Twitter Card
          {name: 'twitter:card', content: 'summary'},
          {name: 'twitter:title', content: 'Florida COVID-19 Tracker'},
          {name: 'twitter:description', content: 'Track the spread in your florida county.'},
          // image must be an absolute path
          {name: 'twitter:image', content: this.logo},
          // Facebook OpenGraph
          {property: 'og:title', content: 'Florida COVID-19 Tracker'},
          {property: 'og:site_name', content: 'flacoronavirustracker.com'},
          {property: 'og:type', content: 'website'},
          {property: 'og:image', content:  this.logo},
          {property: 'og:description', content: 'Track the spread in your florida county.'}
      ]
    }
  }
};
</script>

<style>
@media only screen and (min-width: 768px){
.text-right-desktop {
    text-align: right;
}
}
.ranking {
  height: 32px;
  min-width: 1%;
  display: inline-block;
}

.count {
  min-width: 50px;
  padding-right: 5px;
  display: inline-block;
  font-weight: bold;
  text-align: right;
  font-size: 18px;
}

.rank-list {
  max-height: 375px;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 1rem 0.66rem;
  margin-bottom: 1rem;
}

.rank-list .item {
  padding: 5px 0;
  display: flex;
}
.col-name {width: 33%; overflow:hidden; text-overflow: ellipsis;}
.col-cnt {flex-grow: 1; padding: 0 5px;}
.col-capital {width: 60px;}

.rank-list .item:nth-child(1) .teamname {
  font-size: 150%;
  font-weight: 700;
}

.rank-list .item:nth-child(2) .teamname {
  font-size: 120%;
  font-weight: 600;
}

.active {
  outline: solid 3px #00bc8c !important;
}

.item:hover {
  cursor: pointer;
  outline: solid 3px #00bc8c4f;
}

.percentChange{
  display: flex;
  justify-content: space-between;
  font-size: 12px;
}
@media only screen and (min-width: 768px){
  .percentChange{
  padding: 0 77px  0 2rem;
}
}
.fa-2x,
.fa-3x{
  line-height: 1;
}
.fa-1x{
  font-size: 1rem;
}
/* .trend-label::before {
  content: "....";
  color: blue;
  padding-right: 1.5rem;
  font-size: 2rem;
  display: inline-block;
  transform: rotate(-33deg) translate(14px, 1px);
}

.trend-label {
  font-size: 12px;
} */
.list-group .row{
  line-height: 1.45;
  display: flex;
  align-items: center;
}
.list-group{
  margin-bottom: 0;
}
.text-danger{
  color: #E74C3C ;
}
        .padded {
            padding: 0.75rem 0.55rem;
        }

        .text-primary {
            color: #ce0a07;
        }

        .background-primary {
            background-color: #ce0a07;
            color: white;
        }

        .background-secondary {
            background-color: #008865 !important;
            color: white;
        }

        .badge {
            display: inline-block;
            min-width: 10px;
            padding: 3px 7px;
            /* font-size: 16px; */
            font-weight: 700;
            color: #fff;
            line-height: 1;
            vertical-align: middle;
            white-space: nowrap;
            text-align: center;
            background-color: #ce0a07;
            border-radius: 5px;
        }

        .flex {
            display: flex;
        }

        .solid-bk {
            background-color: #303030;
            padding: 1rem;
            /* border-radius: 5px; */
        }

        .text-white {
            color: white;
            text-shadow: 0px 0px 7px black;
        }

        h1 {
            font-size: 2rem !important;
            background-color: #303030;
            display: inline-block;
            padding: 5px 7px !important;
        }

        hr {
            border-top: 1px solid rgba(253, 253, 253, 0.42);
        }
</style>
