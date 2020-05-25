import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from './components/home-page/home-page.component';
import { StatisticsPageComponent } from './components/statistics-page/statistics-page.component';
import { InfoPageComponent } from './components/info-page/info-page.component';
import { ErrorPageComponent } from './components/error-page/error-page.component';


const routes: Routes = [
  {path: 'home', component: HomePageComponent},
  {path: 'statistics', component: StatisticsPageComponent},
  {path: 'info', component: InfoPageComponent},
  {path: '', redirectTo: '/home', pathMatch: 'full'},         //redirect to landing page
  {path: '**', component: ErrorPageComponent},                 //wildcard route, later to be replaced by 404, PLACE LAST IN ARRAY!
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
