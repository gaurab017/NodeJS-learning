const fs = require('fs');
const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`))

const getAllTours =  (req, res) => {
  res.status(200).json({
    status:'sucess',
    data : {
        tours: tours
    }
  })
}
const postTour = (req,res)=>{
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
}

const getTourById = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find(e=> e.id === id)
  
  if(!tour){
    res.status(404).json({
      status:"fail",
      message:"Invalid ID"
    })
  }
  res.status(200).json({
    status:'sucess',
    data : {
        tours: tour
    }
  });
};
const updateTour = (req,res)=>{
  if(req.params.id * 1> tours.length){
   res.status(404).json({
      status:"fail",
      message:"Invalid ID"
    }) 
  }
  res.status(200).json({
    status: 'success',
    data:{
      tour : `<Updated tour here...>`
    }
  })
}

const deleteTour = (req,res)=>{
  if(req.params.id * 1> tours.length){
   res.status(404).json({
      status:"fail",
      message:"Invalid ID"
    }) 
  }
  res.status(204).json({
    status: 'sucess',
    data:null
  })
}

app.route('/api/v1/tours')
   .get(getAllTours)
   .patch(postTour)
   
app.route('/api/v1/tours/:id')
   .get(getTourById)
   .patch(updateTour)
   .delete('/api/v1/tours/:id',deleteTour);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
