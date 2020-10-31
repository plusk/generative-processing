### Project structure

The majority of the work can be found in the `sketches/` directory. Some sketches have been posted on Instagram, others are still missing a certain _je ne sais quoi_, and some are just straight-up duds.

`index.html` provides an entry point for the project, where the `script` tag at the bottom determines which sketch will be viewed.

The `talk/` folder is part of a code walkthrough for a short talk I held for Bekk in September 2020. The talk can be found in Norwegian [here](https://oi.bekk.no/pangea/foredrag/9).

The `workshop/` folder is part of a workshop i held for the student organization [Online](http://online.ntnu.no/) through Bekk in October 2020.

The `sketches/base.js` file provides a base template for new sketches and is iterated on continuously, but does nothing by itself.

### Setup

There isn't a lot required to get going, but you'll need P5 itself and a local server.

```bash
npm install
```

To run the server locally:

```bash
npm start
```

The sketch will then be live on [http://localhost:3000](http://localhost:3000). The webpage will automatically reload when saving files.

### Export

The p5 method `saveCanvas()` will output a `png` file. In the base template, the method can be triggered by clicking the canvas.

Exporting videos doesn't work amazingly at the moment. How I do it is by triggering `saveCanvas()` on every frame, setting the frame rate to be maybe 4 in order to ensure no frames are lost in the processing.

After saving as many frames as I want, I format the filenames in order as follows: `00001.png`, `00002.png`, `00003.png`, etc. The format is so that the following line can combine the images into an `mp4` file:

```bash
ffmpeg -framerate 30 -i %05d.png -pix_fmt yuv420p output.mp4
```
