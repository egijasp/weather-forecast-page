export interface WeatherApiData {
    timeseries: [{
      time: string,
      data: {
        instant: {
          details: {
            air_temperature: number,
            relative_humidity: number,
          }
        }
      }
    }]
  }

  export interface Weather {
    time: string,
    data: {
      instant: {
        details: {
          air_temperature: number,
          relative_humidity: number,
        }
      }
    }
  }

  export interface WeatherData {
    time: string,
    air_temperature: number,
    relative_humidity: number,
  }
