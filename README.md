# sample-api

Sample api that exposes GET, POST and PUT endpoints for updating clients and jobs.

### Client Endpoints Input Formats

#### Create/Post
```
{
  "cName": "exampleName"
}
```
#### Read/Get
```
 *ID as param
```

#### Update/Put
```
{
  "cName": "exampleName"
}
 * + ID as param
```
#### Delete
Not Implemented


### Job Endpoints Input Formats

#### Create/Post
```
{
  "clientID" : "1",
  "jobType" : "example jobType",
  "startDate" : "YYYY-MM-DD",
  "endDate" : "YYYY-MM-DD"
}
```
#### Read/Get
```
* ID as param
```

#### Update/Put
```
{
  "clientID" : "1",
  "jobType" : "example jobType",
  "startDate" : "YYYY-MM-DD",
  "endDate" : "YYYY-MM-DD"
}

* + ID as param
```
#### Delete
Not Implemented
