const fs = require('fs');
const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`))
app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status:'sucess',
    data : {
        tours: tours
    }
  });
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
