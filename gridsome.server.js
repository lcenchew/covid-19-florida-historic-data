// Server API makes it possible to hook into various parts of Gridsome
// on server-side and add custom data to the GraphQL data layer.
// Learn more: https://gridsome.org/docs/server-api/

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`
const axios = require("axios");
const slugify = require('slugify');
// const fs = require('fs');
const csvParse = require('csv-parse/lib/sync');
const path = require('path')
const fs = require('fs-extra')
var globby = require("globby")

module.exports = function (api) {
  api.loadSource(async ({ addCollection, store }) => {
    // Use the Data Store API here: https://gridsome.org/docs/data-store-api/
    var Dataset = addCollection('datasets');
    var County = addCollection('county');
    var Timeframe = addCollection('timeframe');

    const absPath = path.join(__dirname, './static/data/counties.json')
    const data = await fs.readFile(absPath, 'utf-8');
    const records = JSON.parse(data);
    for (const node of records) {
      await County.addNode({
        COUNTYNAME: node.COUNTYNAME
      })
    }


    const paths = await globby(['./static/data/2020**.json']);

    // save the dates first
    for (const filePath of paths) {
      const pathParts = filePath.split("/")
      const thisDateFile = pathParts[pathParts.length - 1]
      const thisDate = thisDateFile.substring(0, thisDateFile.length - 5)
      await Timeframe.addNode({
        timeframe: thisDate,
      })
    }

    // Now add county info and relate to dates
    for (const filePath of paths) {

      const absFilePath = path.join(__dirname, filePath)
      const pathParts = filePath.split("/")
      const thisDateFile = pathParts[pathParts.length - 1]
      const thisDate = thisDateFile.substring(0, thisDateFile.length - 5)
      const data = await fs.readFile(absFilePath, 'utf-8');
      const records = JSON.parse(data);

      // console.log(records.features);
      if (records.features) {
        for (const node of records.features) {
            // let ratioNum = null;
            // if (node.g ==="Total" && parseInt(node.ec) >= 1 && parseInt(node.Teacher_Count) >=1) {
            //   ratioNum = Math.round(parseInt(node.ec) / parseInt(node.Teacher_Count))
            //  }
            await Dataset.addNode({
              title: thisDate+"-"+node.attributes.COUNTYNAME,
              timeframe: thisDate,
              COUNTYNAME: node.attributes.COUNTYNAME,
              // OBJECTID_12_13: node.attributes.OBJECTID_12_13,
              // OBJECTID: node.attributes.OBJECTID,
              DEPCODE: node.attributes.DEPCODE,
              COUNTY: node.attributes.COUNTY,
              COUNTYNAME: node.attributes.COUNTYNAME,
              // DATESTAMP: node.attributes.DATESTAMP,
              // ShapeSTAre: node.attributes.ShapeSTAre,
              // ShapeSTLen: node.attributes.ShapeSTLen,
              OBJECTID_1: node.attributes.OBJECTID_1,
              County_1: node.attributes.County_1,
              State: node.attributes.State,
              OBJECTID_12: node.attributes.OBJECTID_12,
              DEPCODE_1: node.attributes.DEPCODE_1,
              COUNTYN: node.attributes.COUNTYN,
              PUIsTotal: node.attributes.PUIsTotal,
              Age_0_9: node.attributes.Age_0_9,
              Age_10_19: node.attributes.Age_10_19,
              Age_20_29: node.attributes.Age_20_29,
              Age_30_39: node.attributes.Age_30_39,
              Age_40_49: node.attributes.Age_40_49,
              Age_50_59: node.attributes.Age_50_59,
              Age_60_69: node.attributes.Age_60_69,
              Age_70_79: node.attributes.Age_70_79,
              Age_80plus: node.attributes.Age_80plus,
              Age_Unkn: node.attributes.Age_Unkn,
              PUIAgeRange: node.attributes.PUIAgeRange,
              PUIAgeAvrg: node.attributes.PUIAgeAvrg,
              PUIFemale: node.attributes.PUIFemale,
              PUIMale: node.attributes.PUIMale,
              PUISexUnkn: node.attributes.PUISexUnkn,
              PUIFLRes: node.attributes.PUIFLRes,
              PUINotFLRes: node.attributes.PUINotFLRes,
              PUIFLResOut: node.attributes.PUIFLResOut,
              PUITravelNo: node.attributes.PUITravelNo,
              PUITravelUnkn: node.attributes.PUITravelUnkn,
              PUITravelYes: node.attributes.PUITravelYes,
              PUIED_NO: node.attributes.PUIED_NO,
              PUIED_NoData: node.attributes.PUIED_NoData,
              PUIED_Yes: node.attributes.PUIED_Yes,
              PUIHosp_No: node.attributes.PUIHosp_No,
              PUIHosp_Nodata: node.attributes.PUIHosp_Nodata,
              PUIHosp_Yes: node.attributes.PUIHosp_Yes,
              FLResDeaths: node.attributes.FLResDeaths,
              PUILab_Yes: node.attributes.PUILab_Yes,
              TPositive: node.attributes.TPositive,
              TNegative: node.attributes.TNegative,
              TInconc: node.attributes.TInconc,
              TPending: node.attributes.TPending,
              PUIContNo: node.attributes.PUIContNo,
              PUIContUnkn: node.attributes.PUIContUnkn,
              PUIContYes: node.attributes.PUIContYes,
              CasesAll: node.attributes.CasesAll,
              C_Men: node.attributes.C_Men,
              C_Women: node.attributes.C_Women,
              C_TravelYes: node.attributes.C_TravelYes,
              C_TravelNo: node.attributes.C_TravelNo,
              C_TravelUnkn: node.attributes.C_TravelUnkn,
              C_FLRes: node.attributes.C_FLRes,
              C_NotFLRes: node.attributes.C_NotFLRes,
              C_FLResOut: node.attributes.C_FLResOut,
              C_AllResType: node.attributes.C_AllResType,
              T_NegRes: node.attributes.T_NegRes,
              T_NegNotFLRes: node.attributes.T_NegNotFLRes,
              T_PendRes: node.attributes.T_PendRes,
              T_PendNotRes: node.attributes.T_PendNotRes,
              T_total: node.attributes.T_total,
              T_negative: node.attributes.T_negative,
              T_pending: node.attributes.T_pending,
              T_positive: node.attributes.T_positive,
              FLandNonFLDeaths: node.attributes.FLandNonFLDeaths,
              NonFLDeaths: node.attributes.NonFLDeaths,
              EverMon: node.attributes.EverMon,
              MonNow: node.attributes.MonNow,
              // teacher_count: parseInt(node.Teacher_Count),
              date: store.createReference('timeframe', thisDate),
              location: store.createReference('county', node.attributes.COUNTYNAME)
              })
        }
      }

    }

  })

  api.createPages(({ createPage }) => {
    // Use the Pages API here: https://gridsome.org/docs/pages-api/
  })
}
