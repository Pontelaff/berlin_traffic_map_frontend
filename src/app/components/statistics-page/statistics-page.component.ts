import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { ChartStackedEvents } from './chart-types/chart-stacked-events';
import { ChartStackedDuration } from './chart-types/chart-stacked-duration';
import { ChartRadarEvents } from './chart-types/chart-radar-events';
import { ChartBubbleEvents } from './chart-types/chart-bubble-events';

import * as Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

interface chartSelect {
  selector: number;
  viewValue: string;
  chart: any;
}

@Component({
  selector: 'app-statistics-page',
  templateUrl: './statistics-page.component.html',
  styleUrls: ['./statistics-page.component.css']
})
export class StatisticsPageComponent implements OnInit {

  minDate = new Date(2010, 0, 1);     //should be first relevant date in the past, TODO Query
  maxDate = new Date(2029, 11, 31);     //should be last relevant date in the future, TODO Query
  currDateStart = new Date();
  currDateEnd = new Date();

  allDistricts: string[] = ["Mitte", "Friedrichshain-Kreuzberg", "Pankow", "Charlottenburg-Wilmersdorf", "Spandau", "Steglitz-Zehlendorf", 
                            "Tempelhof-Schöneberg", "Neukölln", "Treptow-Köpenick", "Marzahn-Hellersdorf", "Lichtenberg", "Reinickendorf"];
  allEvents: string[] = ["Bauarbeiten", "Baustelle", "Fahrstreifensperrung","Gefahr", "Sperrung", "Störung", "Unfall"];
  allTimeSteps: number[] = [0, 2, 4, 8, 16];
  
  chartList: chartSelect[] = [
    {selector: 0, viewValue: 'Farbdiagramm: Störungsdauer', chart: null},
    {selector: 1, viewValue: 'Farbdiagramm: Störungsarten', chart: null},
    {selector: 2, viewValue: 'Radardiagramm: Störungsvorkommen', chart: null},
    {selector: 3, viewValue: 'Blasendiagramm: Störungsarten', chart: null},
    {selector: 4, viewValue: '[temp]', chart: null}
  ];
  selection: chartSelect;
  
  selectedChartIndex: number;
  cachedChartIndex: number;
  queriesCompleted: number;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void 
  {
    this.currDateStart = new Date(2020, 3, 1);
    this.currDateEnd = new Date(2020, 6, 1);

    this.queriesCompleted = 0;
  }

  userClick() 
  {
    if(this.selectedChartIndex == undefined)
    {
      console.log("No chart selected");
      return;
    }

    if(this.selectedChartIndex != this.cachedChartIndex)    //only create new chart if type doesn't match currently displayed one
    {    
      this.cachedChartIndex = this.selectedChartIndex;        //update currently displayed chart index
      if(this.selection != undefined)         //destroy chart if doesn't exist
        this.selection.chart.destroy();
      this.createChart(this.selectedChartIndex);
    }
    else
      this.selection.chart.clearData();
      
    this.makeData();
  }

  createDurationOverviewChart(ctx: any) 
  {

    let chartLabels: string[] = ["< 1 Tag", "< 1 Woche", "< 1 Monat", "< 1 Yar", "< 3 Jahre", "< 10 Jahre", ">= 10 Jahre"];
    let chartData: number[] = [5718, 455, 523, 443, 109, 24, 1];

    let chart = new Chart(ctx, {
      type: 'bar',
      plugins: [ChartDataLabels],
      data: {
        labels: chartLabels,
        datasets: [{
          data: chartData,
          label: "Zeitdauer-Vorkommen",
          backgroundColor: "rgb(0, 0, 0, 0.5)"
        }]
      }, 
      options: {
        plugins:{
          datalabels: {
            color: 'white'
          }
        },
        scales: {
          yAxes: [{
             type: 'logarithmic'
          }]
        }
      }
    });


    return chart;


  }

  createChart(chartIndex: number)
  {
    this.selection = this.chartList[chartIndex];
    let ctx = document.getElementById('canvas') as HTMLCanvasElement;    //get html context

    switch(chartIndex)
    {
      case 0: { this.selection.chart = new ChartStackedDuration(ctx, this.allDistricts, this.allEvents, this.allTimeSteps); break; }
      case 1: { this.selection.chart = new ChartStackedEvents(ctx, this.allDistricts, this.allEvents, this.allTimeSteps); break; }
      case 2: { this.selection.chart = new ChartRadarEvents(ctx, this.allDistricts, this.allEvents, this.allTimeSteps); break; }
      case 3: { this.selection.chart = new ChartBubbleEvents(ctx, this.allDistricts, this.allEvents, this.allTimeSteps); break; }
      case 4: { this.selection.chart = this.createDurationOverviewChart(ctx); break; }
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

    this.generalUpdateRoutine(startString, endString, this.selectedChartIndex); 
  }

  generalUpdateRoutine(start: string, end: string, chartIdx: number)
  {
    this.selection.chart.indicateBusy();

    this.queriesCompleted = 0;

    for(let districtIdx = 0; districtIdx < this.allDistricts.length; districtIdx++)
    {
      this.apiService.fetchTimeframeFromDistrict(start, end, this.allDistricts[districtIdx]).subscribe((data:any[])=>{
        
        this.selection.chart.addData(data, districtIdx);

        this.queriesCompleted++;
        this.updateSelected(); 
      });
    }
  }

  updateSelected()
  {
    if(this.queriesCompleted != this.allDistricts.length)
      return;
    
    this.selection.chart.update();
  }
}
