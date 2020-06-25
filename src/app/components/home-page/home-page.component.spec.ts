import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePageComponent } from './home-page.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MaterialModule } from '../../material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('HomePageComponent', () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomePageComponent ],
      imports: [ HttpClientTestingModule, MaterialModule, BrowserAnimationsModule, FormsModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a menu with 5 checkboxes (view child)', () => {
    component.menuTrigger.openMenu();
    fixture.detectChanges();
    expect(fixture.debugElement.queryAll(By.css('.options-checkbox')).length).toEqual(5);
  });

  it('should update entries per category', () => {
    expect(component.trafficData).toEqual([]);
    expect(component.entriesPerCategory[0]).toEqual("loading");
    //component.initMap();
    component.trafficData = [
      {"id":"5db2181748be6a56292c652a","consequence":{"summary":"Sperrung","description":"Vollsperrung"},"description":"Baustelle, Vollsperrung (bis vorauss. Ende 2022)","section":"in beiden Richtungen zwischen Invalidenstraße und Kapelle-Ufer","name":"Sperrung","address":{"city":null,"district":null,"state":"Berlin","country":"DE","countryCode":"DE"},"streets":["Friedrich-List-Ufer (Moabit)"],"validities":[{"timeFrom":"2012-10-15T08:00:00+02:00","timeTo":"2022-12-31T17:00:00+01:00","visible":false},{"timeFrom":"2012-10-15T08:00:00+02:00","timeTo":"2022-12-31T17:00:00+01:00","visible":true}],"location":{"type":"Point","coordinates":[13.370715076457124,52.52419509477858]},"property":["blockage"],"geometry":{"type":"LineString","coordinates":[[13.370684964343557,52.525853087780796],[13.370715076457124,52.52419509477858]]}},
      {"id":"5db218178c3fa0c1600199a6","consequence":{"summary":"Baustelle","description":"keine Sperrung"},"description":"Baustelle, Fahrbahneinschränkungen, Verschwenkungen (Gesamtmaßnahme bis Ende 2020)","section":"in beiden Richtungen Kreuzung Schloßallee / A114 Anschlussstelle","name":"Baustelle","address":{"city":null,"district":null,"state":"Berlin","country":"DE","countryCode":"DE"},"streets":["Pasewalker Straße (Pankow)"],"validities":[{"timeFrom":"2017-04-10T07:00:00+02:00","timeTo":"2020-12-31T23:59:00+01:00","visible":false},{"timeFrom":"2017-04-10T07:00:00+02:00","timeTo":"2020-12-31T23:59:00+01:00","visible":true}],"location":{"type":"Point","coordinates":[13.428590978720482,52.583159710755616]},"property":["roadwork"],"geometry":null},
      {"id":"5db21819a81f60d80d58f133","consequence":{"summary":"Baustelle","description":"keine Sperrung"},"description":"Baustelle, Fahrbahn auf einen Fahrstreifen verengt (bis 2021)","section":"Richtung Axel-Springer-Str. zwischen Am Berlin Museum und Ritterstr.","name":"Baustelle","address":{"city":null,"district":null,"state":"Berlin","country":"DE","countryCode":"DE"},"streets":["Lindenstr. (Kreuzberg)"],"validities":[{"timeFrom":"2017-11-29T10:51:00+01:00","timeTo":"2021-03-31T17:00:00+02:00","visible":false},{"timeFrom":"2017-11-29T10:51:00+01:00","timeTo":"2021-03-31T17:00:00+02:00","visible":true}],"location":{"type":"Point","coordinates":[13.395920680275518,52.5038332789935]},"property":["roadwork"],"geometry":null},
      {"id":"5db21819965620b7cd67d305","consequence":{"summary":"Baustelle","description":"keine Sperrung"},"description":"Baustelle, Fahrbahn auf einen Fahrstreifen je Richtung verengt und verschwenkt (Gesamtmaßnahme bis Ende 2023)","section":"in beiden Richtungen zwischen Uhlandstraße und Pfalzburger Straße","name":"Baustelle","address":{"city":null,"district":null,"state":"Berlin","country":"DE","countryCode":"DE"},"streets":["Lietzenburger Straße (Charlottenburg)"],"validities":[{"timeFrom":"2018-02-01T06:00:00+01:00","timeTo":"2023-12-31T23:59:00+01:00","visible":false},{"timeFrom":"2018-02-01T06:00:00+01:00","timeTo":"2023-12-31T23:59:00+01:00","visible":true}],"location":{"type":"Point","coordinates":[13.323925580510412,52.49995151772612]},"property":["roadwork"],"geometry":null},
      {"id":"5db2181748be6a56292c652a","consequence":{"summary":"Fahrstreifensperrung","description":"Vollsperrung"},"description":"Baustelle, Vollsperrung (bis vorauss. Ende 2022)","section":"in beiden Richtungen zwischen Invalidenstraße und Kapelle-Ufer","name":"Sperrung","address":{"city":null,"district":null,"state":"Berlin","country":"DE","countryCode":"DE"},"streets":["Friedrich-List-Ufer (Moabit)"],"validities":[{"timeFrom":"2012-10-15T08:00:00+02:00","timeTo":"2022-12-31T17:00:00+01:00","visible":false},{"timeFrom":"2012-10-15T08:00:00+02:00","timeTo":"2022-12-31T17:00:00+01:00","visible":true}],"location":{"type":"Point","coordinates":[13.370715076457124,52.52419509477858]},"property":["blockage"],"geometry":{"type":"LineString","coordinates":[[13.370684964343557,52.525853087780796],[13.370715076457124,52.52419509477858]]}},
      {"id":"5db218178c3fa0c1600199a6","consequence":{"summary":"Unfall","description":"keine Sperrung"},"description":"Baustelle, Fahrbahneinschränkungen, Verschwenkungen (Gesamtmaßnahme bis Ende 2020)","section":"in beiden Richtungen Kreuzung Schloßallee / A114 Anschlussstelle","name":"Baustelle","address":{"city":null,"district":null,"state":"Berlin","country":"DE","countryCode":"DE"},"streets":["Pasewalker Straße (Pankow)"],"validities":[{"timeFrom":"2017-04-10T07:00:00+02:00","timeTo":"2020-12-31T23:59:00+01:00","visible":false},{"timeFrom":"2017-04-10T07:00:00+02:00","timeTo":"2020-12-31T23:59:00+01:00","visible":true}],"location":{"type":"Point","coordinates":[13.428590978720482,52.583159710755616]},"property":["roadwork"],"geometry":null},
      {"id":"5db21819a81f60d80d58f133","consequence":{"summary":"Gefahr","description":"keine Sperrung"},"description":"Baustelle, Fahrbahn auf einen Fahrstreifen verengt (bis 2021)","section":"Richtung Axel-Springer-Str. zwischen Am Berlin Museum und Ritterstr.","name":"Baustelle","address":{"city":null,"district":null,"state":"Berlin","country":"DE","countryCode":"DE"},"streets":["Lindenstr. (Kreuzberg)"],"validities":[{"timeFrom":"2017-11-29T10:51:00+01:00","timeTo":"2021-03-31T17:00:00+02:00","visible":false},{"timeFrom":"2017-11-29T10:51:00+01:00","timeTo":"2021-03-31T17:00:00+02:00","visible":true}],"location":{"type":"Point","coordinates":[13.395920680275518,52.5038332789935]},"property":["roadwork"],"geometry":null},
    ];
    component.markerUpdateRoutine();
    expect(component.entriesPerCategory[0]).toEqual("1");
    expect(component.entriesPerCategory[1]).toEqual("3");
  });

  it('should set status to loading on click', () => {
    component.trafficData = [
      {"id":"5db2181748be6a56292c652a","consequence":{"summary":"Sperrung","description":"Vollsperrung"},"description":"Baustelle, Vollsperrung (bis vorauss. Ende 2022)","section":"in beiden Richtungen zwischen Invalidenstraße und Kapelle-Ufer","name":"Sperrung","address":{"city":null,"district":null,"state":"Berlin","country":"DE","countryCode":"DE"},"streets":["Friedrich-List-Ufer (Moabit)"],"validities":[{"timeFrom":"2012-10-15T08:00:00+02:00","timeTo":"2022-12-31T17:00:00+01:00","visible":false},{"timeFrom":"2012-10-15T08:00:00+02:00","timeTo":"2022-12-31T17:00:00+01:00","visible":true}],"location":{"type":"Point","coordinates":[13.370715076457124,52.52419509477858]},"property":["blockage"],"geometry":{"type":"LineString","coordinates":[[13.370684964343557,52.525853087780796],[13.370715076457124,52.52419509477858]]}},
      {"id":"5db218178c3fa0c1600199a6","consequence":{"summary":"Baustelle","description":"keine Sperrung"},"description":"Baustelle, Fahrbahneinschränkungen, Verschwenkungen (Gesamtmaßnahme bis Ende 2020)","section":"in beiden Richtungen Kreuzung Schloßallee / A114 Anschlussstelle","name":"Baustelle","address":{"city":null,"district":null,"state":"Berlin","country":"DE","countryCode":"DE"},"streets":["Pasewalker Straße (Pankow)"],"validities":[{"timeFrom":"2017-04-10T07:00:00+02:00","timeTo":"2020-12-31T23:59:00+01:00","visible":false},{"timeFrom":"2017-04-10T07:00:00+02:00","timeTo":"2020-12-31T23:59:00+01:00","visible":true}],"location":{"type":"Point","coordinates":[13.428590978720482,52.583159710755616]},"property":["roadwork"],"geometry":null},
      ];
    component.markerUpdateRoutine();
    component.applyClick();    
    expect(component.entriesPerCategory[0]).toEqual("loading");
    expect(component.entriesPerCategory[1]).toEqual("loading");
  });

  it('should format date', () => {    
    let date = new Date(2000, 0, 1).toISOString();
    let formattedDate = component.formatDate(date);
    expect(formattedDate).toEqual("Samstag, 1. Januar 2000, 00:00");
  });  
});
