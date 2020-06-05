import { NgModule } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon'
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';


const material = [  
  MatSidenavModule,
  MatToolbarModule,
  MatIconModule,
  MatDatepickerModule,
  MatMomentDateModule,
  MatFormFieldModule,
  MatInputModule,
  MatMenuModule,
];

@NgModule({
  imports: [material],
  exports: [material]
})
export class MaterialModule { }
