// Standard DVD frame rates and their approximate values with transform info
const DVD_FRAMERATES = {
  "24000/1001": {
    name: "23.976",
    value: 23.976,
    ntsc: true,
    pal: false,
    transforms: {
      ntsc: { needsTelecine: true, speedChange: false, speedFactor: 1 },
      pal: {
        needsTelecine: false,
        speedChange: true,
        speedFactor: 25 / (24000 / 1001),
      },
    },
  },
  "24/1": {
    name: "24",
    value: 24,
    ntsc: true,
    pal: false,
    transforms: {
      ntsc: {
        needsTelecine: true,
        speedChange: true,
        speedFactor: 24000 / 1001 / 24,
      }, // 0.1% slowdown
      pal: {
        needsTelecine: false,
        speedChange: true,
        speedFactor: 25 / 24,
      }, // 4.17% speedup
    },
  },
  "25/1": {
    name: "25",
    value: 25,
    ntsc: false,
    pal: true,
    transforms: {
      ntsc: {
        needsTelecine: false,
        speedChange: true,
        speedFactor: 24000 / 1001 / 25,
      }, // slowdown
      pal: { needsTelecine: false, speedChange: false, speedFactor: 1 }, // no change needed
    },
  },
  "30000/1001": {
    name: "29.97",
    value: 29.97,
    ntsc: true,
    pal: false,
    transforms: {
      ntsc: { needsTelecine: false, speedChange: false, speedFactor: 1 }, // already NTSC standard
      pal: {
        needsTelecine: false,
        speedChange: true,
        speedFactor: 25 / (30000 / 1001),
      }, // major slowdown
    },
  },
  "30/1": {
    name: "30",
    value: 30,
    ntsc: true,
    pal: false,
    transforms: {
      ntsc: {
        needsTelecine: false,
        speedChange: true,
        speedFactor: 30000 / 1001 / 30,
      }, // slight slowdown
      pal: {
        needsTelecine: false,
        speedChange: true,
        speedFactor: 25 / 30,
      }, // major slowdown
    },
  },
  "50/1": {
    name: "50",
    value: 50,
    ntsc: false,
    pal: true,
    transforms: {
      ntsc: {
        needsTelecine: false,
        speedChange: true,
        speedFactor: 24000 / 1001 / 50,
      }, // major slowdown
      pal: { needsTelecine: false, speedChange: false, speedFactor: 1 }, // no change needed
    },
  },
  "60000/1001": {
    name: "59.94",
    value: 59.94,
    ntsc: true,
    pal: false,
    transforms: {
      ntsc: { needsTelecine: false, speedChange: false, speedFactor: 1 }, // already NTSC standard
      pal: {
        needsTelecine: false,
        speedChange: true,
        speedFactor: 25 / (60000 / 1001),
      }, // major slowdown
    },
  },
  "60/1": {
    name: "60",
    value: 60,
    ntsc: true,
    pal: false,
    transforms: {
      ntsc: {
        needsTelecine: false,
        speedChange: true,
        speedFactor: 60000 / 1001 / 60,
      }, // slight slowdown
      pal: {
        needsTelecine: false,
        speedChange: true,
        speedFactor: 25 / 60,
      }, // major slowdown
    },
  },
};

/**
 * Detects the standard DVD frame rate from a given frame rate value and provides transform requirements
 * @param {string|number} frameRate - Frame rate as string (e.g. "24000/1001") or number
 * @param {string} targetFormat - "pal" or "ntsc"
 * @returns {object|null} Frame rate info object with transform requirements or null if invalid
 */
const detectDvdFrameRate = (frameRate, targetFormat = null) => {
  let numericRate;
  let result = null;

  // Parse the frame rate
  if (typeof frameRate === "string" && frameRate.includes("/")) {
    // Handle fraction format (e.g. "24000/1001")
    const [num, den] = frameRate.split("/").map(Number);
    numericRate = num / den;

    // Check if it's an exact match for a standard fraction
    const exactMatch = Object.keys(DVD_FRAMERATES).find(
      (rate) => rate === frameRate
    );
    if (exactMatch) {
      result = { ...DVD_FRAMERATES[exactMatch] };
    }
  } else {
    numericRate = parseFloat(frameRate);
  }

  // If no exact match, find the closest standard frame rate
  if (!result) {
    const standards = Object.values(DVD_FRAMERATES);
    const closest = standards.reduce((prev, curr) => {
      return Math.abs(curr.value - numericRate) <
        Math.abs(prev.value - numericRate)
        ? curr
        : prev;
    });

    // Define a strict tolerance for acceptable frame rates
    // DVD systems typically need very precise frame rates
    const FRAME_RATE_TOLERANCE = 0.02; // Maximum 0.02 fps difference (very strict)

    // Only accept if it's within the strict tolerance
    if (Math.abs(closest.value - numericRate) <= FRAME_RATE_TOLERANCE) {
      result = { ...closest };
      // Add debug info about the approximation if it's not an exact match
      if (closest.value !== numericRate) {
        result.approximation = {
          from: numericRate,
          to: closest.value,
          difference: Math.abs(closest.value - numericRate),
        };
      }
    } else {
      // Frame rate is outside acceptable range for DVD standards
      return null;
    }
  }

  // If we found a valid frame rate
  if (result) {
    // Add the source frame rate for reference
    result.sourceRate = numericRate;

    // If target format is specified, add specific transform info
    if (targetFormat) {
      const format = targetFormat.toLowerCase();
      result["transform"] = result.transforms[format];
      return result;
    }

    return result;
  }

  return null; // Not a valid DVD frame rate
};

export default detectDvdFrameRate;
