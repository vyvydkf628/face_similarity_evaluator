const express = require('express')
const app = express()
const multer = require('multer')
const cors = require('cors');
const port = process.env.PORT || 80;

const { evalSimilarity } = require('./face-api/faceRecognition')

app.use(cors());

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10000000
  },
  fileFilter(req, file, cb) {
    if (!file) {
      return cb(new Error('must be image'))
    }

    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('must be png, jpg or jpeg'))
    }

    cb(undefined, true)
  }
}).fields([
  {
    name: "image_1",
    maxCount: 1,
  },{
    name: "image_2",
    maxCount: 1,
  }
])

app.post('/detect', upload, async (req, res, next) => {
  try {
    if (!req.files || !req.files.image_1 || !req.files.image_2) {
      return res.status(400).send({ error: "must be 2 images" })
    }

    res.status(200).send({
      score: await evalSimilarity(req.files.image_1[0].buffer, req.files.image_2[0].buffer)
    })
  } catch (error) {
    next(error)
  }
}, (error, req, res, next) => {
  if (error.name == "MulterError"){
    return res.status(400).send({ error: error })
  }

  res.status(400).send({ error: "fail to find faces" })
})

app.listen(port)
