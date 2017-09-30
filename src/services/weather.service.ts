import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Coordinates } from '../models/coordinates';

import 'rxjs/add/operator/map';

@Injectable()

export class WeatherService {

    weatherApiUrl = 'https://api.openweathermap.org/data/2.5/weather';
    forecastApiUrl = 'https://api.openweathermap.org/data/2.5/forecast';
    
    apiKey = 'dabff28558e69db4ee680303d2edc965'

    constructor (
        private http:Http
    ){

    }

    getWeather(coordinates: Coordinates){
        return this.http.get(
            `${this.weatherApiUrl}?lat=${coordinates.latitude}&lon=${coordinates.longitude}&appId=${this.apiKey}&units=metric`
        ).map((res:Response) => res.json());
    }

    getForecast(coordinates: Coordinates){
         return this.http.get(
            `${this.forecastApiUrl}?lat=${coordinates.latitude}&lon=${coordinates.longitude}&appId=${this.apiKey}&units=metric`
        ).map((res:Response) => res.json());
    }
}