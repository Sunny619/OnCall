const express = require('express')
const app = express()
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config();

const dbService = require('./dbService');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false}));
app.set('view engine', 'html')
app.use(express.static('../client'));
const hostname = '127.0.0.1';
const port = 3000;

// const cassandra = require('cassandra-driver');
// const client = new cassandra.Client({ contactPoints: ['192.168.64.8', '192.168.64.9'],localDataCenter: 'dc1', keyspace: 'oncall' });
// const query =  `Insert into assignments(day,primarycall,secondarycall) values('2022-04-05' , 'abhi','sun');`;
// client.execute(query)
//   .then(result => console.log(result));

// app.all('/', function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "X-Requested-With");
//   next()
// });
//create
app.get('/',(req,res)=>{
    res.sendFile('index.html')
});
app.get('/teams',(req,res)=>{
  res.sendFile('client/teams.html', { root: '..' })
});
app.post('/insert', (req,res)=>{
  const{start_date, end_date} =  req.body
  if(end_date<start_date)
  {
    res.json({data : 3});
  }
  else
  {
  const db = dbService.getDbServiceInstance();
  //console.log(req.body);

  const result = db.insertRow(req.body);
  result
  .then(data=>res.json({data:data}))
  .catch(err=> console.log(err));
  }
});
//read
app.get('/getAll', (req,res)=>{
  const db = dbService.getDbServiceInstance();
  const result = db.getAllData();
  result
  .then(data=>res.json({data:data}))
  .catch(err=> console.log(err));
})
//update
app.put('/modify', (req,res)=>{
  //console.log(req.body);
  
  //console.log(date);
  const db = dbService.getDbServiceInstance();
  const result = db.ModifyRow(req.body);
  result
  .then(data=>res.json({data:data}))
  .catch(err=> console.log(err));
})

//delete
app.delete('/delete', (req,res)=>{
  console.log(req.body);
  const{year, start_date, end_date, team} = req.body
  //console.log(date);
  const db = dbService.getDbServiceInstance();
  const result = db.deleteRow(year, start_date, end_date, team);
  result
  .then(data=>res.json({data:data}))
  .catch(err=> console.log(err));
})

//
app.post('/searchByName', (req,res)=>{
  console.log(req.body);
  const{val} = req.body
  //console.log(date);
  const db = dbService.getDbServiceInstance();
  const result = db.searchByName(val);
  result
  .then(data=>res.json({data:data}))
  .catch(err=> console.log(err));
})
app.post('/searchByTeam', (req,res)=>{
  console.log(req.body);
  const{val} = req.body
  //console.log(date);
  const db = dbService.getDbServiceInstance();
  const result = db.searchByTeam(val);
  result
  .then(data=>res.json({data:data}))
  .catch(err=> console.log(err));
})
app.post('/searchByDate', (req,res)=>{
  console.log(req.body);
  const{start_date, end_date} = req.body
  //console.log(date);
  if(end_date<start_date)
  {
    res.json({data : 0});
  }
  else
  {
  const db = dbService.getDbServiceInstance();
  const result = db.searchByDate(start_date, end_date);
  result
  .then(data=>res.json({data:data}))
  .catch(err=> console.log(err));
  }
})
//Teams
app.get('/getTeamAll', (req,res)=>{
  const db = dbService.getDbServiceInstance();
  const result = db.getTeamAll();
  result
  .then(data=>res.json({data:data}))
  .catch(err=> console.log(err));
})
app.post('/insertTeam', (req,res)=>{
  const db = dbService.getDbServiceInstance();
  const result = db.insertRowTeam(req.body);
  result
  .then(data=>res.json({data:data}))
  .catch(err=> console.log(err));
});
app.delete('/deleteTeam', (req,res)=>{
  const{team, name} = req.body
  //console.log(date);
  const db = dbService.getDbServiceInstance();
  const result = db.deleteRowTeam( team, name);
  result
  .then(data=>res.json({data:data}))
  .catch(err=> console.log(err));
})

app.post('/searchByTeamInTeams', (req,res)=>{
  const{val} = req.body
  //console.log(date);
  const db = dbService.getDbServiceInstance();
  const result = db.searchByTeamInTeams(val);
  result
  .then(data=>res.json({data:data}))
  .catch(err=> console.log(err));
})
app.post('/getTeams', (req,res)=>{
  const{val} = req.body
  //console.log(date);
  const db = dbService.getDbServiceInstance();
  const result = db.getTeams(val);
  result
  .then(data=>res.json({data:data}))
  .catch(err=> console.log(err));
})
app.listen(process.env.PORT, () => console.log('App is running'));