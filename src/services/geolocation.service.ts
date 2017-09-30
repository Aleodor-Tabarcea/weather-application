import { Injectable } from '@angular/core';

import { Geolocation }  from '@ionic-native/geolocation';

import { Coordinates } from '../models/coordinates';

@Injectable()

export class GeolocationService {

    private currentCoordinatesPromise:Promise<Coordinates>;

    constructor(
        private _geolocation: Geolocation
                ){

        this.currentCoordinatesPromise = _geolocation.getCurrentPosition().then((resolve) => {
            let currentCoordinates = new Coordinates(
                                            resolve.coords.longitude,
                                            resolve.coords.latitude
                                        );

            return new Promise<Coordinates>(function(resolve, reject) {
                resolve(currentCoordinates);
            });
        });
    }

    getGeolocation() {
        return this.currentCoordinatesPromise;
    }
}