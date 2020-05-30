import { AfterViewInit, Component } from '@angular/core';
//import { Directive, HostListener } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {
  private map:any;

  // public mapHeight:number;
  // mapElement:any;


  constructor() { 
    console.log("map constructor running");}

  ngAfterViewInit(): void {
    this.initMap();
  }

  // ngOnInit(): void {
  //   this.mapElement = document.getElementById("map");
  //   this.mapHeight = window.innerHeight - this.mapElement.offsetTop -24;
  //   console.log(this.mapHeight);
  // }
  // @HostListener('window:resize', ['$event'])
  // onResize(event) {
  //   this.mapHeight = window.innerHeight - this.mapElement.offsetTop -24;
  // }
  
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
  }
}