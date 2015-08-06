Updating the coverage map
---

1. Make adjustments to map.svg in a vector editor like Inkscape.
2. Export the canvas at 720dpi as `map.png`.
3. Run the python script via:

```
python togeo.py map.png
```

Which creates a .tiff file. Upload this or replace an existing map from your
Mpabox account.

_Note: [gdal](http://www.gdal.org/) is required. Install via [Homebrew](http://brew.sh/)_.
