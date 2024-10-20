/** @format */
import fs from "fs";
import path from "path";

export function flatLoader(
  root: string,
  folder: string,
  callback: (command: any) => void
) {
  const folderPath = path.join(root, folder);

  try {
    const files = fs
      .readdirSync(folderPath)
      .filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

    console.log(files);
    for (let i = 0; i < files.length; i++) {
      const commandPath = path.join(folderPath, files[i]);
      console.log(`Loading module from: ${commandPath}`);
      const module = require(commandPath);
      // Ensure callback is only called once
      if (module) {
        callback(module);
      } else {
        console.warn(`No module found at: ${commandPath}`);
      }
    }
  } catch (error) {
    console.error(`[flatLoader]: Error loading commands from ${folderPath}`, error);
  }
}

export function recursiveLoader(
  root: string,
  folder: string,
  callback: (command: any) => void
) {
  const folderPath = path.join(root, folder); // Resolve the absolute path of the folder

  try {
    const files = fs.readdirSync(folderPath); // Read all files and directories in the folder

    for (let i = 0; i < files.length; i++) {
      const filePath = path.join(folderPath, files[i]);
      const stat = fs.lstatSync(filePath); // Use lstatSync to check for symbolic links

      if (stat.isDirectory()) {
        // Recursively load files from subdirectories
        console.log(`Entering directory: ${filePath}`);
        recursiveLoader(root, path.join(folder, files[i]), callback);
      } else if (filePath.endsWith(".ts") || filePath.endsWith(".js")) {
        console.log(`Loading module from: ${filePath}`);
        const module = require(filePath);
        if (module) {
          callback(module);
        } else {
          console.warn(`No module found at: ${filePath}`);
        }
      }
    }
  } catch (error) {
    console.error(`[recursiveLoader]: Error loading commands from ${folderPath}`, error);
  }
}
