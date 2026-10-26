# Periodic M

A responsive bilingual (Arabic/English) educational periodic-table website for the first three periods (18 main-group elements).

## Run locally
Because the website fetches `assets/elements.json`, serve the folder over HTTP rather than opening `index.html` directly.

If Python is installed:
1. Open a terminal in this folder.
2. Run `py -m http.server 8000`
3. Open `http://localhost:8000`

No package installation or backend server is needed.

## Free hosting
Recommended easy option: GitHub Pages (static hosting).
1. Create or sign in to a GitHub account.
2. Create a public repository named `periodic-m`.
3. Upload all files and folders from this directory, preserving the folder structure.
4. In the repository, open Settings → Pages.
5. Under Build and deployment, select Deploy from a branch; choose `main` and `/ (root)`, then Save.
6. Wait for the published URL shown in Settings → Pages.
7. Test the URL on both computer and phone before generating/printing a QR code.

If you prefer a deployment service that does not require a public repository, check its current free plan and terms before uploading.

## Content notes
- This is deliberately the simplified first-three-periods table (18 elements arranged in 8 main-group columns), not the full 118-element table.
- Atomic masses are standard abridged values for classroom use; many values are representative standard atomic weights, not isotope-specific masses.
- The atom drawing is a schematic Bohr-style illustration and is not a literal scale model.
- Review scientific content against your course textbook before classroom presentation.
