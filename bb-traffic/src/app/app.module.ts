import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WalkingSkeletonComponent } from './components/walking-skeleton/walking-skeleton.component';

@NgModule({
  declarations: [
    AppComponent,
    WalkingSkeletonComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
