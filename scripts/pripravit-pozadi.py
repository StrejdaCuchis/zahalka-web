"""python3 scripts/pripravit-pozadi.py /cesta/ke/grafika 1

Vyžaduje Pillow. Originály zůstávají mimo repozitář; číslování odpovídá dodání.
"""
import argparse
from pathlib import Path
from PIL import Image

parser = argparse.ArgumentParser(description="Připravit jednu dvojici pozadí Zahálky.")
parser.add_argument("zdroj", type=Path)
parser.add_argument("varianta", type=int, choices=range(1, 7))
args = parser.parse_args()
cil = Path(__file__).resolve().parents[1] / "public/obrazky/pozadi"
cil.mkdir(parents=True, exist_ok=True)

for slozka, zarizeni, rozmery in [
    ("WEB DESKTOP png", "desktop", (1920, 1080)),
    ("WEB MOBIL png", "mobil", (720, 1280)),
]:
    with Image.open(args.zdroj / slozka / f"{args.varianta}.png") as obrazek:
        obrazek = obrazek.convert("RGBA")
        obrazek.thumbnail(rozmery, Image.Resampling.LANCZOS)
        soubor = cil / f"varianta-{args.varianta}-{zarizeni}.webp"
        obrazek.save(soubor, "WEBP", quality=80, method=6)
        print(f"{soubor.name}: {obrazek.width} × {obrazek.height}, {soubor.stat().st_size / 1024:.1f} KiB")
