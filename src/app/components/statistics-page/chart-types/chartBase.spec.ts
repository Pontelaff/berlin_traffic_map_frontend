import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartBase } from './chartBase';

describe('ChartBase', () => {
  let subject: ChartBase;

  let allDistricts: string[] = ["Mitte", "Friedrichshain-Kreuzberg", "Pankow", "Charlottenburg-Wilmersdorf", "Spandau", "Steglitz-Zehlendorf", 
                                "Tempelhof-Schöneberg", "Neukölln", "Treptow-Köpenick", "Marzahn-Hellersdorf", "Lichtenberg", "Reinickendorf"];
  let allEvents: string[] = ["Bauarbeiten", "Baustelle", "Fahrstreifensperrung","Gefahr", "Sperrung", "Störung", "Unfall"];
  let allTimeSteps: number[] = [0, 2, 4, 8, 16];

  beforeEach(() => {
    subject = new ChartBase("canvas", allDistricts, allEvents, allTimeSteps);
  });

  it('should create', () => {
    expect(subject).toBeTruthy();
  });

  it('should properly zero out container', () => {
    let count = 2;
    let topCount = subject.relevantEvents.length;
    let subCount = allDistricts.length;
    let sum = 0;

    subject.data = [];
    subject.data.length = count;
    for(let countIdx = 0; countIdx < count; countIdx++)
    {
      subject.data[countIdx] = [];
      subject.data[countIdx].length = topCount;
      for(let topIdx = 0; topIdx < topCount; topIdx++)
      {
        subject.data[countIdx][topIdx] = [];
        subject.data[countIdx][topIdx].length = subCount;
        subject.data[countIdx][topIdx].fill(1);
      }
    }

    subject.clearData();

    for(let countIdx = 0; countIdx < subject.data.length; countIdx++)
    {
      for(let topIdx = 0; topIdx < subject.data[countIdx].length; topIdx++)
      {
        for(let subIdx = 0; subIdx < subject.data[countIdx][topIdx].length; subIdx++)
        {
          sum += subject.data[countIdx][topIdx][subIdx];
        }
      }
    }

    expect(sum).toEqual(0);


    sum = 0;
    subject.data = undefined;
    subject.clearData();

    if(subject.data != undefined)
    {
      for(let countIdx = 0; countIdx < subject.data.length; countIdx++)
      {
        for(let topIdx = 0; topIdx < subject.data[countIdx].length; topIdx++)
        {
          for(let subIdx = 0; subIdx < subject.data[countIdx][topIdx].length; subIdx++)
          {
            sum += subject.data[countIdx][topIdx][subIdx];
          }
        }
      }
    }

    expect(sum).toEqual(0);
  });
});