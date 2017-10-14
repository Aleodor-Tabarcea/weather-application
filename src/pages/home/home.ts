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
    tomorrow : {
      min: 1000,
      max: -1000
    },
    twoDays : {
      min: 1000,
      max: -1000
    }
  };

  darkTheme = false;

  dataRetrieved = 0;

  infoDrawerHidden = true;

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
              Math.round(response.main.temp)
            );
            this.mapIcon();
            this.dataRetrieved++;
          });

        this._weatherService.getForecast(resolve)
          .subscribe((response) => {
            this.parseForecast(response);
            this.dataRetrieved++;
          });
      })
      .catch((error) => function(){
        console.log('Fuck this shit!');
      });
  }

  openDrawer = function(){
    console.log('See info!');
  }

  mapIcon = function(){

    if(this.data.icon.substring(2,3) == 'n'){
      this.darkTheme = true;
    }

    switch(this.data.icon){
      case '01d':
        this.data.icon = 'flaticon-sun';
        break;
      case '02d':
        this.data.icon = 'flaticon-cloud';
        break;
      case '03d':
      case '03n':
        this.data.icon = 'flaticon-clouds';
        break;
      case '04d':
      case '04n':
        this.data.icon = 'flaticon-cloudy';
        break;
      case '09d':
      case '09n':
        this.data.icon = 'flaticon-rain-1';
        break;
      case '10d':
        this.data.icon = 'flaticon-rain-2';
        break;
      case '11d':
      case '11n':
        this.data.icon = 'flaticon-storm';
        break;
      case '13d':
      case '13n':
        this.data.icon = 'flaticon-snowing';
        break;
      case '50d':
      case '50n':
        this.data.icon = 'flaticon-mist';
        break;
      case '01n':
        this.data.icon = 'flaticon-night-1';
        break;
      case '02n':
        this.data.icon = 'flaticon-night-2';
        break;
      case '10n':
        this.data.icon = 'flaticon-rainy';
        break;
      default:
        this.data.icon = 'flaticon-clouds';
        break;
    }
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
        this.arrayDaysForecast.today.min = Math.round(Math.min(this.arrayDaysForecast.today.min, elem.main.temp));
        this.arrayDaysForecast.today.max = Math.round(Math.max(this.arrayDaysForecast.today.max, elem.main.temp));
      }
      if(elem.dt_txt.startsWith(tomorrow)){
        this.arrayDaysForecast.tomorrow.min = Math.round(Math.min(this.arrayDaysForecast.tomorrow.min, elem.main.temp));
        this.arrayDaysForecast.tomorrow.max = Math.round(Math.max(this.arrayDaysForecast.tomorrow.max, elem.main.temp));
      }
      if(elem.dt_txt.startsWith(twoDays)){
        this.arrayDaysForecast.twoDays.min = Math.round(Math.min(this.arrayDaysForecast.twoDays.min, elem.main.temp));
        this.arrayDaysForecast.twoDays.max = Math.round(Math.max(this.arrayDaysForecast.twoDays.max, elem.main.temp));
      }
    });

    console.log(this.arrayDaysForecast);

  }

  getDaysNameArray = function(){
    var tempObj ={
      today: 'Today',
      tomorrow: 'Tomorrow',
      twoDays: 'In 2 days'
    }

    var date = new Date(Date.now());
    tempObj.today = date.toDateString().substring(0, 10);

    date = new Date(Date.now() + 24 * 60 * 60 * 1000);
    tempObj.tomorrow = date.toDateString().substring(0, 10);

    date = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
    tempObj.twoDays = date.toDateString().substring(0, 10);

    return tempObj;
  }

  daysStringName = this.getDaysNameArray();

}
