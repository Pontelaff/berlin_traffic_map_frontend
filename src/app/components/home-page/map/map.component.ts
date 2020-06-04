import { AfterViewInit, Component } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import { element } from 'protractor';
import { ElementSchemaRegistry } from '@angular/compiler';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {
  private map:any;

  lastTwoWeeks = [];
  trafficData = [];
  dataFrom = "2010-06-01"
  dataTo = "2020-06-04"

  markers = L.markerClusterGroup({
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: false,
    // iconCreateFunction: function(cluster) {
    //   let childCount = cluster.getChildCount()
    //   let c = ' marker-cluster-';
    //   if (childCount <= 10) {
    //     c += 'small';
    //   } else if (childCount <= 100) {
    //     c += 'medium';
    //   } else {
    //     c += 'large';
    //   }

    //   return L.divIcon({ html: '<div><span>' + cluster.getChildCount() + '<span></div>',
    //   className: 'marker-cluster ' + c,
    //   iconSize: new L.Point(40, 40)});
    // }
  });

  constructionSiteIcon = L.icon({
    iconUrl: 'assets/200px-Construction.png',

    iconSize:     [30, 30], // size of the icon
    iconAnchor:   [15, 15], // point of the icon which will correspond to marker's location
    popupAnchor:  [0, -15] // point from which the popup should open relative to the iconAnchor
  });

  roadClosureIcon = L.icon({
    iconUrl: 'assets/200px-Closure.png',

    iconSize:     [30, 30], // size of the icon
    iconAnchor:   [15, 15], // point of the icon which will correspond to marker's location
    popupAnchor:  [0, -15] // point from which the popup should open relative to the iconAnchor
  });

  constructor(private apiService: ApiService) { 

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
    this.fetchData(this.apiService.fetchFromTo(this.dataFrom, this.dataTo).subscribe((data:any[])=>{ 
       console.log("Data Length " + data.length);
      this.trafficData = data;})).then(value => {
      //console.log("LastTwoWeeks Length " + this.lastTwoWeeks.length);

      this.addMarkers();
    })
  }
  
  fetchData(x)      //resumes after 1 sec
  {
    return new Promise(resolve => {
      setTimeout(() => {
      resolve(x);
      }, 2000);
      });
  }

  addMarkers()
  {
    this.trafficData.forEach(element => {
      if (element != null){
        let streetName = "";
        if(element.streets != null)
          streetName = element.streets[0];

        let popUpContent = "<p> <b>" + element.name + "</b>" + "<br> " + streetName + "</p>";

        let icon = null;
        if(element.name == "Sperrung")
          icon = this.roadClosureIcon;
        else if(element.name == "Baustelle")
          icon = this.constructionSiteIcon;
        if(element.location != null){
          let marker = this.addMarker(element.location.coordinates[1], element.location.coordinates[0], icon);
          marker.bindPopup(popUpContent);
          this.markers.addLayer(marker);
        }
      }
    });
    this.map.addLayer(this.markers)
  }

  addMarker(x:number, y:number, icon:any) {
    if(icon == null)
      return L.marker([x, y]);
    else
      return L.marker([x, y], {icon: icon});
  }
}