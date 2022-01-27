import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Weather, WeatherData} from "../../shared/models/weather.model";
import {WeatherService} from "../../shared/services/weather.service";
import {MatTableDataSource} from "@angular/material/table";
import {Subscription} from "rxjs";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";

@Component({
  selector: 'app-weather-forecast',
  templateUrl: './weather-forecast.component.html',
  styleUrls: ['./weather-forecast.component.scss']
})
export class WeatherForecastComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  weatherForecastForm: FormGroup = new FormGroup({});
  isLoading: boolean = false;
  dataSource: MatTableDataSource<WeatherData>;
  displayedColumns = ['time', 'air_temperature', 'relative_humidity'];

  weatherSubscription?: Subscription;


  constructor(
    private fb: FormBuilder,
    private WeatherService: WeatherService) {
    this.dataSource = new MatTableDataSource<WeatherData>([])
  }

  ngOnInit(): void {
    this.buildForm();
  }

  ngOnDestroy(): void {
    this.weatherSubscription?.unsubscribe();
  }

  buildForm(): void {
    this.weatherForecastForm = this.fb.group({
      longitude: ['', [
        Validators.required,
        Validators.min(-90),
        Validators.max(90)]],
      latitude: ['', [
        Validators.required,
        Validators.min(-180),
        Validators.max(180),
      ]],
    })
  }

  getWeatherForecast(): void {
      this.isLoading = true;
      const lon = this.weatherForecastForm.value.longitude;
      const lat = this.weatherForecastForm.value.latitude;

      this.weatherSubscription = this.WeatherService.getWeatherForecast(lat, lon).subscribe((res) => {
        console.log(res)
        const weatherData: WeatherData[] = [];
        res.timeseries.map((item: Weather) => {
          weatherData.push({
            time: item.time,
            air_temperature: item.data.instant.details.air_temperature.toString(),
            relative_humidity: item.data.instant.details.relative_humidity.toString(),
          })
        })
          this.dataSource.data = weatherData;
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.isLoading = false;
      })
  }



}
