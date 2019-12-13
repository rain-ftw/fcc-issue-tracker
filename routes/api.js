/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectID;


const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});


module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      var project = req.params.project;
      var query = req.query;
       
      if(query.hasOwnProperty('open')){
        if(query.open == 'true')
          query.open = true;
        else
          query.open = false;
      }
      
      MongoClient.connect(CONNECTION_STRING, (err,db) => {
        
        db.collection(project).find(query).toArray((err,docs)=> {
          res.json(docs);
        });
        db.close();
        })
      })

    .post(function (req, res){
      var project = req.params.project;
      let body = req.body;
    
      const issue = {
          'issue_title': body.issue_title,
          'issue_text': body.issue_text,
          'created_on': new Date().toISOString(),
          'updated_on': new Date().toISOString(),
          'created_by': body.created_by || '',
          'assigned_to': body.assigned_to || '',
          'open': true,
          'status_text': body.status_text || '',
      };
    
      MongoClient.connect(CONNECTION_STRING, (err,db) => {
        db.collection(project).insertOne(issue , (err,docs) => {
          if(err)
            res.json('Missing Inputs');
          res.json(docs.ops[0]);
        });
        db.close();
      })
    })
    
    .put(function (req, res){
      var project = req.params.project;
      let body = req.body;
      let b = body._id;
    
       let set = Object.keys(body).filter( key => body[key] == '' );
       
       for(let i = 0; i < set.length; i++){
         delete body[set[i]];
       }
    
      if(body.hasOwnProperty('open')){
        if(body.open == 'true')
          body.open = true;
        else
          body.open = false;
      }
    

      delete body['_id'];
      body['updated_on'] = new Date().toISOString();
    
      //console.log(b);
      //console.log(body);
    
      if(Object.keys(body).length > 1)
      {
     
      MongoClient.connect(CONNECTION_STRING, (err,db) => {
       db.collection(project).updateOne({_id: ObjectId(b)},{$set:body},(err,data) => {
          if(err)
              return console.error(err);
           if(data.result.n == 0)
             {
               console.log('error');
               return res.json('could not update '+b);
             }
           console.log('success');
           return res.json('successfully updated');
       })
        db.close();
      })       
      }
      else
        res.json('no update field sent');
      
    })
    
    .delete(function (req, res){
      
      let project = req.params.project;
      let body = req.body;
      let id = body._id;
      
      if(id.match(/^[A-F0-9]{24}$/gi) ==  null)
        return res.json('id_error');
    
        MongoClient.connect(CONNECTION_STRING, (err,db) => {
          db.collection(project).deleteOne({_id:ObjectId(id)} , (err,data) => {
            if(err || data.result.n == 0) 
              return res.json('could not delete id '+id);
            else if(data.result.n > 0)
              return res.json('deleted id '+id);
          })
        });
    
    
  });
};
