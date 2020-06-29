import * as Chart from 'chart.js';
import { ChartStacked } from './chart-stacked'

const timeStepMode = 0;
const percentileMode = 1;

export class ChartStackedDuration extends ChartStacked {

  opMode: number = timeStepMode;
  yLabelDuration: string = "Störungsdauer in Tagen";
  yLabelPercentiles: string = "Störungsdauer in Perzentilen";


  containerSetup()
  {
    this.opMode = timeStepMode;
    this.data = this.initContainer2D(this.strides.length, this.allDistricts.length);
  }

  setOpMode(opModeIdx: number)
  {
    if(opModeIdx == 0)
      this.opMode = timeStepMode;
    else 
      this.opMode = percentileMode;
  }

  setStrides(data: number[])
  {
    this.strides = data;

    this.data = this.initContainer2D(this.strides.length, this.allDistricts.length);

    if(this.chart.data.datasets.length != this.strides.length)
      this.chart.data.datasets = this.createData(this.strides.length);
  }

  indicateBusy()
  {
    if(this.chartData.length == 0 )
      return;

    let busyColors:string[][] = this.createColorStrings(this.chartData.slice(0, this.strides.length), this.busySaturation);
    /*update Chart*/ 
    this.chart.options.scales.yAxes[0].ticks.max = this.strides.length;
    this.reconfigureYAxis();
    this.updateChart([], busyColors);
  }

  update()
  {
    this.updateRoutine(this.strides.length);
  }

  addData(incomingData: any, districtIdx: number)
  {
    if(this.opMode == timeStepMode)
      this.addTimeStepData(incomingData, districtIdx);
    else
      this.addPercentileData(incomingData, districtIdx);
      
    this.reconfigureYAxis();
  }

  addTimeStepData(incomingData: any, districtIdx: number)
  {
    incomingData.forEach(entry => {
      
      let dateFrom = entry.validities[0].timeFrom;
      let dateTo = entry.validities[0].timeTo;
      let diffDays = this.calculateTimespanInDays(new Date(dateFrom), new Date(dateTo));

      for(let timeIdx = 0; timeIdx < this.strides.length; timeIdx++)
      {
        if(timeIdx == this.strides.length - 1)
        {
          this.data[timeIdx][districtIdx]++;
          break;
        }

        if(diffDays >= this.strides[timeIdx] && diffDays < this.strides[timeIdx + 1])
        {
          this.data[timeIdx][districtIdx]++;
          break;
        }
      }
    });
  }

  addPercentileData(incomingData: any, districtIdx: number)
  {
    let allTimeSpans: number[] = [];
    let max = 0;


    for(let idx = 0; idx < incomingData.length; idx++)
    {
      let dateFrom = incomingData[idx].validities[0].timeFrom;
      let dateTo = incomingData[idx].validities[0].timeTo;
      let diffDays = this.calculateTimespanInDays(new Date(dateFrom), new Date(dateTo));
      allTimeSpans[idx] = diffDays;
    }

    max = this.determineMaximum1D(allTimeSpans, 0);

    allTimeSpans.forEach(timeSpan => {
      let percentile = timeSpan / max * 100;

      for(let pctIdx = 0; pctIdx < this.strides.length; pctIdx++)
      {
        if(percentile < this.strides[0])
        {
          this.data[pctIdx][districtIdx]++;
          break;
        }

        if(pctIdx == this.strides.length - 1)
        {
          this.data[pctIdx][districtIdx]++;
          break;
        }

        if(percentile >= this.strides[pctIdx] && percentile < this.strides[pctIdx + 1])
        {
          this.data[pctIdx][districtIdx]++;
          break;
        }
      }
    });
  }

  /* update y axis labeling methodology depending on opmode */
  reconfigureYAxis()
  {
    let strides = this.strides;
    if(this.opMode == timeStepMode)
    {
      this.chart.options.scales.yAxes[0].scaleLabel.labelString = this.yLabelDuration;
      this.chart.options.scales.yAxes[0].ticks.callback = function(value, index, values) {

        if(<number>value - Math.round(<number>value) == 0)
          return null;
          
        let label = "";
        let idx = Math.round(<number>value) - 1;

        if(idx == strides.length - 1)
        {
          label = strides[idx] + "+"
          return label;
        }

        label += strides[idx] + " - " + strides[idx + 1];
        return label;
      };
    }
    else
    {
      this.chart.options.scales.yAxes[0].scaleLabel.labelString = this.yLabelPercentiles;
      this.chart.options.scales.yAxes[0].ticks.callback = function(value, index, values) {

        if(<number>value - Math.round(<number>value) == 0)
          return null;
          
        let label = "";
        let idx = Math.round(<number>value) - 1;

        if(idx == 0)
        {
          label = "0% - " + strides[idx] + "%";
          return label;
        }

        label = strides[idx - 1] + "% - " + strides[idx] + "%";
        return label;
      };
    }
  }

  create() 
  { 
    /*create options*/
    this.createDefaultOptions();

    
    /*customize options*/
    let opmode = this.opMode;
    let strides = this.strides;
    let yLabel = "";
    if(opmode == timeStepMode)
      yLabel = this.yLabelDuration;
    else 
      yLabel = this.yLabelPercentiles;

    this.options.scales.yAxes.push({
      scaleLabel: {
        labelString: yLabel,
        display: true,
        fontStyle: "bold",
        fontSize: 18,
        fontColor: "#101010"
      },
      ticks: {  //set custom label
        max: strides.length,
        min: 0,
        fontStyle: "bold",
        fontSize: 14,
        fontColor: "#101010",
        stepSize: 0.5,
        callback: function(value, index, values) {

          if(<number>value - Math.round(<number>value) == 0)
            return null;
            
          let label = "";
          let idx = Math.round(<number>value) - 1;

          if(opmode == 0)
          {
            if(idx == strides.length - 1)
            {
              label = strides[idx] + "+"
              return label;
            }
  
            label += strides[idx] + " - " + strides[idx + 1];
  
            return label;
          }
          else
          {
            if(idx == 0)
            {
              label = "0% - " + strides[idx] + "%";
              return label;
            }

            label = strides[idx - 1] + "% - " + strides[idx] + "%";
            return label;
          }
        }
      },
      stacked: true
    });

    /*intialize chart creation*/
    this.createChart(this.relevantEvents.length); 
  }
}