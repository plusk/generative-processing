### Project structure

This repository serves as both a collection of generative artwork, and a website displaying some of that artwork. The majority of the work can be found in the `sketches/` directory. Some sketches have been posted on Instagram, others are still missing a certain _je ne sais quoi_, and some are just straight-up duds.

`index.html` provides an entry point for the project, where the `script` tag at the bottom determines which sketch will be viewed.

The `talk/` folder is part of a code walkthrough for a short talk I held for Bekk in September 2020. The talk can be found in Norwegian [here](https://oi.bekk.no/pangea/foredrag/9). The talk provides a rough introduction to generative art before transitioning to re-building one of my old sketches from scratch.

The `workshop/` folder is part of a workshop I held for the student organization [Online](http://online.ntnu.no/) through Bekk in October 2020. Five sketches were made to show some generative art basics, with a focus on having many tweakable parameters. The students cloned the repository, tweaked the parameters to their preference, and had the option to print out the final images in an A2 paper format.

The `article/` folder is part of an article I wrote for [bekk.christmas](http://bekk.christmas/), specifically the JavaScript advent calendar of 2020. The article is available to read in English [here](https://javascript.christmas/2020/16/). The concept of the article to make more of a fun "yay it's snowing in your browser" kind of thing step-by-step, as opposed to focusing on the art aspect of generative art.

The `sketches/base.js` file provides a base template for new sketches and is iterated on continuously, but does nothing by itself.

### Setup

There isn't a lot required to get going, but you'll want a local server for hot reloading.

```bash
npm install
```

To run the server locally:

```bash
npm start
```

The sketch will then be live on [http://localhost:3000](http://localhost:3000). Change the script tag at the bottom of `index.html` to switch sketches to whatever file you want. The webpage will automatically reload when saving files.

If updating a sketch referenced in `data.js`, a GitHub Action will automatically update the website when the `master` branch is updated.

### Export

The p5 method `saveCanvas()` will output a `png` file. In the base template, the method can be triggered by clicking the canvas.

Exporting videos doesn't work amazingly at the moment. How I do it is by triggering `saveCanvas()` on every frame, setting the frame rate to be maybe 4 in order to ensure no frames are lost in the processing.

After saving as many frames as I want, I format the filenames in order as follows: `00001.png`, `00002.png`, `00003.png`, etc. The format is so that the following line can combine the images into an `mp4` file:

```bash
ffmpeg -framerate 30 -i %05d.png -pix_fmt yuv420p output.mp4
```
