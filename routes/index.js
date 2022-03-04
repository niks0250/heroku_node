var express = require('express');
var router = express.Router();
var mongo = require('mongodb').MongoClient;
var objectID=require('mongodb').ObjectId;
var assert= require('assert');
const { ObjectID } = require('bson');

var url = 'mongodb://127.0.0.1:27017/';
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/insert',function(req,res,next)
{
  var item=
  {
    title:req.body.title,
    content:req.body.content,
    author:req.body.author
  };

  mongo.connect(url,function(err,client)
  {
    assert.equal(null,err);
    var db=client.db('test');
    db.collection('user-data').insertOne(item,function(err,result)
    {
      assert.equal(null,err);
      console.log('item inserted');
      client.close();
    });
  });

  res.redirect('/');
});

router.get('/get-data',function(req,res,next)
{
  var resultArr=[];
  mongo.connect(url,function(err,client)
  {
    assert.equal(null,err);
    var db = client.db('test');
    var cursor=db.collection('user-data').find();
    cursor.forEach(function(doc,err)
    {
      assert.equal(null,err);
      resultArr.push(doc);
      console.log(doc);
    },function()
    {
      client.close();
      res.render('index',{items:resultArr});
    });
  });


});


router.post('/update',function(req,res,next)
{
  var item=
  {
    title:req.body.title,
    content:req.body.content,
    author:req.body.author
  };
  var id=req.body.id;

  mongo.connect(url,function(err,client)
  {
    assert.equal(null,err);
    var db=client.db('test');
    db.collection('user-data').updateOne({"_id":objectID(id)},{$set:item},function(err,result)
    {
      assert.equal(null,err);
      console.log('item updated');
      client.close();
    });
  });

  res.redirect('/');
});

router.get('/delete_all',function(req,res,next)
{
  mongo.connect(url,function(err,client)
  {
    assert.equal(null,err);
    var db=client.db('test');
    db.collection('user-data').deleteMany({},function(err,result)
    {
      assert.equal(null,err);
      console.log('item updated');
      client.close();
      res.render('index',{items:[]});
      console.log('still good')
    });
  });
});

module.exports = router;
