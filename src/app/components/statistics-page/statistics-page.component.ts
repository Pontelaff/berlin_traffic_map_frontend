import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { ChartStackedEvents } from './chart-types/chart-stacked-events';
import { ChartStackedDuration } from './chart-types/chart-stacked-duration';
import { ChartRadarEvents } from './chart-types/chart-radar-events';
import { ChartBubbleEvents } from './chart-types/chart-bubble-events';

interface chartSelect {
  selector: number;
  viewValue: string;
  chart: any;
  data: any[];
}

@Component({
  selector: 'app-statistics-page',
  templateUrl: './statistics-page.component.html',
  styleUrls: ['./statistics-page.component.css']
})
export class StatisticsPageComponent implements OnInit {

  minDate = new Date(2016, 4, 10);     //should be first relevant date in the past, TODO Query
  maxDate = new Date(2024, 8, 10);     //should be last relevant date in the future, TODO Query

  queriesCompleted: number;

  currDateStart = new Date();
  currDateEnd = new Date();

  allDistricts: string[] = ["Mitte", "Friedrichshain-Kreuzberg", "Pankow", "Charlottenburg-Wilmersdorf", "Spandau", "Steglitz-Zehlendorf", 
                          "Tempelhof-Schöneberg", "Neukölln", "Treptow-Köpenick", "Marzahn-Hellersdorf", "Lichtenberg", "Reinickendorf"];
  allEvents: string[] = ["Bauarbeiten", "Baustelle", "Fahrstreifensperrung","Gefahr", "Sperrung", "Störung", "Unfall"];
  relevantEvents: string[] = ["Baustelle", "Fahrstreifensperrung", "Gefahr", "Sperrung", "Unfall"];
  eventsToRelevantMap: number[] = [0, 0, 1, 2, 3, 2, 4];


  allTimeSteps: number[] = [0, 2, 4, 8, 16];

  chart: any;

  chartList: chartSelect[] = [
    {selector: 0, viewValue: 'Farbdiagramm: Störungsdauer', chart: null, data: [[], [], [], [], []]},
    {selector: 1, viewValue: 'Farbdiagramm: Störungsarten', chart: null, data: [[], [], [], [], []]},
    {selector: 2, viewValue: 'Radardiagramm: Störungsvorkommen', chart: null, data: [[], [], [], [], []]},
    {selector: 3, viewValue: 'Blasendiagramm: Störungsarten', chart: null, data: [[[], [], [], [], []], [[], [], [], [], []]]}    //three dimensional array to store both occurences and durations, I know it's ugly but it'll do for now
  ];

  selection: any;

  selectedChartIndex: number;
  cachedChartIndex: number;


  constructor(private apiService: ApiService) { }

  ngOnInit(): void {

    this.currDateStart = new Date(2020, 3, 1);
    this.currDateEnd = new Date(2020, 6, 1);


    for(let idx = 0; idx < this.chartList[1].data.length; idx++)
    {
      this.chartList[1].data[idx].length = this.allDistricts.length;
      this.chartList[1].data[idx].fill(0);
    }

    this.queriesCompleted = 0;
  }

  userClick() {
    if(this.selectedChartIndex == undefined){
      console.log("No chart selected");
      return;
    }

    // console.log("Start: " + this.currDateStart.toISOString().slice(0, 10));
    // console.log("End: " + this.currDateEnd.toISOString().slice(0, 10));

    if(this.selectedChartIndex != this.cachedChartIndex){     //only create new chart if type doesn't match currently displayed one
      this.cachedChartIndex = this.selectedChartIndex;        //update currently displayed chart index
      if(this.selection != undefined)         //destroy chart if doesn't exist
        this.selection.chart.destroy();
      this.createChart(this.selectedChartIndex);
    }

    this.clearChartData(this.selectedChartIndex);
    this.makeData();
  }

  createChart(chartIndex: number)
  {
    this.selection = this.chartList[chartIndex];
    let ctx = document.getElementById('canvas') as HTMLCanvasElement;    //get html context

    switch(chartIndex)
    {
      case 0: { this.selection.chart = new ChartStackedDuration(ctx, this.allDistricts, this.relevantEvents, this.allTimeSteps); break; }
      case 1: { this.selection.chart = new ChartStackedEvents(ctx, this.allDistricts, this.relevantEvents, this.allTimeSteps); break; }
      case 2: { this.selection.chart = new ChartRadarEvents(ctx, this.allDistricts, this.relevantEvents, this.allTimeSteps); break; }
      case 3: { this.selection.chart = new ChartBubbleEvents(ctx, this.allDistricts, this.relevantEvents, this.allTimeSteps); break; }
      default: { console.log("Chart creation not available"); break; }
    }    

    this.selection.chart.create();
  }

