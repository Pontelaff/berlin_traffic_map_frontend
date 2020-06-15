import * as Chart from 'chart.js';
import { ChartStacked } from './chart-stacked'


export class ChartStackedEvents extends ChartStacked {


  containerSetup()
  {
    this.initContainer2D(this.relevantEvents.length, this.allDistricts.length);
  }

  update()
  {
    this.updateRoutine(this.relevantEvents.length);
  }

  addData(incomingData: any, districtIdx: number)
  {
    incomingData.forEach(entry => {
      for(let eventIdx = 0; eventIdx < this.allEvents.length; eventIdx++)
      {
        if(this.allEvents[eventIdx] == entry.consequence.summary)
        {
          let relevantIdx = this.eventsToRelevantMap[eventIdx];
          this.data[relevantIdx][districtIdx]++;
        }
      }
    });
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

