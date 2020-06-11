import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import * as Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { element } from 'protractor';
import { start } from 'repl';
import { cloneDeep } from 'lodash';
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
  allEvents: string[] = ["Bauarbeiten", "Baustelle", "Fahrstreifensperrung","Gefahr", "Sperrung", "Stau", "Störung", "Unfall"];

  chart: any;

  chartList: chartSelect[] = [
    {selector: 0, viewValue: 'Farbdiagramm: Störungsdauer', chart: null, data: [0, 0, 0, 0, 0, 0, 0, 0]},
    {selector: 1, viewValue: 'Farbdiagramm: Störungsarten', chart: null, data: [[], [], [], [], [], [], [], []]},
    {selector: 2, viewValue: 'Radardiagramm: Störungsvorkommen', chart: null, data: [[], [], [], [], [], [], [], []]},
    {selector: 3, viewValue: 'Blasendiagramm: Störungsarten', chart: null, data: []}
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

    console.log("Start: " + this.currDateStart.toISOString().slice(0, 10));
    console.log("End: " + this.currDateEnd.toISOString().slice(0, 10));

    if(this.selectedChartIndex != this.cachedChartIndex){     //only create new chart if type doesn't match currently displayed one
      this.cachedChartIndex = this.selectedChartIndex;        //update currently displayed chart index
      this.createChart(this.selectedChartIndex);
    }

    this.clearSelectionData();
    this.makeData();
  }

  createChart(chartIndex: number)
  {
    this.selection = this.chartList[chartIndex];
    let ctx = document.getElementById('canvas') as HTMLCanvasElement;    //get html context

    switch(chartIndex)
    {
      case 0: { this.selection.chart = new ChartStackedDuration(ctx, this.allDistricts, this.allEvents); break; }
      case 1: { this.selection.chart = new ChartStackedEvents(ctx, this.allDistricts, this.allEvents); break; }
      case 2: { this.selection.chart = new ChartRadarEvents(ctx, this.allDistricts, this.allEvents); break; }
      case 3: { this.selection.chart = new ChartBubbleEvents(ctx, this.allDistricts, this.allEvents); break; }
      default: { console.log("Chart creation not available"); break; }
    }    

    this.selection.chart.create();
  }

  makeData()
  {
    let startString = this.currDateStart.toISOString().slice(0, 10);
    let endString = this.currDateEnd.toISOString().slice(0, 10);

    switch(this.selectedChartIndex)
    {
      case 0: {
        console.log("Chart update not available");
        break;
      }
      case 1: {
        this.updateRoutineDistrictData(startString, endString);
        break;
      }
      case 2: {
        console.log("Chart update not available");
        break;
      }
      case 3: {
        console.log("Chart update not available");
        break;
      }
      default: {
        console.log("Chart update not available");
        break;
      }
    }    
  }

  clearSelectionData()
  {
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

    this.selection.chart.update(this.chartList[this.selectedChartIndex].data)
  }

  updateRoutineDistrictData(start: string, end: string)
  {
    this.queriesCompleted = 0;

    for(let districtIdx = 0; districtIdx < this.allDistricts.length; districtIdx++)
    {
      this.apiService.fetchTimeframeFromDistrict(start, end, this.allDistricts[districtIdx]).subscribe((data:any[])=>{

        data.forEach(entry => {
          for(let eventIdx = 0; eventIdx < this.allEvents.length; eventIdx++)
          {
            if(this.allEvents[eventIdx] == entry.consequence.summary)
            this.chartList[this.selectedChartIndex].data[eventIdx][districtIdx]++;
          }
        });
        this.queriesCompleted++;
        this.updateSelected(); 
      });
    }
  }
}
