import { AfterViewInit, Component } from '@angular/core';
//import { Directive, HostListener } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import * as L from 'leaflet';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {
  private map:any;

  lastTwoWeeks = [];

  constructor(private apiService: ApiService) { 
    console.log("map constructor running");
  }

  ngAfterViewInit(): void {
    this.initMap();
  }
  
  private initMap(): void {
    this.map = L.map('map', {
      center: [ 52.518426, 13.404950 ],
      zoom: 12
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      minZoom: 10,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
    tiles.addTo(this.map);

    this.makeData();
  }

  makeData()
  {
    this.fetchData(this.apiService.fetchLast2Weeks().subscribe((data:any[])=>{ 
      console.log("Data Length " + data.length);
      this.lastTwoWeeks = data;})).then(value => {
      console.log("LastTwoWeeks Length " + this.lastTwoWeeks.length);

      this.addMarkers();
    })
  }
  
  fetchData(x)      //resumes after 1 sec
  {
    return new Promise(resolve => {
      setTimeout(() => {
      resolve(x);
      }, 1000);
      });
  }

  addMarkers()
  {
    this.lastTwoWeeks.forEach(element => {
      this.addMarker(element.location.coordinates[1], element.location.coordinates[0]);
    });
  }

  public addMarker(x:number, y:number): void {
    L.marker([x, y]).addTo(this.map);
  }
}