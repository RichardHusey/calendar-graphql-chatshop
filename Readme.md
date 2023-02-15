This is Graphql-Express-TypeScript Server for Church Calendar.

To start server, please type "npm start".
Enjoy it.

Richard Husey. 

API Documentation
The Church Calendar API provides access to calendar data for any day.

Swagger: Apart of this documentation for humans, there is also a Swagger documentation, which can be loaded in your favourite Swagger API browser or even used to generate client code.

Client libraries
Ruby: calendarium-romanum-remote
Specify API Version and Language
API version must be specified at the beginning of each request path /api/:version/:lang Right now the API only has version 0 v0 and a few supported languages:

en English
fr French
it Italian
la Latin
cs Czech
Full example: /api/v0/en

Due to a design flaw this API version handles temporale and sanctorale feast names independently. Temporale feast names are governed by language specified in request path. E.g. /api/v0/en/calendars/czech/... would return a mixture of Czech (for sanctorale) and English (for temporale) feast names. In order to have all Czech, it is necessary to specify Czech language. /api/v0/cs/calendars/czech/...

In the following examples the common beginning explained above is omitted for brevity.

Select Calendar to Query
/calendars
The API offers several sanctorale calendars to choose from - e.g. General Roman Calendar in Latin and English. /calendars returns list of their identifiers.

[
  "default",
  "general-la",
  "general-en",
  "czech"
]
/calendars/:cal
/calendars/default
/calendars/general-en
Fetches description of the selected calendar.

The description has two parts. system describes the calendar system (which is the same for the whole API), sanctorale describes the selected set of data of sanctorale feasts.

{
  "system": {
    "promulgated": 1969,
    "effective_since": 1970,
    "desc": "promulgated by motu proprio Mysterii Paschalis of Paul VI. (AAS 61 (1969), pp. 222-226)."
  },
  "sanctorale": {
    "title": "Calendarium Romanum Generale",
    "language": "la"
  }
}
Query the Calendar
/calendars/:cal/today
/calendars/general-en/today
/calendars/:cal/yesterday
/calendars/general-en/yesterday
/calendars/:cal/tomorrow
/calendars/general-en/tomorrow
Convenience shortcuts to get calendar entries for the current day and for the previous and next one.

By default date and time of the server's time zone is used. If you need to serve audience in different timezones or in a single timezone different from the server's one, use endpoint with explicitly specified date instead. Alternatively, if the client provides it's local time in the Date HTTP header, the server respects it. But specifying date in request path is definitely the preferred way.

{
  "date":"2015-06-27",
  "season":"ordinary",
  "season_week":12,
  "celebrations":[
    {"title":"","colour":"green","rank":"ferial","rank_num":3.13},
    {"title":"Saint Cyril of Alexandria, bishop and doctor","colour":"white","rank":"optional memorial","rank_num":3.12}
  ],
  "weekday":"saturday"
}
Useful shortcut: If you wish to query the default calendar, you may omit /calendars/default from the path. The API will redirect you with status 301 to the full path. E.g. /today redirects to /calendars/default/today This is especially useful when exploring the API manually through the address bar of your browser or curl on the command line.

/calendars/:cal/:year/:month/:day
/calendars/default/2015/6/27
/calendars/default/1994/9/1 or /calendars/default/1994/09/01
Returns Day entry for the specified day.

Date of effectiveness as limit: The API refuses requests for dates with year being older than the year when the calendar system became effective. You can find it by hitting the calendar description route.

/calendars/:cal/:year/:month
/calendars/default/2015/6
Returns an array of Day entries for all days of the specified month

/calendars/:cal/:year
/calendars/default/2015
{"lectionary":"C","ferial_lectionary":2}
Returns the year's common "liturgical setup".

Civil vs. liturgical year: The way this endpoint works might not be obvious at the first glance. The problem is that the civil and Catholic liturgical year do not match. A liturgical year begins in November or December with the 1st Sunday of Advent. Thus /api/v0/en/2015 returns information concerning the liturgical year 2015-2016 and if you want to know which lectionary cycle is in use in June 2015, you have to call /api/v0/en/2014
Data Structures
The API mostly returns representations of liturgical days. On each liturgical day one or more celebrations occur.
Liturgical Day
{
  "date":"2015-06-27",
  "season":"ordinary",
  "season_week":12,
  "celebrations":[
    {"title":"","colour":"green","rank":"ferial","rank_num":3.13},
    {"title":"Saint Cyril of Alexandria, bishop and doctor","colour":"white","rank":"optional memorial","rank_num":3.12}
  ],
  "weekday":"saturday"
}
date: ISO 8601 date
season: ordinary/advent/christmas/lent/easter
season_week: ordinal number of the season's week (the same you will find in liturgical books for the given day)
weekday name of the weekday, lowercased, just for human-readability - of course you could compute it from the date
celebrations array of alternative celebrations for the day
Celebration
{"title":"Saint Cyril of Alexandria, bishop and doctor","colour":"white","rank":"optional memorial","rank_num":3.12}
title: name of the celebration, may be empty
colour: green/violet/white/red
rank: textual description of celebration rank
rank_num: celebration rank as number. The lower number, the higher priority. Numbers correspond with section numbers in the Table of Liturgical Days.