import { Component, AfterViewInit } from '@angular/core';
import { NavController } from 'ionic-angular';

import { GeolocationService } from '../../services/geolocation.service';
import { WeatherService } from '../../services/weather.service';

import { Weather } from '../../models/weather';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage implements AfterViewInit {

  data:Weather = new Weather('a', 'a', 'a', 'a', 1);

  arrayDaysForecast = {
    today : {
      min: 1000,
      max: -1000
    },
    tommorow : {
      min: 1000,
      max: -1000
    },
    twoDays : {
      min: 1000,
      max: -1000
    }
  };

  constructor(public navCtrl: NavController,
              private _geolocationService: GeolocationService,
              private _weatherService: WeatherService
              ) {
  }

  ngAfterViewInit(){
    this._geolocationService.getGeolocation()
      .then((resolve) => {
        this._weatherService.getWeather(resolve)
          .subscribe((response) => {
            this.data = new Weather(
              response.name,
              response.sys.country,
              response.weather[0].icon,
              response.weather[0].description,
              response.main.temp
            );
            console.log(this.data);
          });

        this._weatherService.getForecast(resolve)
          .subscribe((response) => {
            this.parseForecast(response);
          });
      })
      .catch((error) => function(){
        console.log('Fuck this shit!');
      });
  }

  parseForecast = function(data){

    var seedToday = new Date(Date.now());
    var today = seedToday.getFullYear() + "-"  + ("0"+(seedToday.getMonth()+1)).slice(-2) + "-" + ("0" + seedToday.getDate()).slice(-2);
    
    var seedTommorow = new Date(Date.now() + 24 * 60 * 60 * 1000);
    var tomorrow = seedTommorow.getFullYear() + "-"  + ("0"+(seedTommorow.getMonth()+1)).slice(-2) + "-" + ("0" + seedTommorow.getDate()).slice(-2);

    var seedInTwoDays = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
    var twoDays = seedInTwoDays.getFullYear() + "-"  + ("0"+(seedInTwoDays.getMonth()+1)).slice(-2) + "-" + ("0" + seedInTwoDays.getDate()).slice(-2);

    var predictionsArray = data.list;

    predictionsArray.forEach(elem => {
      if(elem.dt_txt.startsWith(today)){
        this.arrayDaysForecast.today.min = Math.min(this.arrayDaysForecast.today.min, elem.main.temp);
        this.arrayDaysForecast.today.max = Math.max(this.arrayDaysForecast.today.max, elem.main.temp);
      }
      if(elem.dt_txt.startsWith(tomorrow)){
        this.arrayDaysForecast.tommorow.min = Math.min(this.arrayDaysForecast.tommorow.min, elem.main.temp);
        this.arrayDaysForecast.tommorow.max = Math.max(this.arrayDaysForecast.tommorow.max, elem.main.temp);
      }
      if(elem.dt_txt.startsWith(twoDays)){
        this.arrayDaysForecast.twoDays.min = Math.min(this.arrayDaysForecast.twoDays.min, elem.main.temp);
        this.arrayDaysForecast.twoDays.max = Math.max(this.arrayDaysForecast.twoDays.max, elem.main.temp);
      }
    });

    console.log(this.arrayDaysForecast);

  }

}
