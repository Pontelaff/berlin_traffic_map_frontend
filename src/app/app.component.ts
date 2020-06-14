import { Component } from '@angular/core';
import { DomSanitizer } from "@angular/platform-browser";
import { MatIconRegistry } from '@angular/material/icon'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
    
  constructor(private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer){
    this.matIconRegistry.addSvgIcon(
      `road_closure`,
      this.domSanitizer.bypassSecurityTrustResourceUrl("assets/road_closure_icon.svg")
    );
    this.matIconRegistry.addSvgIcon(
      `construction_site`,
      this.domSanitizer.bypassSecurityTrustResourceUrl("assets/construction_site_icon.svg")
    );
    this.matIconRegistry.addSvgIcon(
      `lane_closure`,
      this.domSanitizer.bypassSecurityTrustResourceUrl("assets/lane_closure_icon.svg")
    );
    this.matIconRegistry.addSvgIcon(
      `accident`,
      this.domSanitizer.bypassSecurityTrustResourceUrl("assets/accident_icon.svg")
    );
    this.matIconRegistry.addSvgIcon(
      `danger`,
      this.domSanitizer.bypassSecurityTrustResourceUrl("assets/danger_icon.svg")
    );
  }

  title = 'bb-traffic';
}
