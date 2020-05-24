import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from './components/home-page/home-page.component';
import { StatisticsPageComponent } from './components/statistics-page/statistics-page.component';
import { InfoPageComponent } from './components/info-page/info-page.component';


const routes: Routes = [
  {path: 'home', component: HomePageComponent},
  {path: 'statistics', component: StatisticsPageComponent},
  {path: 'info', component: InfoPageComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
