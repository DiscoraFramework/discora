/** @format */

import { Events } from "discord.js";
import { createEvent } from "../lib";

export default createEvent({
  name: Events.ClientReady,
  handler(client) {
    console.log(`${client.user?.username} is online`);
  },
});
