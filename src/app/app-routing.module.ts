import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {WeatherForecastComponent} from "./app/pages/weather-forecast/weather-forecast.component";
import {HomeComponent} from "./app/pages/home/home.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'weather-forecast',
    component: WeatherForecastComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
