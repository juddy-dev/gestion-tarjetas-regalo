import { environment } from "./environments/environment";

export const awsConfig = {
    Auth: {
      Cognito: {
        userPoolId: environment.userPoolId,
        userPoolClientId: environment.userPoolClientId,
        region: environment.region,
      }
    }
  };