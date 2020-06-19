import * as Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { cloneDeep } from 'lodash';
import { ChartBase } from './chartBase'



export class ChartRadarEvents extends ChartBase {


  containerSetup()
  {
    this.initContainer2D(this.relevantEvents.length, this.allDistricts.length);
  }

  indicateBusy()
  {
    this.setChartSaturation(this.busySaturation);
    this.chart.update();
  }

  setChartSaturation(saturation: number)
  {
    for(let layerIdx = 0; layerIdx < this.data.length; layerIdx++)
    {
      this.chart.data.datasets[layerIdx].backgroundColor = this.getLayerColor(layerIdx, saturation);
    }
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

  update()
  {
    let chartData = cloneDeep(this.data);

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

    this.setChartSaturation(this.defaultSaturation);
    this.chart.update();
  }

  getLayerColor(layerIdx: number, saturation: number = this.defaultSaturation)
  {
    let lightness = (layerIdx - 2.5) * 7 + 36;      //outer layers are lighter, center layers are darker
    let str = this.getHSLColorString(82, saturation, lightness)
    return str;  //htw corporate identity green
  }

  create()
  {
    /*create empty datasets*/
    let allData = [];
    for(let datasetIdx = 0; datasetIdx < this.relevantEvents.length ;datasetIdx++)
    {
      let uniformData = [];
      uniformData.length = this.allDistricts.length;
      uniformData.fill(datasetIdx + 1);
      allData.push({
          data: uniformData,
          backgroundColor: this.getLayerColor(datasetIdx, this.busySaturation),
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
              display: true,
              labels: {
                fontStyle: "bold",
                fontSize: 14
              }
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
              pointLabels: {
                fontStyle: "bold",
                fontSize: 14,
              },
              ticks: {
                  suggestedMin: 0
              }
            },
          }
    })
  }

}