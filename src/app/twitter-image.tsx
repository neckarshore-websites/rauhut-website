// Twitter/X card image. Same design as Open Graph image — Twitter crops
// to 1.91:1 which matches 1200x630, so one asset serves both.
// Re-exports keep a single source of truth for the image design.
export { default, alt, size, contentType } from "./opengraph-image";
