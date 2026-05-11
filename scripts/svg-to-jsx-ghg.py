"""
Mechanical converter from public/assets/ghg-protocol-square-NZA.svg
to src/components/svg/GhgProtocolDiagram.tsx.

Why a script: the SVG has hundreds of paths and inline styles, plus
SVG-attribute names that JSX wants in camelCase. Hand-converting is
error-prone and Chris re-exports the SVG occasionally, so a script
keeps the React component in sync without manual work.

What it does:
  - Strips the XML prolog and the Illustrator comment.
  - Renames every hyphenated SVG attribute we care about to camelCase
    (stop-color, stroke-width, stroke-miterlimit, stroke-linejoin,
    stroke-linecap, font-family, font-size, data-name, xmlns:xlink,
    xlink:href, gradient-units, gradient-transform).
  - Renames class= to className= on every element.
  - Sets the root <svg> id to "ghgArt" and adds className="ghg-svg"
    so the reveal hook and the per-zone CSS hook in (since the diagram
    references those IDs / classes).
  - Wraps the inner <style> CSS in `{` template literal `}` so the
    literal {} inside the CSS don't break JSX.
  - Wraps the result in the React component scaffold that the rest of
    the app imports.

Run from the project root:
  python scripts/svg-to-jsx-ghg.py
"""

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SVG_PATH = ROOT / "public" / "assets" / "ghg-protocol-square-NZA.svg"
TSX_PATH = ROOT / "src" / "components" / "svg" / "GhgProtocolDiagram.tsx"

# kebab-case (or colon-namespaced) SVG attributes -> JSX camelCase form.
# Order matters: 'xmlns:xlink' must be handled before 'xlink:' since
# the colon would otherwise be interpreted twice.
ATTR_MAP = [
    ("xmlns:xlink", "xmlnsXlink"),
    ("xlink:href", "xlinkHref"),
    ("stop-color", "stopColor"),
    ("stop-opacity", "stopOpacity"),
    ("stroke-width", "strokeWidth"),
    ("stroke-miterlimit", "strokeMiterlimit"),
    ("stroke-linejoin", "strokeLinejoin"),
    ("stroke-linecap", "strokeLinecap"),
    ("stroke-dasharray", "strokeDasharray"),
    ("font-family", "fontFamily"),
    ("font-size", "fontSize"),
    ("font-weight", "fontWeight"),
    ("text-anchor", "textAnchor"),
    ("gradient-units", "gradientUnits"),
    ("gradient-transform", "gradientTransform"),
    ("clip-path", "clipPath"),
    ("clip-rule", "clipRule"),
    ("fill-rule", "fillRule"),
    ("fill-opacity", "fillOpacity"),
    ("data-name", "dataName"),  # NB: react logs a warning on unknown camelCase
                                # but data-name is technically valid - reverted below
]

# Read the source.
svg = SVG_PATH.read_text(encoding="utf-8")

# Strip the XML prolog and Illustrator comments.
svg = re.sub(r"<\?xml.*?\?>\s*", "", svg, count=1, flags=re.DOTALL)
svg = re.sub(r"<!--.*?-->", "", svg, flags=re.DOTALL)

# Mechanically rename the kebab attributes inside element openings only.
# We use a simple replace because the attribute names are unambiguous and
# unlikely to appear inside any attribute value.
for old, new in ATTR_MAP:
    svg = svg.replace(old + "=", new + "=")

# data-name is preserved as data-name (React allows data-* attributes,
# camelCasing it would lose the data-attribute semantics).
svg = svg.replace("dataName=", "data-name=")

# class= -> className= on every element (no class attribute appears inside
# a value, so a plain replace is safe).
svg = svg.replace("class=", "className=")

# Root <svg> id rename: Layer_1 -> ghgArt, plus add the ghg-svg className.
# Original line example: <svg id="Layer_1" xmlns=... viewBox=...>
svg = re.sub(
    r'<svg\s+id="Layer_1"',
    '<svg id="ghgArt" className="ghg-svg"',
    svg,
    count=1,
)

# Wrap the inner <style>...</style> block with a JSX template literal so
# the `{` and `}` inside CSS rules don't break the JSX parser.
def _wrap_style(match):
    inner = match.group(1)
    return "<style>{`" + inner + "`}</style>"

svg = re.sub(r"<style>(.*?)</style>", _wrap_style, svg, flags=re.DOTALL)

# Indent the SVG content one level for embedding inside the TSX scaffold.
svg = "\n".join("      " + line for line in svg.splitlines())

# Build the final TSX.
tsx = '''/* eslint-disable */
// @ts-nocheck - mechanically converted from SVG; React's static SVG types
// don't include every SVG2 presentation attribute (e.g. `isolation`).
// Runtime is fine - React passes unknown props through to the DOM.
//
// GHG Protocol value-chain diagram. Regenerated from
// public/assets/ghg-protocol-square-NZA.svg via scripts/svg-to-jsx-ghg.py.
// IDs that the useGhgReveal animation depends on (do not rename):
//   _3_-_back  ·  _2_-_mid  ·  _1_-_front
//   _5_-_lines_and_clouds
//   _4_-_BVCM
//   _6_-_annotation  ·  _6_-_text
//
// The internal <style> blocks contain CSS class definitions (.st0, .st1
// etc.) that the SVG paths reference via className. The CSS is wrapped
// in a JSX template literal so the literal `{}` don't break JSX parsing.

type Props = { className?: string }

export function GhgProtocolDiagram({ className }: Props) {
  return (
    <div
      className={'diagram diagram-ghg' + (className ? ' ' + className : '')}
      aria-label="GHG Protocol value chain - Scope 1, Scope 2, Scope 3 and Beyond Value Chain Mitigation, with Net Zero Advisory shown across the corporate value chain."
    >
''' + svg + '''
    </div>
  )
}
'''

TSX_PATH.write_text(tsx, encoding="utf-8")
print(f"Wrote {TSX_PATH.relative_to(ROOT)} ({len(tsx)} chars)")
