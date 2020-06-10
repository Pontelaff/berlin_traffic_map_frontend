import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { ApiService } from 'src/app/api.service';
import { element } from 'protractor';
import { start } from 'repl';
import { cloneDeep } from 'lodash';

interface chartSelect {
  selector: number;
  viewValue: string;
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

  trafficData = [];
  districtData: any;
  queriesCompleted: number;

  currDateStart = new Date();
  currDateEnd = new Date();

  allDistricts: string[] = ["Mitte", "Friedrichshain-Kreuzberg", "Pankow", "Charlottenburg-Wilmersdorf", "Spandau", "Steglitz-Zehlendorf", 
                          "Tempelhof-Schöneberg", "Neukölln", "Treptow-Köpenick", "Marzahn-Hellersdorf", "Lichtenberg", "Reinickendorf"];
  allEvents: string[] = ["Bauarbeiten", "Baustelle", "Fahrstreifensperrung","Gefahr", "Sperrung", "Stau", "Störung", "Unfall"];

  chart: any;
  chartCreated: boolean;

  chartList: chartSelect[] = [
    {selector: 0, viewValue: 'Dummy Chart', data: [0, 0, 0, 0, 0, 0, 0, 0]},
    {selector: 1, viewValue: 'Chart 2', data: [[], [], [], [], [], [], [], []]},
    {selector: 2, viewValue: 'Chart 3', data: []},
    {selector: 3, viewValue: 'Chart 4', data: []}
  ];

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
      if(this.chart != undefined)           //destroy chart if don't exist
        this.chart.destroy();
      this.createChart(this.selectedChartIndex);
    }

    this.makeData();
  }

  createChart(chartIndex: number)
  {
    switch(chartIndex)
    {
      case 0: {
        this.createPreliminaryChart(); 
        break;
      }
      case 1: {
        this.createStackedChartEvents(); 
        break;
      }
      default: {
        console.log("Chart creation not available");
        break;
      }
    }    
  }

  makeData()
  {
    let startString = this.currDateStart.toISOString().slice(0, 10);
    let endString = this.currDateEnd.toISOString().slice(0, 10);

    switch(this.selectedChartIndex)
    {
      case 0: {
        this.apiService.fetchFromTo(startString, endString).subscribe((data:any[])=>{ 
          this.trafficData = data;
          this.updatePreliminaryChart();    
        });
        break;
      }
      case 1: {
        /*clear data array*/
        for(let idx = 0; idx < this.chartList[this.selectedChartIndex].data.length; idx++)
        {
          this.chartList[this.selectedChartIndex].data[idx].length = this.allDistricts.length;
          this.chartList[this.selectedChartIndex].data[idx].fill(0);
        }
        this.queriesCompleted = 0;

        for(let districtIdx = 0; districtIdx < this.allDistricts.length; districtIdx++)
        {
          this.apiService.fetchTimeframeFromDistrict(startString, endString, this.allDistricts[districtIdx]).subscribe((data:any[])=>{

            data.forEach(entry => {
              for(let eventIdx = 0; eventIdx < this.allEvents.length; eventIdx++)
              {
                if(this.allEvents[eventIdx] == entry.consequence.summary)
                this.chartList[this.selectedChartIndex].data[eventIdx][districtIdx]++;
              }
            });

            this.queriesCompleted++;
            this.updateStackedEventsChart(); 
          });
        }
        break;
      }
      default: {
        console.log("Chart update not available");
        break;
      }
    }    
  }

  updateStackedEventsChart()
  {
    /*only exectute if all queries have been completed*/
    if(this.queriesCompleted != this.allDistricts.length)
      return;

    console.log(this.chartList[this.selectedChartIndex].data);

    /*get total amount of occurences per district*/
    let totalPerDistrict = [];
    totalPerDistrict.length = this.allDistricts.length;
    totalPerDistrict.fill(0);
    for(let idx = 0; idx < totalPerDistrict.length; idx++)
    {
      this.chartList[this.selectedChartIndex].data.forEach(element => {
        totalPerDistrict[idx] += element[idx];
      });
    }

    console.log(totalPerDistrict);

    /*create deep copy without references*/
    let chartData = cloneDeep(this.chartList[this.selectedChartIndex].data);

    /*convert absolutes to relatives*/    
    for(let districtIdx = 0; districtIdx < totalPerDistrict.length; districtIdx++)
    {
      for(let eventIdx = 0; eventIdx < this.allEvents.length; eventIdx++)
      {
        if(totalPerDistrict[districtIdx] != 0)
        chartData[eventIdx][districtIdx] /= totalPerDistrict[districtIdx];
      }
    }

    console.log(chartData);

    /*create rgb value strings*/
    let colorList:string[][] = [[], [], [], [], [], [], [], []];

    for(let topIdx = 0; topIdx < colorList.length; topIdx++)      //iterate through district-level
    {
      let element = colorList[topIdx];
      element.length = this.allDistricts.length;
      element.fill('rgba(256, 256, 256, 1)');
      for(let subIdx = 0; subIdx < element.length; subIdx++)    //iterate through event-level
      {
        let saturation = 256 - 256 * chartData[topIdx][subIdx];
        element[subIdx] = 'rgba( ' + saturation + ', ' + saturation + ', ' + saturation + ', 1)';
      }
    }

    /*update Chart*/   
    for(let iter = 0; iter < colorList.length; iter++)
    {
      let element = colorList[iter];
      this.chart.data.datasets[iter].backgroundColor = element;
    }

    this.chart.update();
    this.logChartUpdate(this.selectedChartIndex);
  }

  updatePreliminaryChart()
  {
    this.chartList[this.selectedChartIndex].data.fill(0);      //reset occurences
    
    let index = 0;
    this.trafficData.forEach(entry => {   //get occurences per event type
      this.allEvents.forEach(event => {
        if(event == entry.consequence.summary){
          this.chartList[this.selectedChartIndex].data[index]++;
        }
        else {
          index++;
        }
      });
      index = 0;
    });

    this.chart.update();
    this.logChartUpdate(this.selectedChartIndex);
  }

  createStackedChartEvents()
  {
    this.logChartCreation(this.selectedChartIndex);

    /*create default saturation values*/
    let avalue = 0.5;
    let offset = 0.05;
    let index = 0;
    this.chartList[this.selectedChartIndex].data.forEach(element => {     //iterate through district-level
      
      element.length = this.allDistricts.length;
      element.fill(0);
      for(let iter = 0; iter < element.length; iter++)      //iterate through event-level
      {
        element[iter] = avalue;
        avalue += offset;
        if(avalue > 1 - offset || avalue < -offset)
        offset *= -1;
      }
    });

    /*create default rgb value strings*/
    let colorList:string[][] = [[], [], [], [], [], [], [], []];
    let vList: any = this.chartList[this.selectedChartIndex].data;    //list of values, used as an alias to avoid lengthy lines

    for(let topIdx = 0; topIdx < colorList.length; topIdx++)    //iterate through district-level
    {
      let element = colorList[topIdx];
      element.length = this.allDistricts.length;
      element.fill('rgba(256, 256, 256, 1)');
      for(let subIdx = 0; subIdx < element.length; subIdx++)     //iterate through event-level
        element[subIdx] = 'rgba( ' + 256 * vList[topIdx][subIdx] + ', ' + 256 * vList[topIdx][subIdx] + ', ' + 256 * vList[topIdx][subIdx] + ', 1)';    //apply saturation
    }

    /*create uniform data*/
    let uniformData:number[] = [];
    uniformData.length = this.allDistricts.length;
    uniformData.fill(1);

    /*create chart*/
    var ctx = document.getElementById('canvas');    //get html context
    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.allDistricts,
        datasets: [
          { 
            data: uniformData,
            backgroundColor: colorList[0]
          },
          { 
            data: uniformData,
            backgroundColor: colorList[1]
          },
          { 
            data: uniformData,
            backgroundColor: colorList[2]
          },
          { 
            data: uniformData,
            backgroundColor: colorList[3]
          },
          { 
            data: uniformData,
            backgroundColor: colorList[4]
          },
          { 
            data: uniformData,
            backgroundColor: colorList[5]
          },
          { 
            data: uniformData,
            backgroundColor: colorList[6]
          },
          { 
            data: uniformData,
            backgroundColor: colorList[7]
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            stacked: true,
            display: true
          }],
          yAxes: [{
            ticks: {  //set custom label
              max: 8,
              min: 0,
              stepSize: 0.5,
              callback: function(value, index, values) {
                switch (value) {
                  case 0.5:
                      return 'Bauarbeiten';
                  case 1.5:
                      return 'Baustelle';
                  case 2.5:
                      return 'Fahrstreifensperrung';
                  case 3.5:
                      return 'Gefahr';
                  case 4.5:
                      return 'Sperrung';
                  case 5.5:
                      return 'Stau';
                  case 6.5:
                      return 'Störung';
                  case 7.5:
                      return 'Unfall';
                  default:
                      return null;
                }
              }
            },
            stacked: true
          }],
        }
      }
    });
  }

  createPreliminaryChart()
  {
    this.logChartCreation(this.selectedChartIndex);

    var ctx = document.getElementById('canvas');    //get html context
    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.allEvents,
        datasets: [
          { 
            data: this.chartList[this.selectedChartIndex].data,
            backgroundColor: 'rgba(0, 0, 0, 0.5',
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            display: true
          }],
          yAxes: [{
            display: true
          }],
        }
      }
    });
  }

  logChartCreation(chartIndex: number)
  {
    console.log("Creating " + this.chartList[chartIndex].viewValue);
  }

  logChartUpdate(chartIndex: number)
  {
    console.log(this.chartList[chartIndex].viewValue + " updated");
  }
}
