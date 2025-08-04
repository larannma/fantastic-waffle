import express from 'express';
import path from 'path';
import dotenv from 'dotenv'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.static('./dist'))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './dist/index.html'))
})

app.listen(PORT, () => console.log(`Server started on port ${PORT} http://localhost:3000/`))
