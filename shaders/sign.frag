// Length of the desired text
#define MAX_LENGTH 512
// Font is a 16x16 grid of cells
#define FONT_ROWS 16
#define FONT_COLS 16
// However, many of the characters are non-printable, so let's only use
// a limited rangge
#define MIN_CHAR 32
#define MAX_CHAR 126

// Text colors to display
uniform vec3 fg_color;
uniform vec3 bg_color;

// Buffer of text as ASCII codes between MIN_CHAR and MAX_CHAR
uniform int[MAX_LENGTH] text;

// Texture containing our font
uniform sampler2D font_texture;

// (cols, rows) to describe how to interpret the buffer. cols * rows must
// be less than or equal to MAX_LENGTH
uniform vec2 text_dimensions;

vec4 character_lookup(vec2 uv, int char_code) {
    // Determine which cell the desired character is located at
    float code = float(char_code);
    vec2 cell_id = vec2(
        floor(code / FONT_COLS),
        mod(code, FONT_COLS));

    // Flip y since textures are measured from bottom left
    cell_id.y = (FONT_ROWS - 1) - cell_id.y;

    // Select out the proper cell from the texture
    vec2 char_uv = (cell_id + uv) / FONT_COLS;

    // Look up the color of the font that corresponds to this pixel
    return texture2D(font_texture, char_uv);
}

void main() {
    vec4 char_color = character_lookup(fUv, char_code);

    gl_FragColor = char_color;
}
