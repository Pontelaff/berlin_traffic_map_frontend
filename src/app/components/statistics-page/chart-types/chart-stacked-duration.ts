import * as Chart from 'chart.js';
import { ChartStacked } from './chart-stacked'


export class ChartStackedDuration extends ChartStacked {

    update(data: any)
    {
        this.updateRoutine(data, this.allTimeSteps.length);
    }

    create() 
    { 
      /*create options*/
      this.createDefaultOptions();

      /*customize optionbs*/
      let timesteps = this.allTimeSteps;
      this.options.scales.yAxes.push({
        ticks: {  //set custom label
          max: timesteps.length,
          min: 0,
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