import { cloneDeep } from 'lodash';

export class ChartBase {
    public chart:any;

    ctx: HTMLCanvasElement;
    allDistricts: string[];
    allEvents: string[];
    relevantEvents: string[] = ["Baustelle", "Fahrstreifensperrung", "Gefahr", "Sperrung", "Unfall"];
    eventsToRelevantMap: number[] = [0, 0, 1, 2, 3, 2, 4];
    allTimeSteps: number[];
    
    data: any[];

    constructor (ctx: HTMLCanvasElement, allDistricts: string[], allEvents: string[], allTimeSteps: number[])
    {
        this.ctx = ctx;
        this.allDistricts = allDistricts;
        this.allEvents = allEvents;
        this.allTimeSteps = allTimeSteps;

        this.containerSetup();  //calls each subclass' container setup function
    }

    containerSetup()
    {
        console.log("Function override not successful");
    }

    initContainer2D(topArrSize: number, subArrSize: number)
    {
        this.data = [];
        this.data.length = topArrSize;
        for(let eventIdx = 0; eventIdx < this.data.length; eventIdx++)
        {
          this.data[eventIdx] = [];
          this.data[eventIdx].length = subArrSize;
          this.data[eventIdx].fill(0);
        }
    }

    initContainer3D(count: number, topArrSize: number, subArrSize: number)
    {
        this.data = [];
        this.data.length = count;
        for(let arrIdx = 0; arrIdx < this.data.length; arrIdx++)
        {
            this.data[arrIdx] = [];
            this.data[arrIdx].length = topArrSize;
            for(let eventIdx = 0; eventIdx < this.data[arrIdx].length; eventIdx++)
            {
                this.data[arrIdx][eventIdx] = [];
                this.data[arrIdx][eventIdx].length = subArrSize;
                this.data[arrIdx][eventIdx].fill(0);
            }
        }
    }

    clearData()
    {
        this.clearContainer(this.data);
    }

    /* recursively reset an n dimensional container to all 0 */
    clearContainer(container: any)
    {
        if(typeof(container) != "undefined")
        {
            for(let idx = 0; idx < container.length; idx++)
            {
                if(typeof(container[idx]) == "number")
                {
                    container.fill(0);
                    return;
                }
                else
                    this.clearContainer(container[idx]);
            }
        }
    }

    calculateTimespanInDays(start: Date, end: Date)
    {
      let diff = this.calculateTimespanInMS(start, end);
      let diffDays = Math.ceil(diff / (1000 * 3600 * 24)); 
      return diffDays;
    }
  
    calculateTimespanInMinutes(start: Date, end: Date)
    {
      let diff = this.calculateTimespanInMS(start, end);
      let diffMinutes = Math.ceil(diff / (1000 *60));
      return diffMinutes;
    }
  
    calculateTimespanInMS(start: Date, end: Date)
    {
      return Math.abs(end.getTime() - start.getTime());
    }

    logData()
    {
        console.log(cloneDeep(this.data))
    }

    destroy()
    {
        this.clearData();
        this.chart.destroy();
    }

}