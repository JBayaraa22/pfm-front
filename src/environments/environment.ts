// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  api : { 
    base : "https://192.168.79.66/v1/",
    category : 'transaction/category/',
    transaction : 'transaction/raw/',
    budget : 'finance/budget/',
    token : 'finance/api-token-auth'
  }
  // api : {
  //   base : "../assets/fake_backend/",
  //   category : "categories.json",
  //   transaction : 'transactions.json',
  //   budget : "budgets.json"
  // }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
