export const getFileExtension = (filename: string): string => {
  return filename.split(".").pop()?.toLowerCase() || "";
};

export const getFontFormat = (filename: string): string => {
  const formatMap: { [key: string]: string } = {
    ttf: "truetype",
    otf: "opentype",
    woff: "woff",
    woff2: "woff2",
  };
  return formatMap[getFileExtension(filename)] || "truetype";
};