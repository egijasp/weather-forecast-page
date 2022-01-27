import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable, pluck} from "rxjs";
import {WeatherApiData} from "../models/weather.model";
import {environment} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})

export class WeatherService {
  constructor(private http: HttpClient) {
  }

  getWeatherForecast(lat: string, lon: string): Observable<WeatherApiData>{
    const url = [
      environment.baseUrl,
        `?lat=${lat}&lon=${lon}`
    ].join('');

    return this.http.get<WeatherApiData>(url).pipe(pluck('properties')) as Observable<WeatherApiData>;
  }
}

