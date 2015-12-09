---
layout: post
title: "Let It Snow with the Accuweather Gem"
date: 2015-12-08 22:09:29 -0800
comments: true
categories: gems utilities web-api
---

AccuWeather is one of the standard widgets on my Android phone. I found no API wrapper for it after
searching [rubygems.org](https://rubygems.org) and I thought it would be fun to write one after spending a little time
reverse engineering the web API ([related post]({% post_url 2015-10-15-reverse-engineering-web-apis-using-mobile-apps %})).

{% img left /assets/2015-12-08-let-it-snow-with-accuweather/images/accuweather.png 250 auto %}

First, find a location via the city search API:

{% codeblock lang:rb %}
require 'accuweather'

locations = Accuweather.city_search(name: 'vancouver')
{% endcodeblock %}

This returns a list of locations that match the input. Each location provides several pieces of information including
a city identifier:

{% codeblock lang:rb %}
vancouver = locations.first

vancouver.id        # => 'cityId:53286'
vancouver.city      # => 'Vancouver'
vancouver.state     # => 'Canada (British Columbia)'
vancouver.latitude  # => '49.2448'
vancouver.longitude # => '123.1154'
{% endcodeblock %}

The gem caches over 175K cities around the world. If the location `name` is not in the cache, the gem will
make a HTTP request to AccuWeather to try and find it.

The location identifier is used to get more information about current weather conditions:

{% codeblock lang:rb %}
current_weather = Accuweather.get_conditions(location_id: 'cityId:53286').current
current_weather.temperature    # => '41'
current_weather.weather_text   # => 'Partly Sunny'
current_weather.pressure       # => '30.35'
current_weather.humidity       # => '43%'
current_weather.cloud_cover    # => '40%'
{% endcodeblock %}

A week of day and nighttime forecasts are available:

{% codeblock lang:rb %}
weather_forecast = Accuweather.get_conditions(location_id: 'cityId:53286').forecast
last_forecast_day = weather_forecast.last
last_forecast_day.date        # => "12/3/2015"
last_forecast_day.day_of_week # => "Thursday"
last_forecast_day.sunrise     # => "7:49 AM"
last_forecast_day.sunset      # => "4:16 PM"

# Get the dates, daytime high and nighttime low temperatures
weather_forecast.map(&:date)                             #  => ["11/27/2015", "11/28/2015", "11/29/2015", "11/30/2015", "12/1/2015", "12/2/2015", "12/3/2015"]
weather_forecast.map(&:daytime).map(&:high_temperature)  # => ["45", "45", "47", "44", "44", "48", "48"]
weather_forecast.map(&:nighttime).map(&:low_temperature) # => ["27", "28", "31", "32", "40", "42", "36"]
{% endcodeblock %}

The API returns a `weather_icon` number for the current weather and forecast. This number appears to correspond to PNG
file from AccuWeather.com. I downloaded the full set of PNG files and included them here, but found a handful of better
looking weather webfonts out there (links below).

Related resources:

- Full accuweather icon set ([download ZIP](/assets/2015-12-08-let-it-snow-with-accuweather/images/accuweather_icons.zip))
- [Weather Icons](https://erikflowers.github.io/weather-icons/)
- [Meteocons](http://www.alessioatzeni.com/meteocons/)

Accuweather gem links:

- [Source code](https://github.com/nick-aschenbach/accuweather)
- [RubyGems.org Link](https://rubygems.org/gems/accuweather)

Stay warm out there and have fun!