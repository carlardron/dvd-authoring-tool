import fs from "fs";
import { execSync } from "child_process";
import logger from "../utils/logger.js";
import { generateDvdXml } from "../utils/dvdXmlGenerator.js";

const dvdCreate = async (context) => {
  // Create XML structure for DVD
  const xmlPath = `${context.int.scratchDir}/dvd.xml`;
  logger.log("Creating DVD XML structure...");
  logger.time("XML creation");

  // Use the imported XML generator
  const dvdXml = generateDvdXml(context);

  fs.writeFileSync(xmlPath, dvdXml);
  logger.timeEnd("XML creation");

  // Generate DVD structure
  logger.log("Generating DVD structure...");
  logger.time("DVD authoring");
  execSync(
    `dvdauthor -o ${context.out.outputDisc} -x ${context.int.scratchDir}/dvd.xml`
  );
  logger.timeEnd("DVD authoring");
};

export default dvdCreate;
