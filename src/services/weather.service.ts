import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Coordinates } from '../models/coordinates';

import 'rxjs/add/operator/map';

@Injectable()

export class WeatherService {

    apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
    apiKey = 'dabff28558e69db4ee680303d2edc965'

    constructor (
        private http:Http
    ){

    }

    getWeather(coordinates: Coordinates){
        return this.http.get(
            `${this.apiUrl}?lat=${coordinates.latitude}&lon=${coordinates.longitude}&appId=${this.apiKey}&units=metric`
        ).map((res:Response) => res.json());
    }
}