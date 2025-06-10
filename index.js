const express = require('express');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Ensure 'converted' folder exists
if (!fs.existsSync('converted')) {
  fs.mkdirSync('converted');
}

// Multer config
const upload = multer({ dest: 'uploads/' });

// Route to convert and download video
app.post('/convert', upload.single('video'), (req, res) => {
  const inputPath = req.file.path;
  const outputFileName = `${req.file.filename}.mkv`;
  const outputPath = path.join(__dirname, 'converted', outputFileName);

  ffmpeg(inputPath)
    .output(outputPath)
    .on('end', () => {
      console.log(' Conversion finished:', outputPath);
      res.download(outputPath, outputFileName, (err) => {
        // Clean up files after sending
        fs.unlinkSync(inputPath);
        fs.unlinkSync(outputPath);
        if (err) {
          console.error(' Download error:', err);
        } else {
          console.log('File sent and deleted.');
        }
      });
    })
    .on('error', (err) => {
      console.error(' Conversion error:', err);
      res.status(500).send('Conversion failed.');
    })
    .run();
});

app.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
});
