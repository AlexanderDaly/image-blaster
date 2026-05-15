---
name: image-blast-image-edit
description: "Generate one image edit from explicit input images and a prompt. Use for source cleanup, clean plates, object removal, or other FAL-backed image edits. Typical inputs: [image path] [prompt] [optional output dir, role, output slug]."
---

# Image Blast Image Edit

## Codex conversion notes

This is the Codex-compatible version of the Image Blast skill. Use the repository-local helpers in `scripts/image-blaster/`. Treat any provider URL in JSON as provenance/resume metadata and prefer local files on disk for viewer/runtime output.


Create one edited image.

## Instructions

- Require at least one input image and one edit prompt.
- Use `ls -a` before reading generated state.
- Use the output directory, role, and output slug provided by the caller.
- Use `--role` for semantics such as `plate`, `object-mask`, or `image-edit`.
- Use `--output-slug` for the visible indexed artifact name, such as `<source-slug>-plate`.

Run:

```bash
node scripts/image-blaster/image-edit/generate-edit.mjs \
  --image "<input image path>" \
  --prompt "<edit prompt>" \
  --output-dir "<output directory>" \
  --role "<role>" \
  --output-slug "<output slug>"
```

Optional provider override: `--provider nano-banana|gpt-image-2`.

If request metadata records provider URLs but local image files are missing, fill them from the matching hidden request JSON:

```bash
node scripts/image-blaster/project/ensure-local-assets.mjs --from "<request-json-path>"
```

Final response: report input images, output image, request metadata, role, and prompt used.
