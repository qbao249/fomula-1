# Fomula-1 RestAPI

Rest API to search for contents of racing results

Crawling data from 2020 to 2023

Current APIs:

1. search race's infos by filters: will return contents of races, with specified filters
2. search team'infos by filters: will return contents of teams, with specified filters

## Setup

### Intall node modules

```bash
$ yarn
```

### Configure environment in local machine

Add a .env file to your root directory and copy following code to it

```bash
MONGO_DB_URL = mongodb+srv://user_001:LHOA0C73q5n3joyW@cluster0.9cxrvjz.mongodb.net/test?authMechanism=DEFAULT
PORT=3030
NODE_ENV = development
```

**_Note_**
MONGO_DB_URL is provided above is a sensitive info, in the real project will not be located in this file, and it's user role is ReadOnly DB

## Usage

### Run app on local machine

```bash
$ yarn dev
```

### APIs

**_1. search race's infos by filters_**

URL:

```
http://127.0.0.1:3030/api/race/search
```

METHOD:

```
POST
```

HEADERS

```
KEY=Content-Type
VALUE=application/json
```

BODY (JSON format)

Optional properties can be passed to the filters:

- year:
  - Description: the year when races were recorded
  - DataType: number or array of numbers
- grandPrix:
  - Description: accurate racing tournament
  - DataType: string or array of strings
- driver:
  - Description: accurate driver's fullname
  - DataType: string or array of strings
- team:
  - Description: accurate team's name
  - DataType: string or array of strings

Example:

```json
{
  "filters": {
    "year": [2020, 2022],
    "grandPrix": ["<grandPrix_1>"],
    "driver": ["<driver_1>"],
    "team": ["<team_1>", "<team_2>",]
  }
}
or
{
  "filters": {
    "year": 2020,
    "grandPrix": "<grandPrix_1>",
    "driver": "<driver_1>",
    "team": "<team_1>"
  }
}
```

**_2. search team'infos by filters_**

URL:

```
http://127.0.0.1:3030/api/team/search
```

METHOD:

```
POST
```

HEADERS

```
KEY=Content-Type
VALUE=application/json
```

BODY (JSON format)

Optional properties can be passed to the filters:

- year:
  - Description: the year when races were recorded
  - DataType: number or array of numbers
- grandPrix:
  - Description: accurate racing tournament
  - DataType: string or array of strings

Example:

```json
{
  "filters": {
    "year": [2020, 2022],
    "grandPrix": ["<grandPrix_1>"],
  }
}
or
{
  "filters": {
    "year": 2020,
    "grandPrix": "<grandPrix_1>",
  }
}
```
