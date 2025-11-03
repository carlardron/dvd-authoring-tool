const highlightTransforms = (locations) => {
  let result = [];
  for (const location of locations) {
    if (
      !location ||
      !location.x0 ||
      !location.y0 ||
      !location.x1 ||
      !location.y1
    ) {
      throw new Error("Invalid location object provided");
    }

    let normal = [
      "rectangle " +
        (location.x0 + 4) +
        "," +
        (location.y1 - 10) +
        " " +
        (location.x1 - 4) +
        "," +
        (location.y1 - 5),
    ];

    let highlight = [
      "rectangle " +
        (location.x0 + 4) +
        "," +
        (location.y1 - 11) +
        " " +
        (location.x1 - 4) +
        "," +
        (location.y1 - 10),
      "rectangle " +
        (location.x0 + 4) +
        "," +
        (location.y1 - 10) +
        " " +
        (location.x1 - 4) +
        "," +
        (location.y1 - 5),
      "rectangle " +
        (location.x0 + 4) +
        "," +
        (location.y1 - 5) +
        " " +
        (location.x1 - 4) +
        "," +
        (location.y1 - 4),
    ];

    let select = [
      "rectangle " +
        (location.x0 + 4) +
        "," +
        (location.y1 - 11) +
        " " +
        (location.x1 - 4) +
        "," +
        (location.y1 - 4),
    ];

    result.push({
      normal: normal,
      highlight: highlight,
      select: select,
      x0: location.x0,
      y0: location.y0,
      x1: location.x1,
      y1: location.y1,
    });
  }
  return result;
};

export default highlightTransforms;
