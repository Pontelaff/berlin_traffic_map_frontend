import { NgModule } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon'

const material = [  
  MatSidenavModule,
  MatToolbarModule,
  MatIconModule,  
];

@NgModule({
  imports: [material],
  exports: [material]
})
export class MaterialModule { }
