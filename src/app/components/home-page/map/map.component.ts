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

  lastTwoWeeks = [];
  trafficData = [];
  options = {
  dateFrom: new Date(),
  dateTo: new Date(),
  showRoadClosures: true,
  showConstructionSites: true,  
  showLineClosures: true,
  showTrafficJams: true,
  showAccidents: true,
  showDangers: true,
  };

  mapLayers = L.layerGroup();  

  //roadClosures = L.markerClusterGroup(this.clusterGroupOptions);
  // constructionSites = L.markerClusterGroup(this.clusterGroupOptions);
  // laneClosures = L.markerClusterGroup(this.clusterGroupOptions);
  // trafficJams = L.markerClusterGroup(this.clusterGroupOptions);
  // accidents = L.markerClusterGroup(this.clusterGroupOptions);
  // dangers = L.markerClusterGroup(this.clusterGroupOptions);

  roadClosures:L.MarkerClusterGroup;
  constructionSites:L.MarkerClusterGroup;
  laneClosures:L.MarkerClusterGroup;
  trafficJams:L.MarkerClusterGroup;
  accidents:L.MarkerClusterGroup;
  dangers:L.MarkerClusterGroup;

  roadClosureIcon = L.icon({
    iconUrl: 'assets/200px-Closure.png',
    iconSize:     [50, 50], // size of the icon
    iconAnchor:   [25, 25], // point of the icon which will correspond to marker's location
    popupAnchor:  [0, -27] // point from which the popup should open relative to the iconAnchor
  });

  constructionSiteIcon = L.icon({
    iconUrl: 'assets/200px-Construction.png',
    iconSize:     [50, 44], // size of the icon
    iconAnchor:   [25, 22], // point of the icon which will correspond to marker's location
    popupAnchor:  [0, -24] // point from which the popup should open relative to the iconAnchor
  });

  lineClosureIcon = L.icon({
    iconUrl: 'assets/200px-Lane-Closure.png',
    iconSize:     [50, 44], // size of the icon
    iconAnchor:   [25, 22], // point of the icon which will correspond to marker's location
    popupAnchor:  [0, -24] // point from which the popup should open relative to the iconAnchor
  });

  trafficJamIcon = L.icon({
    iconUrl: 'assets/200px-Traffic-Jam.png',
    iconSize:     [50, 44], // size of the icon
    iconAnchor:   [25, 22], // point of the icon which will correspond to marker's location
    popupAnchor:  [0, -24] // point from which the popup should open relative to the iconAnchor
  });

  accidentIcon = L.icon({
    iconUrl: 'assets/200px-Accident.png',
    iconSize:     [50, 44], // size of the icon
    iconAnchor:   [25, 22], // point of the icon which will correspond to marker's location
    popupAnchor:  [0, -24] // point from which the popup should open relative to the iconAnchor
  });

  dangerIcon = L.icon({
    iconUrl: 'assets/200px-Danger.png',
    iconSize:     [50, 44], // size of the icon
    iconAnchor:   [25, 22], // point of the icon which will correspond to marker's location
    popupAnchor:  [0, -24] // point from which the popup should open relative to the iconAnchor
  });

  ngAfterViewInit(): void {
    this.options.dateFrom.setDate(this.options.dateFrom.getDate()-14);
    this.initMap();
  }

  toogleRoadClosures(event){
    event.checked ? this.mapLayers.addLayer(this.roadClosures) : this.mapLayers.removeLayer(this.roadClosures);
  }

  toogleConstructionSites(event){
    event.checked ? this.mapLayers.addLayer(this.constructionSites) : this.mapLayers.removeLayer(this.constructionSites);
  }

  toogleLaneClosures(event){
    event.checked ? this.mapLayers.addLayer(this.laneClosures) : this.mapLayers.removeLayer(this.laneClosures);
  }

  toogleTrafficJams(event){
    event.checked ? this.mapLayers.addLayer(this.trafficJams) : this.mapLayers.removeLayer(this.trafficJams);
  }

  toogleAccidents(event){
    event.checked ? this.mapLayers.addLayer(this.accidents) : this.mapLayers.removeLayer(this.accidents);
  }

  toogleDangers(event){
    event.checked ? this.mapLayers.addLayer(this.dangers) : this.mapLayers.removeLayer(this.dangers);
  }

  applyClick() {
    this.makeData();
  }

  setTestDates() {
    this.options.dateFrom = new Date(2000, 1, 1);    
    this.options.dateTo = new Date(2040, 1, 1);
    this.makeData();
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
    var dataLength = this.trafficData.length;    
    console.log("data lenght: " + dataLength);
    console.log("cluster range: " + dataLength / 40);
    var clusterGroupOptions = {
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: false,
      maxClusterRadius: function(zoom) {
        return dataLength / 40;
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

    this.mapLayers.clearLayers();
    this.roadClosures = L.markerClusterGroup(clusterGroupOptions);
    this.constructionSites = L.markerClusterGroup(clusterGroupOptions);
    this.laneClosures = L.markerClusterGroup(clusterGroupOptions);
    this.trafficJams = L.markerClusterGroup(clusterGroupOptions);
    this.accidents = L.markerClusterGroup(clusterGroupOptions);
    this.dangers = L.markerClusterGroup(clusterGroupOptions);
    this.addMarkers();
    this.updateClusterRange();
  }

  addMarkers() : void
  {
    this.trafficData.forEach(element => {
      if (element != null && element.location != null){
        let marker = L.marker([element.location.coordinates[1], element.location.coordinates[0]]);
        marker.bindPopup(this.createPopupContent(element), {className: "popup"});

        let cause = element.consequence.summary;
        if(cause == "Sperrung") {
          marker.setIcon(this.roadClosureIcon);
          this.roadClosures.addLayer(marker);
        } else if(cause == "Baustelle" || cause == "Bauarbeiten") {
          marker.setIcon(this.constructionSiteIcon);
          this.constructionSites.addLayer(marker);
        } else if(cause == "Stau") {
          marker.setIcon(this.trafficJamIcon);
          this.trafficJams.addLayer(marker);
        } else if(cause == "Fahrstreifensperrung") {
          marker.setIcon(this.lineClosureIcon);
          this.laneClosures.addLayer(marker);
        } else if(cause == "Unfall") {
          marker.setIcon(this.accidentIcon);
          this.accidents.addLayer(marker);
        } else if(cause == "Gefahr" || cause == "Störung") {
          marker.setIcon(this.dangerIcon);
          this.dangers.addLayer(marker);
        }
      }
    });

    if(this.options.showRoadClosures)
      this.mapLayers.addLayer(this.roadClosures);
    if(this.options.showConstructionSites)
      this.mapLayers.addLayer(this.constructionSites);
    if(this.options.showLineClosures)
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
    var date = new Date(dateStr);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'};
    var output = date.toLocaleString('de-DE', options);
    return output;
  }
  
  updateClusterRange() : void
  {
    this.roadClosures.refreshClusters();
    this.constructionSites.refreshClusters();
    this.laneClosures.refreshClusters();
    this.trafficJams.refreshClusters();
    this.accidents.refreshClusters();
    this.dangers.refreshClusters();
  }
}
