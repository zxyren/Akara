/**
 * Font file validation and diagnostics
 */

export interface FontValidationResult {
  isValid: boolean;
  format: string;
  size: number;
  errors: string[];
  warnings: string[];
}

/**
 * Validate font file by checking magic numbers and file signatures
 * This helps detect if a file is actually a valid font file
 */
export const validateFontFile = (
  file: File,
  fileData: string
): FontValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];
  const filename = file.name.toLowerCase();
  const extension = filename.split(".").pop() || "";

  // Check file size
  const sizeMB = file.size / (1024 * 1024);
  if (sizeMB > 50) {
    warnings.push(`Large font file (${sizeMB.toFixed(2)}MB) may load slowly`);
  }

  // Check file extension
  const validExtensions = ["ttf", "otf", "woff", "woff2"];
  if (!validExtensions.includes(extension)) {
    errors.push(`Invalid font extension: .${extension}`);
  }

  // Try to detect font type from data URL magic bytes
  let detectedFormat = "";
  try {
    // Extract base64 data
    const base64 = fileData.split(",")[1];
    if (base64) {
      const binaryString = atob(base64.substring(0, 100));
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Check magic numbers for different font formats
      // TTF/OTF: starts with 0x00010000 or "OTTO"
      if (
        (bytes[0] === 0x00 && bytes[1] === 0x01) ||
        (bytes[0] === 0x4f && bytes[1] === 0x54) // "OT"
      ) {
        detectedFormat = "TTF/OTF";
      }
      // WOFF: starts with "wOFF"
      else if (bytes[0] === 0x77 && bytes[1] === 0x4f) {
        detectedFormat = "WOFF";
      }
      // WOFF2: starts with "wOF2"
      else if (
        bytes[0] === 0x77 &&
        bytes[1] === 0x4f &&
        bytes[2] === 0x46 &&
        bytes[3] === 0x32
      ) {
        detectedFormat = "WOFF2";
      } else {
        warnings.push(
          "Could not detect font format from file signature (may still be valid)"
        );
      }
    }
  } catch (error) {
    warnings.push("Could not validate font signature");
  }

  // Check if file size is too small (likely invalid)
  if (file.size < 1000) {
    errors.push("File is too small to be a valid font");
  }

  // Check data URL length
  if (fileData.length > 5 * 1024 * 1024) {
    warnings.push("Font data URL is very large and may cause performance issues");
  }

  const isValid = errors.length === 0;

  return {
    isValid,
    format: detectedFormat || extension.toUpperCase(),
    size: file.size,
    errors,
    warnings,
  };
};

/**
 * Get recommended CSS format based on file extension
 */
export const getCSSFontFormat = (filename: string): string => {
  const ext = filename.split(".").pop()?.toLowerCase() || "";
  const formatMap: { [key: string]: string } = {
    ttf: "truetype",
    otf: "opentype",
    woff: "woff",
    woff2: "woff2",
  };
  return formatMap[ext] || "truetype";
};

/**
 * Log font loading diagnostics
 */
export const logFontDiagnostics = (
  filename: string,
  validation: FontValidationResult
) => {
  if (!validation.isValid) {
    console.error(`❌ Font Validation Failed: ${filename}`);
    validation.errors.forEach((error) => {
      console.error(`   - ${error}`);
    });
  } else {
    console.log(`✓ Font Valid: ${filename}`);
    console.log(`  Format: ${validation.format}`);
    console.log(`  Size: ${(validation.size / 1024).toFixed(2)} KB`);
  }

  if (validation.warnings.length > 0) {
    console.warn(`⚠ Font Warnings: ${filename}`);
    validation.warnings.forEach((warning) => {
      console.warn(`   - ${warning}`);
    });
  }
};
