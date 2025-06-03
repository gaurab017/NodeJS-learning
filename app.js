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

app.post('/api/v1/tours', (req,res)=>{
    // console.log(req.body);
    const newId = tours[tours.length-1].id+1;
    const newTour = Object.assign({id:newId}, req.body);
    tours.push(newTour);

    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`,JSON.stringify(tours, null,2),(err)=>{
      res.status(200).json({
        status : 'sucess',
        data: {
        tours :newTour
        }
      })
    })
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
