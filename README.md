# Backend Engineer - Risk Challenge

## Project structure

The project uses node.js, typescript, express, express-validation and jest.
I set up a standard configuration for prettier and lint to ensure best practices and correct formatting.
I also addded some sample unit and integration tests.

I defined the following folder structure to ensure the separation of concerns and extensibility of the application:
```
| src
|   | api
|   |    | controller   -  controller logic and request/response manipualtions 
|   |    | routes       -  routes definition
|   |    | service      -  risk algorithm calculations
|   |    | validator    -  validation schema
|   | interfaces    - type definitions
| test  - unit and integration test files
```

## Setup

```
npm install
```

## Lint and prettier

```
npm run lint
npm run prettier
```

## Test

```
npm run test
```

## Running

```
npm start
```

## Using the API 

The API will be running on port `5000`  and can be tested by sending POST requests to `http://localhost:5000/api/v1/risk`.
Example request:
```
POST http://localhost:5000/api/v1/risk
{
  "age": 35,
  "dependents": 2,
  "house": {"ownership_status": "owned"},
  "income": 0,
  "marital_status": "married",
  "risk_questions": [0, 0, 0],
  "vehicle": {"year": 2017}
}
```
Example response:
```
{
	"auto": "economic",
	"disability": "ineligible",
	"home": "economic",
	"life": "regular"
}
```


The `vehicle` and `house` fields can be set to `null` if needed:
```
POST http://localhost:5000/api/v1/risk
{
  "age": 35,
  "dependents": 2,
  "house": {"ownership_status": "owned"},
  "income": 0,
  "marital_status": "married",
  "risk_questions": [0, 0, 0],
  "vehicle": {"year": 2017}
}
```
Example response:
```
{
	"auto": "ineligible",
	"disability": "ineligible",
	"home": "ineligible",
	"life": "regular"
}
```

## Extensible score calculation engine

I implemented an engine that dynamically evaluates the risk conditions and that can be easily customized with more rules and scenarios. The implementation uses a list of rules, defined in `services/risk.ts` in the `getRules()` method.

For example, the following rule deducts 1 risk point from all lines of insurance if the `income` is greater than 200000:
```{ expression: [{ field: 'income', operator: '>', value: 200000 }], lineOfInsurance: ['auto', 'disability', 'home', 'life'], result: -1 },```

The engine supports multiple expressions that are aggregated using the `and` operator. 
For example, the following expression evaluates to `true` if the age is between 30 and 40:
```
 expression: [
        { field: 'age', operator: '>=', value: 30 },
        { field: 'age', operator: '<', value: 40 },
      ],
```

We also support making an entire line of insurance invalid if a condition is met, by setting the result to `null`:
```{ expression: [{ field: 'income', operator: '=', value: 0 }], lineOfInsurance: ['disability'], result: null },```

Regarding the score computed based on the risk questions, if needed we can process any number of `risk_questions` just by adding more entries to the request array and updating the length in the `riskRequestValidator` validator.


