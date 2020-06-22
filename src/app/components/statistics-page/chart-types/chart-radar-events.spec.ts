import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ChartRadarEvents } from './chart-radar-events';

describe('ChartRadarEvents', () => {
  let subject: ChartRadarEvents;

  let allDistricts: string[] = ["Mitte", "Friedrichshain-Kreuzberg", "Pankow", "Charlottenburg-Wilmersdorf", "Spandau", "Steglitz-Zehlendorf", 
                                "Tempelhof-Schöneberg", "Neukölln", "Treptow-Köpenick", "Marzahn-Hellersdorf", "Lichtenberg", "Reinickendorf"];
  let allEvents: string[] = ["Bauarbeiten", "Baustelle", "Fahrstreifensperrung","Gefahr", "Sperrung", "Störung", "Unfall"];
  let allTimeSteps: number[] = [0, 2, 4, 8, 16];

  beforeEach(() => {
    subject = new ChartRadarEvents("canvas", allDistricts, allEvents);
    subject.containerSetup();
  });

  it('should create', () => {
    expect(subject).toBeTruthy();
  });

  it('should make chart', () => {
    subject.create();
    expect(subject.chart.data.datasets.length).toEqual(subject.relevantEvents.length);
  });

  it('should create container', () => {
    expect(subject.data.length).toEqual(subject.relevantEvents.length);
  })

  it('should update chart', () => {
    subject.create();

    let testAmount = 100;
    let testEvent:string = subject.relevantEvents[0];

    let data = [];
    data.length = testAmount;
    data.fill({
      consequence: {
        summary: testEvent
      }
    });
    
    subject.addData(data, 0);
    expect(subject.data[0][0]).toEqual(testAmount);

    let chartSpy = jasmine.createSpyObj({update: null});
    let chartMock = {chart: chartSpy};
    chartMock.chart.options = subject.chart.options;
    chartMock.chart.data = subject.chart.data;
    subject.chart = chartMock.chart;
    
    subject.indicateBusy();
    subject.update();

    expect(chartSpy.update).toHaveBeenCalled();
  });

  // it('should properly destroy', () =>{
  //   subject.create();
  //   let chartSpy = jasmine.createSpyObj({update: null});
  //   let chartMock = {chart: chartSpy};
  //   chartMock.chart.options = subject.chart.options;
  //   chartMock.chart.data = subject.chart.data;
  //   subject.chart = chartMock.chart;

  //   subject.destroy()

  //   expect(chartSpy.destroy).toHaveBeenCalled();
  // });
});