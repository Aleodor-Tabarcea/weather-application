import { Component, AfterViewInit } from '@angular/core';
import { NavController } from 'ionic-angular';

import { GeolocationService } from '../../services/geolocation.service';
import { WeatherService } from '../../services/weather.service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage implements AfterViewInit {

  constructor(public navCtrl: NavController,
              private _geolocationService: GeolocationService,
              private _weatherService: WeatherService
              ) {
  }

  ngAfterViewInit(){
    this._geolocationService.getGeolocation()
      .then((resolve) => {
        console.log(resolve);
        this._weatherService.getWeather(resolve)
          .subscribe((resolve) => {
            console.log(resolve);
          })
      })
      .catch((error) => function(){
        console.log('Fuck this shit!');
      });

    
  }


}
