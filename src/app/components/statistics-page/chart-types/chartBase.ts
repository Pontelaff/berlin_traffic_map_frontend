

export class ChartBase {
    public chart:any;

    ctx: HTMLCanvasElement;
    allDistricts: string[];
    relevantEvents: string[];
    allTimeSteps: number[];

    constructor (ctx: HTMLCanvasElement, allDistricts: string[], relevantEvents: string[], allTimeSteps: number[])
    {
        this.ctx = ctx;
        this.allDistricts = allDistricts;
        this.relevantEvents = relevantEvents;
        this.allTimeSteps = allTimeSteps;
    }

    destroy()
    {
        console.log("Chart destroyed");
        this.chart.destroy();
    }

}