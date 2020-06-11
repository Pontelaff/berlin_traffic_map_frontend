import { AfterViewInit, Component } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
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

  constructor(private apiService: ApiService) {  }

  private map:any;

  trafficData = [];
  entriesPerCategory = ["loading", "loading", "loading", "loading", "loading", "loading"];
  options = {
  dateFrom: new Date(),
  dateTo: new Date(),
  showRoadClosures: true,
  showConstructionSites: true,  
  showLaneClosures: true,
  showTrafficJams: true,
  showAccidents: true,
  showDangers: true,
  };

  mapLayers:L.MarkerClusterGroup;

  roadClosures = L.layerGroup();
  constructionSites = L.layerGroup();
  laneClosures = L.layerGroup();
  trafficJams = L.layerGroup();
  accidents = L.layerGroup();
  dangers = L.layerGroup();

  roadClosureIcon = L.icon({
    iconUrl: 'assets/200px-Closure.png',
    iconSize:     [40, 40], // size of the icon
    iconAnchor:   [20, 20], // point of the icon which will correspond to marker's location
    popupAnchor:  [0, -22] // point from which the popup should open relative to the iconAnchor
  });

  constructionSiteIcon = L.icon({
    iconUrl: 'assets/200px-Construction.png',
    iconSize:     [42, 37], // size of the icon
    iconAnchor:   [21, 18], // point of the icon which will correspond to marker's location
    popupAnchor:  [0, -20] // point from which the popup should open relative to the iconAncho
  });

  lineClosureIcon = L.icon({
    iconUrl: 'assets/200px-Lane-Closure.png',
    iconSize:     [42, 37], // size of the icon
    iconAnchor:   [21, 18], // point of the icon which will correspond to marker's location
    popupAnchor:  [0, -20] // point from which the popup should open relative to the iconAnchor
  });

  trafficJamIcon = L.icon({
    iconUrl: 'assets/200px-Traffic-Jam.png',
    iconSize:     [42, 37], // size of the icon
    iconAnchor:   [21, 18], // point of the icon which will correspond to marker's location
    popupAnchor:  [0, -20] // point from which the popup should open relative to the iconAnchor
  });

  accidentIcon = L.icon({
    iconUrl: 'assets/200px-Accident.png',
    iconSize:     [42, 37], // size of the icon
    iconAnchor:   [21, 18], // point of the icon which will correspond to marker's location
    popupAnchor:  [0, -20] // point from which the popup should open relative to the iconAnchor
  });

  dangerIcon = L.icon({
    iconUrl: 'assets/200px-Danger.png',
    iconSize:     [42, 37], // size of the icon
    iconAnchor:   [21, 18], // point of the icon which will correspond to marker's location
    popupAnchor:  [0, -20] // point from which the popup should open relative to the iconAnchor
  });

  ngAfterViewInit(): void {
    this.options.dateFrom.setDate(this.options.dateFrom.getDate()-14);
    this.initMap();
  }

  toogleMapOptions(event, layer){
    event.checked ? this.mapLayers.addLayer(layer) : this.mapLayers.removeLayer(layer);
  }

  applyClick() {
    this.roadClosures.clearLayers();
    this.constructionSites.clearLayers();
    this.laneClosures.clearLayers();
    this.trafficJams.clearLayers();
    this.accidents.clearLayers();
    this.dangers.clearLayers();    
    this.mapLayers.clearLayers();
    this.entriesPerCategory.forEach( element => {
      element = "loading";
    })
    this.makeData();
  }

  setTestDates() {
    this.options.dateFrom = new Date(2000, 1, 1);    
    this.options.dateTo = new Date(2040, 1, 1);
    this.applyClick();
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

  makeData() : void
  {
    let dataFromFormatted = this.options.dateFrom.toISOString().slice(0, 10);
    let dataToFormatted = this.options.dateTo.toISOString().slice(0, 10);

    this.apiService.fetchFromTo(dataFromFormatted, dataToFormatted).subscribe((data:any[])=>{ 
      this.trafficData = data;
      this.markerUpdateRoutine();
       });
  }

  markerUpdateRoutine() : void
  {
    let dataLength = this.trafficData.length;    
    console.log("data lenght: " + dataLength);
    let clusterGroupOptions = {
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      maxClusterRadius: function(zoom) {
        var radius = (dataLength) / (zoom * 7);    //calculating the maxClustering radius on every zoom level indepentently
        if (radius < 32)                           //min radius of 32 to reduce overlapping
          radius = 32;
        console.log("zoom: " + zoom + " radius: " + radius);
        return radius;
      },
      //   iconCreateFunction: function(cluster) {
      // 	var childCount = cluster.getChildCount();    
      // 	var c = ' marker-cluster-';
      // 	if (childCount < 10) {
      // 		c += 'small';
      // 	} else if (childCount < 100) {
      // 		c += 'medium';
      // 	} else {
      // 		c += 'large';
      // 	}
    
      // 	return new L.DivIcon({ html: '<div><span>' + childCount + '</span></div>', className: 'marker-cluster marker-cluster' + c, iconSize: new L.Point(50, 50) });
      // }
    };

    this.mapLayers = L.markerClusterGroup(clusterGroupOptions);
    this.addMarkers();
  }

  addMarkers() : void
  {
    this.trafficData.forEach(element => {
      if (element != null && element.location != null){
        let marker = L.marker([element.location.coordinates[1], element.location.coordinates[0]]);
        let cause = element.consequence.summary;
        marker.bindPopup(this.createPopupContent(element), {className: "popup"});

        if(cause == "Sperrung") {
          marker.setIcon(this.roadClosureIcon);
          this.roadClosures.addLayer(marker);
        } else if(cause == "Baustelle" || cause == "Bauarbeiten") {
          marker.setIcon(this.constructionSiteIcon);
          this.constructionSites.addLayer(marker);
        } else if(cause == "Fahrstreifensperrung") {
          marker.setIcon(this.lineClosureIcon);
          this.laneClosures.addLayer(marker);
        } else if(cause == "Stau") {
          marker.setIcon(this.trafficJamIcon);
          this.trafficJams.addLayer(marker);
        } else if(cause == "Unfall") {
          marker.setIcon(this.accidentIcon);
          this.accidents.addLayer(marker);
        } else if(cause == "Gefahr" || cause == "Störung") {
          marker.setIcon(this.dangerIcon);
          this.dangers.addLayer(marker);
        }
      }
    });

    this.entriesPerCategory[0] = this.roadClosures.getLayers().length.toString();
    this.entriesPerCategory[1] = this.constructionSites.getLayers().length.toString();
    this.entriesPerCategory[2] = this.laneClosures.getLayers().length.toString();
    this.entriesPerCategory[3] = this.trafficJams.getLayers().length.toString();
    this.entriesPerCategory[4] = this.accidents.getLayers().length.toString();
    this.entriesPerCategory[5] = this.dangers.getLayers().length.toString();

    if(this.options.showRoadClosures)
      this.mapLayers.addLayer(this.roadClosures);
    if(this.options.showConstructionSites)
      this.mapLayers.addLayer(this.constructionSites);
    if(this.options.showLaneClosures)
      this.mapLayers.addLayer(this.laneClosures);
    if(this.options.showTrafficJams)
      this.mapLayers.addLayer(this.trafficJams);
    if(this.options.showAccidents)
      this.mapLayers.addLayer(this.accidents);
    if(this.options.showDangers)
      this.mapLayers.addLayer(this.dangers);
    this.map.addLayer(this.mapLayers);
  }

  createPopupContent(element) : string
  {
    let popUpContent = "<p>";
        if(element.consequence.summary != null)
          popUpContent += `<b>${element.consequence.summary}</b>`;
        if(element.streets != null)
          popUpContent += `<b> - ${element.streets[0]}</b>`;
        if(element.section != null)
          popUpContent += `<br><br>${element.section}`;
        if(element.description != null)
          popUpContent += `<br><br>${element.description}`;
        if(element.validities[0] != null)
          popUpContent += `<br><br>Von: ${this.formatDate(element.validities[0].timeFrom)}
                           <br>Bis: ${this.formatDate(element.validities[0].timeTo)}`;
        popUpContent += "</p>";
        return popUpContent;
  }

  formatDate(dateStr : string) : string
  {
    let date = new Date(dateStr);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'};
    let output = date.toLocaleString('de-DE', options);
    return output;
  }
}