  makeData()
  {
    let startString = this.currDateStart.toISOString().slice(0, 10);
    let endString = this.currDateEnd.toISOString().slice(0, 10);

    if(this.selectedChartIndex < 0 || this.selectedChartIndex > 3)
    {
      console.log("Selection invalid");
      return;
    }

    this.updateRoutineDistrictData(startString, endString, this.selectedChartIndex); 
  }

  clearChartData(chartIdx: number)
  {
    let container = this.chartList[this.selectedChartIndex].data;

    if(chartIdx == 3) //bubble chart needs special treatment due to being this abomination of a 3D array
    {
      for(let topIdx = 0; topIdx < container.length; topIdx++)
      {
        for(let idx = 0; idx < container[topIdx].length; idx++)
        {
          container[topIdx][idx].length = this.allDistricts.length;
          container[topIdx][idx].fill(0);
        }
      }

      return;
    }

    for(let idx = 0; idx < this.chartList[this.selectedChartIndex].data.length; idx++)
    {
      this.chartList[this.selectedChartIndex].data[idx].length = this.allDistricts.length;
      this.chartList[this.selectedChartIndex].data[idx].fill(0);
    }
  }

  updateSelected()
  {
    if(this.queriesCompleted != this.allDistricts.length)
      return;
    
    this.selection.chart.update(this.chartList[this.selectedChartIndex].data);
  }

  updateRoutineDistrictData(start: string, end: string, chartIdx: number)
  {
    this.queriesCompleted = 0;

    for(let districtIdx = 0; districtIdx < this.allDistricts.length; districtIdx++)
    {
      this.apiService.fetchTimeframeFromDistrict(start, end, this.allDistricts[districtIdx]).subscribe((data:any[])=>{

        let container = this.chartList[this.selectedChartIndex].data;

        if(chartIdx == 0)
          this.arrangeTimeSpanData(data, districtIdx);
          
        if(chartIdx == 1 || chartIdx == 2)
          this.arrangeOccurenceData(data, districtIdx, chartIdx);
        
        if(chartIdx == 3)
          this.arrangeBubbleChartData(data, districtIdx);

        this.queriesCompleted++;
        this.updateSelected(); 
      });
    }
  }

  arrangeTimeSpanData(data, districtIdx)
  {
    let container = this.chartList[0].data;

    data.forEach(entry => {
      for(let timeIdx = 0; timeIdx < this.allTimeSteps.length; timeIdx++)
      {
        let dateFrom = entry.validities[0].timeFrom;
        let dateTo = entry.validities[0].timeTo;
        let diffDays = this.calculateTimespanInDays(new Date(dateFrom), new Date(dateTo));

        if(timeIdx == this.allTimeSteps.length - 1)
        {
          container[timeIdx][districtIdx]++;
          break;
        }

        if(diffDays >= this.allTimeSteps[timeIdx] && diffDays < this.allTimeSteps[timeIdx + 1])
        {
          container[timeIdx][districtIdx]++;
          break;
        }
      }
    });
  }

  arrangeOccurenceData(data, districtIdx, chartIdx)
  {
    let container = this.chartList[chartIdx].data;

    data.forEach(entry => {
      for(let eventIdx = 0; eventIdx < this.allEvents.length; eventIdx++)
      {
        if(this.allEvents[eventIdx] == entry.consequence.summary)
        {
          let relevantIdx = this.eventsToRelevantMap[eventIdx];
          container[relevantIdx][districtIdx]++;
        }
      }
    });
  }

  arrangeBubbleChartData(data: any, districtIdx: number)
  {
    let container = this.chartList[3].data;

    data.forEach(entry => {
      for(let eventIdx = 0; eventIdx < this.allEvents.length; eventIdx++)
      {
        if(this.allEvents[eventIdx] == entry.consequence.summary)
        {
          let relevantIdx = this.eventsToRelevantMap[eventIdx];
          container[0][relevantIdx][districtIdx]++;

          let dateFrom = entry.validities[0].timeFrom;
          let dateTo = entry.validities[0].timeTo;
          let diffMinutes = this.calculateTimespanInMinutes(new Date(dateFrom), new Date(dateTo));
          container[1][relevantIdx][districtIdx] += diffMinutes;
        }
      }
    });
  }

  calculateTimespanInDays(start: Date, end: Date)
  {
    let diff = this.calculateTimespanInMS(start, end);
    let diffDays = Math.ceil(diff / (1000 * 3600 * 24)); 
    return diffDays;
  }

  calculateTimespanInMinutes(start: Date, end: Date)
  {
    let diff = this.calculateTimespanInMS(start, end);
    let diffMinutes = Math.ceil(diff / (1000 *60));
    return diffMinutes;
  }

  calculateTimespanInMS(start: Date, end: Date)
  {
    return Math.abs(end.getTime() - start.getTime());
  }
}
