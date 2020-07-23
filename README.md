# generative-processing

Having a local server is handy:

```bash
npm install -g browser-sync
```

To run the server locally:

```bash
browser-sync start --server -f -w
```

The webpage wiill automatically reload when you save the `js` file you're working on.

Redirect `index.html` to a different `js` file as needed.

Check your stuff out at [http://localhost:3000](http://localhost:3000).

## Export

`saveCanvas()` will output a `png` file, base template activates it when clicking the canvas.

Saving the canvas on every frame can be useful for making videos. I use the following to combine the images into an `mp4` file:

```bash
ffmpeg -framerate 30 -i %03d.png -pix_fmt yuv420p output.mp4
```
