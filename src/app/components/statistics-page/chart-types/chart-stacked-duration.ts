import * as Chart from 'chart.js';
import { ChartStacked } from './chart-stacked'


export class ChartStackedDuration extends ChartStacked {


  containerSetup()
  {
    this.initContainer2D(this.allTimeSteps.length, this.allDistricts.length);
  }

  update()
  {
    this.updateRoutine(this.allTimeSteps.length);
  }

  addData(incomingData: any, districtIdx: number)
  {
    incomingData.forEach(entry => {
      for(let timeIdx = 0; timeIdx < this.allTimeSteps.length; timeIdx++)
      {
        let dateFrom = entry.validities[0].timeFrom;
        let dateTo = entry.validities[0].timeTo;
        let diffDays = this.calculateTimespanInDays(new Date(dateFrom), new Date(dateTo));

        if(timeIdx == this.allTimeSteps.length - 1)
        {
          this.data[timeIdx][districtIdx]++;
          break;
        }

        if(diffDays >= this.allTimeSteps[timeIdx] && diffDays < this.allTimeSteps[timeIdx + 1])
        {
          this.data[timeIdx][districtIdx]++;
          break;
        }
      }
    });
  }

  create() 
  { 
    /*create options*/
    this.createDefaultOptions();

    /*customize optionbs*/
    let timesteps = this.allTimeSteps;
    this.options.scales.yAxes.push({
      scaleLabel: {
        labelString: "Störungsdauer",
        display: true,
        fontStyle: "bold",
        fontSize: 14
      },
      ticks: {  //set custom label
        max: timesteps.length,
        min: 0,
        fontStyle: "bold",
        fontSize: 14,
        stepSize: 0.5,
        callback: function(value, index, values) {
          if(<number>value - Math.round(<number>value) == 0)
            return null;

          let label = "";
          let idx = Math.round(<number>value) - 1;
          if(idx == timesteps.length - 1)
          {
            label = timesteps[idx] + "+"
            return label;
          }

          label += timesteps[idx] + " - " + timesteps[idx + 1];

          return label;
        }
      },
      stacked: true
    });

    /*intialize chart creation*/
    this.createChart(this.relevantEvents.length); 
  }
}