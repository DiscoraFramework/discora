/** @format */

import { DiscoraClient } from "../client";

export function devLog(client: DiscoraClient,  message: any, ...optionalParams: any[]) {
  if (client.config.environment === "development") {
    console.log(message, ...optionalParams);
  }
}
