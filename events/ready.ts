/** @format */

import { Events } from "discord.js";
import { createEvent } from "../lib";

export default createEvent({
  name: Events.ClientReady,
  handler(_, client) {
  console.log(_, client, "bot is align")
  },
});
