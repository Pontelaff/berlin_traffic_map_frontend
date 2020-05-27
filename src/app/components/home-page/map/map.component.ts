import { Component, OnInit } from '@angular/core';
import { Directive, HostListener } from '@angular/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  constructor() { }

  public mapHeight:number;
  mapElement;

  ngOnInit(): void {
    this.mapElement = document.getElementById("map");
    this.mapHeight = window.innerHeight - this.mapElement.offsetTop;
    console.log(this.mapHeight);
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.mapHeight = window.innerHeight - this.mapElement.offsetTop;
  }
  
}
