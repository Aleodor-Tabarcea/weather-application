import { Component, AfterViewInit } from '@angular/core';
import { NavController } from 'ionic-angular';

import { GeolocationService } from '../../services/geolocation.service';
import { WeatherService } from '../../services/weather.service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage implements AfterViewInit {

  data = {
    city: null,
    country: null,
    icon: null,
    temperature: null,
    conclusion: null
  }

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
          .subscribe((response) => {
            this.data.city = response.name;
            this.data.country = response.sys.country;
            this.data.temperature = response.main.temp;
            this.data.icon = response.weather[0].icon;
            this.data.conclusion = response.weather[0].description;
            console.log(this.data);
          })
      })
      .catch((error) => function(){
        console.log('Fuck this shit!');
      });

    
  }


}
