import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
//import { WalkingSkeletonComponent } from './components/walking-skeleton/walking-skeleton.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { StatisticsPageComponent } from './components/statistics-page/statistics-page.component';
import { InfoPageComponent } from './components/info-page/info-page.component';
import { ErrorPageComponent } from './components/error-page/error-page.component';
import { MapComponent } from './components/home-page/map/map.component';

@NgModule({
  declarations: [
    AppComponent,
    //WalkingSkeletonComponent,
    HomePageComponent,
    StatisticsPageComponent,
    InfoPageComponent,
    ErrorPageComponent,
    MapComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
