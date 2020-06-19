import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ChartStackedDuration } from './chart-stacked-duration';

describe('ChartStackedDuration', () => {
  let subject: ChartStackedDuration;

  let allDistricts: string[] = ["Mitte", "Friedrichshain-Kreuzberg", "Pankow", "Charlottenburg-Wilmersdorf", "Spandau", "Steglitz-Zehlendorf", 
                                "Tempelhof-Schöneberg", "Neukölln", "Treptow-Köpenick", "Marzahn-Hellersdorf", "Lichtenberg", "Reinickendorf"];
  let allEvents: string[] = ["Bauarbeiten", "Baustelle", "Fahrstreifensperrung","Gefahr", "Sperrung", "Störung", "Unfall"];
  let allTimeSteps: number[] = [0, 2, 4, 8, 16];

  beforeEach(() => {
    subject = new ChartStackedDuration("canvas", allDistricts, allEvents, allTimeSteps);
    subject.containerSetup();
  });

  it('should create', () => {
    expect(subject).toBeTruthy();
  });

  it('should make chart', () => {
    subject.create();
    expect(subject.chart.data.datasets.length).toEqual(allTimeSteps.length);
  });

  it('should create container', () => {
    expect(subject.data.length).toEqual(allTimeSteps.length);
  })

  it('should update chart', () => {
    subject.create();

    let testDateFrom = "2020-06-09T05:53:49+02:00";
    let testDateTo = "2020-07-09T05:53:49+02:00";
    let testAmount = 100;

    let data = [];
    data.length = testAmount;
    data.fill({
      validities: [{
        timeFrom: testDateFrom,
        timeTo: testDateTo
      }]
    });
    
    subject.addData(data, 0);
    expect(subject.data[4][0]).toEqual(testAmount);

    let chartSpy = jasmine.createSpyObj({update: null});
    let chartMock = {chart: chartSpy};
    chartMock.chart.options = subject.chart.options;
    chartMock.chart.data = subject.chart.data;
    subject.chart = chartMock.chart;

    subject.indicateBusy();
    subject.update();

    expect(chartSpy.update).toHaveBeenCalled();
  });
});