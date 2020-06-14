import * as Chart from 'chart.js';
import { ChartStacked } from './chart-stacked'


export class ChartStackedEvents extends ChartStacked {

    update(data: any)
    {
        this.updateRoutine(data, this.relevantEvents.length);
    }

    create() 
    {  
      /*create options*/
      this.createDefaultOptions();

      /*customize optionbs*/
      let events = this.relevantEvents;
      this.options.scales.yAxes.push({
          ticks: {  //set custom label
            max: events.length,
            min: 0,
            stepSize: 0.5,
            callback: function(value, index, values) {
              if(<number>value - Math.round(<number>value) == 0)
                return null;
                else
                  return events[Math.round(<number>value) - 1];
            }
          },
          stacked: true
      });

      /*intialize chart creation*/
      this.createChart(this.relevantEvents.length);
    }
}

