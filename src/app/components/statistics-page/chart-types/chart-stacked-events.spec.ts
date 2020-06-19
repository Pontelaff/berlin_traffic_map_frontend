import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ChartStackedEvents } from './chart-stacked-events';

describe('ChartStackedEvents', () => {
  let subject: ChartStackedEvents;

  let allDistricts: string[] = ["Mitte", "Friedrichshain-Kreuzberg", "Pankow", "Charlottenburg-Wilmersdorf", "Spandau", "Steglitz-Zehlendorf", 
                                "Tempelhof-Schöneberg", "Neukölln", "Treptow-Köpenick", "Marzahn-Hellersdorf", "Lichtenberg", "Reinickendorf"];
  let allEvents: string[] = ["Bauarbeiten", "Baustelle", "Fahrstreifensperrung","Gefahr", "Sperrung", "Störung", "Unfall"];
  let allTimeSteps: number[] = [0, 2, 4, 8, 16];

  beforeEach(() => {
    subject = new ChartStackedEvents("canvas", allDistricts, allEvents, allTimeSteps);
  });

  it('should create', () => {
    expect(subject).toBeTruthy();
  });
});