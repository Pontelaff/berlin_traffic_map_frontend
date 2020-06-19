import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ChartBubbleEvents } from './chart-bubble-events';

describe('ChartBubbleEvents', () => {
  let subject: ChartBubbleEvents;

  let allDistricts: string[] = ["Mitte", "Friedrichshain-Kreuzberg", "Pankow", "Charlottenburg-Wilmersdorf", "Spandau", "Steglitz-Zehlendorf", 
                                "Tempelhof-Schöneberg", "Neukölln", "Treptow-Köpenick", "Marzahn-Hellersdorf", "Lichtenberg", "Reinickendorf"];
  let allEvents: string[] = ["Bauarbeiten", "Baustelle", "Fahrstreifensperrung","Gefahr", "Sperrung", "Störung", "Unfall"];
  let allTimeSteps: number[] = [0, 2, 4, 8, 16];

  beforeEach(() => {
    subject = new ChartBubbleEvents("canvas", allDistricts, allEvents, allTimeSteps);
    subject.containerSetup();
  });

  it('should create', () => {
    expect(subject).toBeTruthy();
  });

  it('should make chart', () => {
    subject.create();
    expect(subject.chart.data.datasets[0].data.length).toEqual(subject.allTimeSteps.length * subject.allDistricts.length);
  });

  it('should create container', () => {
    expect(subject.data[0].length).toEqual(allTimeSteps.length);
  });

  it('should survive empty data', () => {
    subject.create();
  
    subject.addData([], 0);

    let chartSpy = jasmine.createSpyObj({update: null});
    let chartMock = {chart: chartSpy};
    chartMock.chart.options = subject.chart.options;
    chartMock.chart.data = subject.chart.data;
    subject.chart = chartMock.chart;

    subject.update();

    expect(chartSpy.update).toHaveBeenCalled();
  });

  it('should show tooltip', () => {
    subject.create();

    let testData = subject.chart.data;
    testData.datasets[0].hoverBackgroundColor.length = testData.datasets[0].data.length;      //occurences
    testData.datasets[0].hoverBorderColor.length = testData.datasets[0].data.length;          //duration

    let multiLine:string;
    let label:string;
    
    /* minimum test */
    testData.datasets[0].hoverBackgroundColor[0] = undefined;
    testData.datasets[0].hoverBorderColor[0] = undefined;

    multiLine = subject.chart.options.tooltips.callbacks.label({index: 0, datasetIndex: 0}, subject.chart.data);
    label = multiLine[0] + multiLine[1];
    expect(label).toEqual("Aufkommen von Baustelle in Mitte: [ERROR]Dauer insgesamt: [ERROR]");

    /* no time test, occurences undefined */
    testData.datasets[0].hoverBackgroundColor[1] = 0;
    testData.datasets[0].hoverBorderColor[1] = 0;

    multiLine = subject.chart.options.tooltips.callbacks.label({index: 1, datasetIndex: 0}, subject.chart.data);
    label = multiLine[0];
    expect(label).toEqual("Aufkommen von Baustelle in Friedrichshain-Kreuzberg: 0");

    /* all singular test */
    testData.datasets[0].hoverBackgroundColor[2] = 10;
    testData.datasets[0].hoverBorderColor[2] = 525600 + 1440 + 60 + 1;

    multiLine = subject.chart.options.tooltips.callbacks.label({index: 2, datasetIndex: 0}, subject.chart.data);
    label = multiLine[0] + multiLine[1];
    expect(label).toEqual("Aufkommen von Baustelle in Pankow: 10Dauer insgesamt: 1 Jahr, 1 Tag, 1 Stunde, 1 Minute");

    /* all plural test */
    testData.datasets[0].hoverBackgroundColor[3] = 10;
    testData.datasets[0].hoverBorderColor[3] = 525600 * 2 + 1440 * 2 + 60 * 2 + 1 * 2;

    multiLine = subject.chart.options.tooltips.callbacks.label({index: 3, datasetIndex: 0}, subject.chart.data);
    label = multiLine[0] + multiLine[1];
    expect(label).toEqual("Aufkommen von Baustelle in Charlottenburg-Wilmersdorf: 10Dauer insgesamt: 2 Jahre, 2 Tage, 2 Stunden, 2 Minuten");
  });

  it('should update chart', () => {
    subject.create();

    let testAmount = 100;
    let testDateFrom = "2020-06-09T05:53:49+02:00";
    let testDateTo = "2020-07-09T05:53:49+02:00";
    let testEvent:string = subject.relevantEvents[0];

    let data = [];
    data.length = testAmount;
    data.fill({
      validities: [{
        timeFrom: testDateFrom,
        timeTo: testDateTo
      }],
      consequence: {
        summary: testEvent
      }
    });
    
    subject.addData(data, 0);
    expect(subject.data[0][0][0]).toEqual(testAmount);

    
    let chartSpy = jasmine.createSpyObj({update: null});
    let chartMock = {chart: chartSpy};
    chartMock.chart.options = subject.chart.options;
    chartMock.chart.data = subject.chart.data;
    subject.chart = chartMock.chart;

    subject.indicateBusy();
    subject.update();

    expect(chartSpy.update).toHaveBeenCalled();
  });

  it('should indicate loading', () => {
    subject.create();

    let chartSpy = jasmine.createSpyObj({update: null});
    let chartMock = {chart: chartSpy};
    chartMock.chart.options = subject.chart.options;
    chartMock.chart.data = subject.chart.data;
    subject.chart = chartMock.chart;

    subject.durationData = [];
    subject.durationData.length = subject.relevantEvents.length;
    for(let idx = 0; idx < subject.durationData.length; idx++)
    {
      subject.durationData[idx] = [];
      subject.durationData[idx].length = allDistricts.length;
      subject.durationData[idx].fill(10);
    }

    subject.indicateBusy();
    expect(chartSpy.update).toHaveBeenCalled();
  });
});