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
  dateTo: new Date(),
  dateFrom: new Date(),
  showRoadClosures: true,
  showConstructionSites: true,  
  showLineClosures: true,
  showTrafficJams: true,
  showDangers: true,
  };

  constructionSites = L.markerClusterGroup({
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: false,
    //disableClusteringAtZoom: 16,
    maxClusterRadius: 20,
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
  });

  dangers = L.markerClusterGroup({
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: false,
    //disableClusteringAtZoom: 16,
    maxClusterRadius: 20,
  });

  trafficJams = L.markerClusterGroup({
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: false,
    //disableClusteringAtZoom: 16,
    maxClusterRadius: 20,
  });

  roadClosures = L.markerClusterGroup({
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: false,
    //disableClusteringAtZoom: 16,
    maxClusterRadius: 20,
  });

  laneClosures = L.markerClusterGroup({
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: false,
    //disableClusteringAtZoom: 16,
    maxClusterRadius: 20,
  });

  constructionSiteIcon = L.icon({
    iconUrl: 'assets/200px-Construction.png',
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

  trafficJamIcon = L.icon({
    iconUrl: 'assets/200px-Traffic-Jam.png',
    iconSize:     [50, 44], // size of the icon
    iconAnchor:   [25, 22], // point of the icon which will correspond to marker's location
    popupAnchor:  [0, -24] // point from which the popup should open relative to the iconAnchor
  });

  roadClosureIcon = L.icon({
    iconUrl: 'assets/200px-Closure.png',
    iconSize:     [50, 50], // size of the icon
    iconAnchor:   [25, 25], // point of the icon which will correspond to marker's location
    popupAnchor:  [0, -27] // point from which the popup should open relative to the iconAnchor
  });

  lineClosureIcon = L.icon({
    iconUrl: 'assets/200px-Lane-Closure.png',
    iconSize:     [50, 44], // size of the icon
    iconAnchor:   [25, 22], // point of the icon which will correspond to marker's location
    popupAnchor:  [0, -24] // point from which the popup should open relative to the iconAnchor
  });

  ngAfterViewInit(): void {
    this.options.dateFrom.setDate(this.options.dateFrom.getDate()-14);
    this.initMap();
  }

  toogleRoadClosures(event){
    event.checked ? this.map.addLayer(this.roadClosures) : this.map.removeLayer(this.roadClosures);
  }

  toogleConstructionSites(event){
    event.checked ? this.map.addLayer(this.constructionSites) : this.map.removeLayer(this.constructionSites);
  }

  toogleLaneClosures(event){
    event.checked ? this.map.addLayer(this.laneClosures) : this.map.removeLayer(this.laneClosures);
  }

  toogleTrafficJams(event){
    event.checked ? this.map.addLayer(this.trafficJams) : this.map.removeLayer(this.trafficJams);
  }

  toogleDangers(event){
    event.checked ? this.map.addLayer(this.dangers) : this.map.removeLayer(this.dangers);
  }

  applyClick() {
    // this.map.eachLayer(function (layer){
    //   this.map.removeLayer(layer);
    // });
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

  makeData()
  {
    let dataFromFormatted = this.options.dateFrom.toISOString().slice(0, 10);
    let dataToFormatted = this.options.dateTo.toISOString().slice(0, 10);

    this.apiService.fetchFromTo(dataFromFormatted, dataToFormatted).subscribe((data:any[])=>{ 
      this.trafficData = data;
      this.markerUpdateRoutine();
       });
  }

  markerUpdateRoutine() :void {
    console.log("Data Length " + this.trafficData.length);
    this.addMarkers();
  }

  addMarkers() :void {
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
        } else {//if(element.name == "Gefahr" || element.name == "Unfall")
        marker.setIcon(this.dangerIcon);
        this.dangers.addLayer(marker);
        }
      }
    });

    if(this.options.showRoadClosures == true)
      this.map.addLayer(this.roadClosures);
    if(this.options.showConstructionSites == true)
      this.map.addLayer(this.constructionSites);
    if(this.options.showLineClosures == true)
      this.map.addLayer(this.laneClosures);
    if(this.options.showTrafficJams == true)
      this.map.addLayer(this.trafficJams);
    if(this.options.showDangers == true)
    this.map.addLayer(this.dangers);
  }

  createPopupContent(element) : string {
    let popUpContent = "<p>";
        if(element.consequence.summary != null)
          popUpContent += "<b>" + element.consequence.summary + "</b>";
        if(element.streets != null)
          popUpContent += "<b> - " + element.streets[0] + "</b>";
        if(element.section != null)
          popUpContent += "<br><br>" + element.section;
        if(element.description != null)
          popUpContent += "<br><br>" + element.description;
        if(element.validities[0] != null)
          popUpContent += "<br><br>Von: " + element.validities[0].timeFrom
                        + "<br>Bis: " + element.validities[0].timeTo;
        popUpContent += "</p>";
        return popUpContent;
  }
}