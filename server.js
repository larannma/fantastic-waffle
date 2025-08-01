import express from 'express';
import path from 'path';

const app = express();
const PORT = 3000
app.use(express.static('./dist'))

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './dist/index.html'))
  res.status(200)
})

app.listen(PORT, () => `Server started on port ${PORT}`)
