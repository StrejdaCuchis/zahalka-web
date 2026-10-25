"""Úplné tvary z dodaných SVG bez ořezu původní kreslicí plochou.

python3 scripts/pripravit-vrstvy-pozadi.py /cesta/ke/grafika
Vyžaduje Pillow a lokálně nainstalované závislosti projektu (sharp).
Barvy, masky a transformace tvarů se přebírají z originálu.
"""
import argparse
import base64
import copy
import hashlib
import io
import json
import math
from pathlib import Path
import re
import subprocess
import tempfile
import xml.etree.ElementTree as ET

from PIL import Image

SVG = "{http://www.w3.org/2000/svg}"
HREF = "{http://www.w3.org/1999/xlink}href"
ET.register_namespace("", SVG[1:-1])
ET.register_namespace("xlink", "http://www.w3.org/1999/xlink")
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("zdroj", type=Path)
parser.add_argument("varianty", nargs="*", type=int)
args = parser.parse_args()
if any(varianta not in range(1, 7) for varianta in args.varianty):
    parser.error("Varianty musí být čísla 1 až 6.")
root = Path(__file__).resolve().parents[1]
cil = root / "public/obrazky/pozadi/vrstvy"
cil.mkdir(parents=True, exist_ok=True)
cache = {}
manifest = root / "src/data/pozadi.json"
kompozice = json.loads(manifest.read_text()) if args.varianty and manifest.exists() else {}


def references(element):
    return {
        identifier
        for child in element.iter()
        for value in child.attrib.values()
        for identifier in re.findall(r"url\(#([^)]+)\)", value)
    }


def pripravit_bitmapy(element):
    for image in element.iter(SVG + "image"):
        original = image.get(HREF)
        key = hashlib.sha256(original.encode()).hexdigest()
        if key not in cache:
            # Zmenšení bezztrátovým PNG obchází limit velikosti XML atributu.
            # Filtry a alfa maska zůstávají původní; žádné tónování ani opacity.
            with Image.open(io.BytesIO(base64.b64decode(original.split(",", 1)[1]))) as bitmap:
                bitmap.thumbnail((1240, 1754), Image.Resampling.LANCZOS)
                buffer = io.BytesIO()
                bitmap.save(buffer, "PNG")
                cache[key] = "data:image/png;base64," + base64.b64encode(buffer.getvalue()).decode()
        image.set(HREF, cache[key])


with tempfile.TemporaryDirectory(prefix="zahalka-vrstvy-") as tmp:
    for varianta in args.varianty or range(1, 7):
        kompozice[str(varianta)] = {}
        for slozka, zarizeni in [("WEB DESKTOP svg", "desktop"), ("WEB MOBIL svg", "mobil")]:
            original = ET.parse(args.zdroj / slozka / f"{varianta}.svg").getroot()
            _, _, page_width, page_height = map(float, original.get("viewBox").split())
            definitions = original.find(SVG + "defs")
            vrstvy = []
            for cislo, group in enumerate([e for e in original if e.tag == SVG + "g"], 1):
                group = copy.deepcopy(group)
                # První clip-path je obdélník kreslicí plochy, který uřezával blob.
                # Vnitřní klip obrázku a jeho maska se zachovávají.
                group.attrib.pop("clip-path", None)
                matrix = next(e.get("transform") for e in group.iter() if "transform" in e.attrib)
                a, b, c, d, tx, ty = map(float, re.findall(r"-?\d+(?:\.\d+)?", matrix))
                image = next(group.iter(SVG + "image"))
                w, h = float(image.get("width")), float(image.get("height"))
                corners = [(a*x + c*y + tx, b*x + d*y + ty) for x, y in [(0, 0), (w, 0), (0, h), (w, h)]]
                x0 = math.floor(min(p[0] for p in corners)) - 2
                y0 = math.floor(min(p[1] for p in corners)) - 2
                width = math.ceil(max(p[0] for p in corners)) - x0 + 2
                height = math.ceil(max(p[1] for p in corners)) - y0 + 2
                needed = references(group)
                while True:
                    previous = len(needed)
                    for definition in definitions:
                        if definition.get("id") in needed:
                            needed.update(references(definition))
                    if len(needed) == previous:
                        break
                svg = ET.Element(SVG + "svg", {
                    "viewBox": f"{x0} {y0} {width} {height}",
                    "width": str(width * 2), "height": str(height * 2),
                })
                defs = ET.SubElement(svg, SVG + "defs")
                for definition in definitions:
                    if definition.get("id") in needed:
                        defs.append(copy.deepcopy(definition))
                svg.append(group)
                pripravit_bitmapy(svg)
                temporary = Path(tmp) / "vrstva.svg"
                ET.ElementTree(svg).write(temporary, encoding="utf-8", xml_declaration=True)
                jmeno = f"varianta-{varianta}-{zarizeni}-{cislo}.webp"
                render = subprocess.run(
                    ["node", str(root / "scripts/vykreslit-vrstvu.mjs"), str(temporary), str(cil / jmeno)],
                    cwd=root, check=True, capture_output=True, text=True,
                )
                info = json.loads(render.stdout)
                actual_width, actual_height = info["sourceWidth"] / 2, info["sourceHeight"] / 2
                center_x = x0 + info["left"] / 2 + actual_width / 2
                center_y = y0 + info["top"] / 2 + actual_height / 2
                vrstvy.append({
                    "src": f"/obrazky/pozadi/vrstvy/{jmeno}",
                    "width": info["width"], "height": info["height"],
                    "sirka": round(min(0.9, actual_width / page_width), 5),
                    "x": round(max(0, min(1, center_x / page_width)), 5),
                    "y": round(max(0, min(1, center_y / page_height)), 5),
                })
                print(jmeno, flush=True)
            kompozice[str(varianta)][zarizeni] = vrstvy

manifest.write_text(json.dumps(kompozice, ensure_ascii=False, indent=2) + "\n")
