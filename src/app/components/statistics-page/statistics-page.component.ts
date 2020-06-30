import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { ChartStackedEvents } from './chart-types/chart-stacked-events';
import { ChartStackedDuration } from './chart-types/chart-stacked-duration';
import { ChartRadarEvents } from './chart-types/chart-radar-events';
import { ChartBubbleEvents } from './chart-types/chart-bubble-events';
import { InputChecker } from './inputChecker'


interface chartSelect {
  selector: number;
  viewValue: string;
  chart: any;
}

interface errorMsg {
  identifier: string;
  didOccur: boolean;
  message: string;
}

const timeSpanPrompt = "Angaben in Tagen";
const percentilePrompt = "Angaben in Prozent (≤ 100)";

@Component({
  selector: 'app-statistics-page',
  templateUrl: './statistics-page.component.html',
  styleUrls: ['./statistics-page.component.css']
})
export class StatisticsPageComponent implements OnInit {

  minDate = new Date(2010, 0, 1);
  maxDate = new Date(2029, 11, 31);
  currDateStart = new Date();
  currDateEnd = new Date();

  allDistricts: string[] = ["Mitte", "Friedrichshain-Kreuzberg", "Pankow", "Charlottenburg-Wilmersdorf", "Spandau", "Steglitz-Zehlendorf", 
                            "Tempelhof-Schöneberg", "Neukölln", "Treptow-Köpenick", "Marzahn-Hellersdorf", "Lichtenberg", "Reinickendorf"];
  allEvents: string[] = ["Bauarbeiten", "Baustelle", "Fahrstreifensperrung","Gefahr", "Sperrung", "Störung", "Unfall"];
  allTimeSteps: number[] = [0, 2, 4, 8, 16];
  allPercentiles: number[] = [20, 40, 60, 80, 100];
  customTimeStrides: any[] = [];
  isStrideFaulty: boolean[] = [];
  customTimeStridesAmount: number = 5;
  errorMessages: errorMsg[];
  inputChecker: InputChecker = new InputChecker();

  switches: any[] = [null, null];
  btnDurColor = "accent";
  btnPctColor = "white";
  cachedOpMode = 0;
  unitPrompt = timeSpanPrompt;
  
  chartList: chartSelect[] = [
    {selector: 0, viewValue: 'Störungsdauer (Farbe)', chart: null},
    {selector: 1, viewValue: 'Störungsarten (Farbe)', chart: null},
    {selector: 2, viewValue: 'Störungsarten (Radar)', chart: null},
    {selector: 3, viewValue: 'Störungsarten (Blasen)', chart: null}
  ];
  selection: chartSelect = null;
  
  selectedChartIndex: number;
  cachedChartIndex: number;
  queriesCompleted: number = 0;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void 
  {
    this.currDateStart = new Date();
    this.currDateEnd = new Date();

    /* set start date to two weeks ago */
    this.currDateStart.setHours(this.currDateEnd.getHours() - 24 * 14);

    /* determine min and max dates from database for date pickers */
    this.apiService.fetchFirstRelevantDate().subscribe((data:string)=>{
      this.minDate = new Date(data);
    });
    
    this.apiService.fetchLastRelevantDate().subscribe((data:string)=>{
      this.maxDate = new Date(data);
    });

    this.switches[0] = document.getElementById("btnDuration");
    this.switches[1] = document.getElementById("btnPercentile");

    this.errorMessages = this.inputChecker.errorMessages;
    this.customTimeStrides = this.allTimeSteps;
  }

