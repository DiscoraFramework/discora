/** @format */
import fs from "fs";
import path from "path";

export function flatLoader(root: string, folder: string, callback: (command: any) => void) {
  const folderPath = path.join(root, folder);

  try {
    const files = fs.readdirSync(folderPath).filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

    for (const file of files) {
      const commandPath = path.join(folderPath, file);
      const command = require(commandPath);
      callback(command);
    }
  } catch (error) {
    console.error(`[flatLoader]: Error loading commands from ${folderPath}`, error);
  }
}

export function recursiveLoader(root: string, folder: string, callback: (command: any) => void) {}
