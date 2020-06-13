import * as Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { cloneDeep } from 'lodash';
import { ChartBase } from './chartBase'

interface Bubble {
    x: number,
    y: number,
    r: number
}

export class ChartBubbleEvents extends ChartBase {

    update(data: any)
    {
        
    }

    generateData()
    {
        let data = [];

        for(let y = 0.5; y < this.allEvents.length; y++)
        {
            for(let x = 0.5; x < this.allDistricts.length; x ++)
            {
                data.push({
                    x: x,
                    y: y,
                    r: 40,
                })
            }
        }
        return data;
    }

    create()
    {
        let districts = this.allDistricts;
        let events = this.allEvents;

        this.chart = new Chart(this.ctx, {
            type: 'bubble',
            data: {
                labels: this.allDistricts,
                datasets: [{
                        data: this.generateData()
                    }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                  display: false
                },
                hover: {
                  mode: null
                },
                elements: {
                    point: {
                        backgroundColor: "rgba(120, 256, 32, 0.6)"
                    }
                },
                tooltips: {
                    enabled: true,
                    callbacks: {
                        label: function(tooltipItem, data) {
                            let eventIndex = Math.floor(tooltipItem.index / districts.length);
                            let districtIndex = tooltipItem.index % districts.length;
                            let description = "Aufkommen von " + events[eventIndex] + " in " + districts[districtIndex] + ": ";

                            let bubble = <Bubble>data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                            let val = bubble.r;

                            description += val;
                            return description;
                        }
                    }
                },
                scales: {
                    xAxes: [{
                        ticks:{     //set custom label
                            max: 12,
                            min: 0,
                            stepSize: 0.5,
                            callback: function(value, index, values) {
                                if(<number>value - Math.round(<number>value) == 0)
                                    return null;
                                else
                                    return districts[Math.round(<number>value) - 1];
                            }
                        }
                    }],
                  yAxes: [{
                    ticks: {  //set custom label
                      max: 8,
                      min: 0,
                      stepSize: 0.5,
                      callback: function(value, index, values) {
                        if(<number>value - Math.round(<number>value) == 0)
                            return null;
                        else
                            return events[Math.round(<number>value) - 1];
                      }
                    }
                  }],
                }
            }

        });
    }

}