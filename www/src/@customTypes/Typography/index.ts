export type FontSize = 8 | 10 | 12 | 14 | 16 | 18 | 20 | 24 | 30 | 32 | 36;
export type Variant = "h1" | "h2" | "h3" | "h4" | "h5" | "p" | "span" | "div"
export type Weight = "bold" | "semi-bold" | "regular" | "light" | "thin" | "medium"

export type TypographyProps = {
    font: FontSize;
    variant: Variant;
    weight: Weight;
}