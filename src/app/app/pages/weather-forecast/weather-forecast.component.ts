import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { GeolocationService } from '@ng-web-apis/geolocation';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WeatherData } from '../../shared/models/weather.model';
import { WeatherService } from '../../shared/services/weather.service';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription, take } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';


@Component({
  selector: 'app-weather-forecast',
  templateUrl: './weather-forecast.component.html',
  styleUrls: ['./weather-forecast.component.scss']
})
export class WeatherForecastComponent implements OnInit, OnDestroy {

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  weatherData: WeatherData[] = [];

  weatherForecastForm: FormGroup = new FormGroup({});
  isLoading: boolean = false;
  dataSource: MatTableDataSource<WeatherData>;
  displayedColumns = ['time', 'temperature', 'humidity'];

  weatherSubscription?: Subscription;
  locationSubscription?: Subscription;

  constructor(
    private fb: FormBuilder,
    private readonly geolocation$: GeolocationService,
    private WeatherService: WeatherService) {
    this.dataSource = new MatTableDataSource<WeatherData>([])
  }

  ngOnInit(): void {
    this.buildForm();
    this.getLocation();
  }

  ngOnDestroy(): void {
    this.weatherSubscription?.unsubscribe();
    this.locationSubscription?.unsubscribe();
  }

  buildForm(): void {
    this.weatherForecastForm = this.fb.group({
      longitude: ['', [
        Validators.required,
        Validators.min(-180),
        Validators.max(180)]],
      latitude: ['', [
        Validators.required,
        Validators.min(-90),
        Validators.max(90),
      ]],
    })
  }

  getWeatherForecast(): void {
    if (this.weatherForecastForm.invalid) {
      return;
    }
    this.isLoading = true;
    const lon = this.weatherForecastForm.value.longitude;
    const lat = this.weatherForecastForm.value.latitude;

    this.weatherSubscription = this.WeatherService.getWeatherForecast(lat, lon).subscribe((res) => {
      res.timeseries.map((item) => {
        this.weatherData.push({
          time: item.time,
          air_temperature: item.data.instant.details.air_temperature,
          relative_humidity: item.data.instant.details.relative_humidity,
        })
      })
      this.dataSource.data = this.weatherData;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.isLoading = false;
    })
  }

  getLocation(): void {
    this.locationSubscription = this.geolocation$.pipe(take(1)).subscribe((position) => {
        this.weatherForecastForm.patchValue({
          longitude: position.coords.longitude,
          latitude: position.coords.latitude,
        })
    });
  }
}
