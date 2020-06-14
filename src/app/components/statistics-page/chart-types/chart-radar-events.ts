import * as Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { cloneDeep } from 'lodash';
import { ChartBase } from './chartBase'



export class ChartRadarEvents extends ChartBase {

    update(data: any)
    {
        let chartData = cloneDeep(data);

        for(let eventIdx = 1; eventIdx < chartData.length; eventIdx++)
        {
            for(let districtIdx = 0; districtIdx < this.allDistricts.length; districtIdx++)
            {
                chartData[eventIdx][districtIdx] += chartData[eventIdx - 1][districtIdx];
            }
        }

        for(let idx = 0; idx < chartData.length; idx++)
        {
            let element = chartData[idx];
            this.chart.data.datasets[idx].data = element;
        }

        this.chart.update();
    }

    create()
    {
        /*create empty datasets*/
        let allData = [];
        for(let datasetIdx = 0; datasetIdx < this.relevantEvents.length ;datasetIdx++)
        {
          let lightness = (datasetIdx - 2.5) * 7 + 36;
          let uniformData = [];
          uniformData.length = this.allDistricts.length;
          uniformData.fill(datasetIdx + 1);
          allData.push({
              data: uniformData,
              backgroundColor: 'hsl(82, 100%, ' + lightness + '%)',
              label: this.relevantEvents[datasetIdx]
          })
        }

        this.chart = new Chart(this.ctx, {
            plugins: [ChartDataLabels],
            type: 'radar',
            data: {
                labels: this.allDistricts,
                datasets: allData
              },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                  display: true
                },
                tooltips: {
                    enabled: true,
                    callbacks: {
                        label: function(tooltipItem, data) {

                            let string = data.datasets[tooltipItem.datasetIndex].label + ": ";

                            let val = <number>data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];

                            if(tooltipItem.datasetIndex > 0)
                                val = val - <number>data.datasets[tooltipItem.datasetIndex - 1].data[tooltipItem.index]

                            string += val;

                            return string;
                        }
                    }
                },
                plugins: {
                  datalabels: {
                    display: false,
                  }
                },
                scale: {
                    ticks: {
                        suggestedMin: 0
                    }
                }
              }
        })
    }

}