  /* main button chart update routine */
  userPlot() 
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
      if(this.selectedChartIndex == 0)
      {
        this.userSwitch(0);
        this.customTimeStrides = this.allTimeSteps;
        this.inputChecker.resetStrideFaultyArr(this.customTimeStrides.length);
        this.inputChecker.clearErrorOccurences();
        this.isStrideFaulty = this.inputChecker.isStrideFaulty;
      }
    }
    else
      this.selection.chart.clearData();

    this.toggleYAxisConfig();
    this.makeData();
  }

  toggleYAxisConfig()
  {
    let container = document.getElementById("yAxisConf");
    if(this.selectedChartIndex == 0)
      container.style.display = "block";
    else
      container.style.display = "none";
  }
  
  /* needed for chart #1 input boxes to be able to remain focused after keypress */
  trackByFn(index, item) 
  {
    return index;  
  }

  setElementOpacity(ctx: string, opacity: string)
  {
    let element = document.getElementById(ctx);
    if(element != null)
    {
      element.style.opacity = opacity;
    }
  }

  showWarning(ctx: string)
  {
    this.setElementOpacity(ctx, "1.0");
  }

  hideWarning(ctx: string)
  {
    this.setElementOpacity(ctx, "0.0");
  }

  /* stride amount update routine */
  userSubmitAmount()
  {
    if(!this.checkAmountInput())
    {
      document.getElementById("warningText").style.display = "block";
      this.showWarning("warnAmount");
      return;
    }

    this.hideWarning("warnAmount");

    this.customTimeStrides.length = this.customTimeStridesAmount;

    if(this.cachedOpMode == 0)
    {
      this.customTimeStrides[0] = 0;

      for(let idx = 1; idx < this.customTimeStridesAmount; idx++)
      {
        this.customTimeStrides[idx] = Math.pow(2, idx);
      }
    }
    else
    {
      for(let idx = 0; idx < this.customTimeStridesAmount; idx++)
      {
        this.customTimeStrides[idx] = Math.round(((idx + 1) / this.customTimeStridesAmount) * 100);
      }
    }

    if(!this.checkStrides())
      console.log("unexpected behavior");
  }

  checkAmountInput()
  {
    /* check for non-numerical characters */
    if(!this.inputChecker.checkNumerical(this.customTimeStridesAmount)) {return false;}
    if(!this.inputChecker.checkPositive(this.customTimeStridesAmount)) {return false;}
    if(!this.inputChecker.checkWhole(this.customTimeStridesAmount)) {return false;}
    if(!this.inputChecker.checkRange(this.customTimeStridesAmount, 2, 10)) {return false;}

    return true;
  }

  /* stride values update routine */
  userSubmitStrides()
  {
    if(this.checkStrides())
      this.makeData();
  }

  checkStrides()
  {
    this.inputChecker.resetStrideFaultyArr(this.customTimeStrides.length);
    this.inputChecker.clearErrorOccurences();

    let stridesGood: boolean = this.inputChecker.checkStrideInput(this.customTimeStrides, this.cachedOpMode);
    if(!stridesGood)
    {
      this.isStrideFaulty = this.inputChecker.isStrideFaulty;

      document.getElementById("warningText").style.display = "block";
      this.refreshStrideWarnings();
      return false;
    }

    document.getElementById("warningText").style.display = "none";
    this.refreshStrideWarnings();

    return true;
  }

  refreshStrideWarnings()
  {
    for(let idx = 0; idx < this.isStrideFaulty.length; idx++)
    {
      if(this.isStrideFaulty[idx])
      {
        this.showWarning("warnStride_" + idx);
      }
      else
        this.hideWarning("warnStride_" + idx);
    }
  }

  /* chart #1 y Axis mode switch update routine */
  userSwitch(switchId: number)
  {
    if(switchId == 0)
    {
      this.btnDurColor = "accent";
      this.btnPctColor = "white";
      this.customTimeStrides = this.allTimeSteps;
      this.unitPrompt = timeSpanPrompt;
    }
    else
    {
      this.btnDurColor = "white";
      this.btnPctColor = "accent";
      this.customTimeStrides = this.allPercentiles;
      this.unitPrompt = percentilePrompt;
    }
    
    this.cachedOpMode = switchId;
    
    this.userSubmitAmount();
  }

  createChart(chartIndex: number)
  {
    this.selection = this.chartList[chartIndex];
    let ctx = document.getElementById('canvas') as HTMLCanvasElement;    //get html context

    switch(chartIndex)
    {
      case 0: { this.selection.chart = new ChartStackedDuration(ctx, this.allDistricts, this.allEvents); this.selection.chart.setOpMode(this.cachedOpMode); break; }
      case 1: { this.selection.chart = new ChartStackedEvents(ctx, this.allDistricts, this.allEvents); break; }
      case 2: { this.selection.chart = new ChartRadarEvents(ctx, this.allDistricts, this.allEvents); break; }
      case 3: { this.selection.chart = new ChartBubbleEvents(ctx, this.allDistricts, this.allEvents); break; }
      default: { console.log("unexpected behavior"); break; }
    }

    this.selection.chart.create();
  }

  makeData()
  {
    /* re-initialize date objects */
    this.currDateStart = new Date(this.currDateStart);
    this.currDateEnd = new Date(this.currDateEnd);
    
    /* adjust dates for timezone */
    this.currDateStart.setHours(this.currDateStart.getHours() + this.currDateStart.getTimezoneOffset() / -60);
    this.currDateEnd.setHours(this.currDateEnd.getHours() + this.currDateEnd.getTimezoneOffset() / -60);
    
    let startString = this.currDateStart.toISOString().slice(0, 10);    
    let endString = this.currDateEnd.toISOString().slice(0, 10);

    this.generalUpdateRoutine(startString, endString, this.selectedChartIndex); 
  }

  generalUpdateRoutine(start: string, end: string, chartIdx: number)
  {
    if(this.selectedChartIndex == 0)
    {
      this.selection.chart.setOpMode(this.cachedOpMode);
      this.selection.chart.setStrides(this.customTimeStrides);
    }
    else
    {
      this.customTimeStridesAmount = 5;
      this.customTimeStrides = this.allTimeSteps;
    }
        
    this.selection.chart.isLoading = true;
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
