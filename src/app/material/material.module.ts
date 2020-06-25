import { NgModule } from '@angular/core';
import { DomSanitizer } from "@angular/platform-browser";
import { MatIconRegistry } from '@angular/material/icon'
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon'
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


const material = [  
  MatSidenavModule,
  MatToolbarModule,
  MatIconModule,
  MatDatepickerModule,
  MatMomentDateModule,
  MatFormFieldModule,
  MatInputModule,
  MatMenuModule,
  MatListModule,
  MatCheckboxModule,
  MatSelectModule,
  MatCardModule,
  MatButtonModule,
  MatProgressSpinnerModule
];

@NgModule({
  imports: [material],
  exports: [material]
})
export class MaterialModule {
    
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
 }
