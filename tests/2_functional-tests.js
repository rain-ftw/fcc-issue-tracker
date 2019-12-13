/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');
var ObjectId = require("mongodb").ObjectID;
chai.use(chaiHttp);

var id = ObjectId();

suite('Functional Tests', function() {
  
    suite('POST /api/issues/{project} => object with issue data', function() {
      
      test('Every field filled in', function(done) {
       chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title,'Title');
          assert.equal(res.body.issue_text,'text');
          assert.equal(res.body.created_by,'Functional Test - Every field filled in');
          assert.equal(res.body.assigned_to,'Chai and Mocha');
          assert.equal(res.body.status_text,'In QA');  
          assert.equal(res.body.open,true);
          done();
        });
      });
      
      test('Required fields filled in', function(done) {
        chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title,'Title');
          assert.equal(res.body.issue_text,'text');
          assert.equal(res.body.created_by,'Functional Test - Every field filled in');
          assert.equal(res.body.assigned_to,'');
          assert.equal(res.body.status_text,'');  
          assert.equal(res.body.open,true);
          done();
        });
      });
      
      test('Missing required fields', function(done) {
        chai.request(server)
        .post('/api/issues/test')
        .send({
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          done();
        });
      });
      
    });
    
    suite('PUT /api/issues/{project} => text', function() {
      
      test('No body', function(done) {
          chai.request(server)
        .put('/api/issues/test')
        .send({
              _id: id
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text,'"no update field sent"');
          done();
        });
      });
      
      test('One field to update', function(done) {
          chai.request(server)
        .put('/api/issues/test')
        .send({
              _id: ObjectId('5df1ee43525f15325e774620'),
              issue_title:'Text'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text,'"successfully updated"');
          done();
        });
      });
      
      test('Multiple fields to update', function(done) {
           chai.request(server)
        .put('/api/issues/test')
        .send({
              _id: ObjectId('5df1ee43525f15325e774620'),
              issue_title:'title',
              issue_text: 'text'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text,'"successfully updated"');
          done();
        });
      });
      
    });
    
    suite('GET /api/issues/{project} => Array of objects with issue data', function() {
      
      test('No filter', function(done) {
        chai.request(server)
        .get('/api/issues/apitest')
        .query({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
      test('One filter', function(done) {
           chai.request(server)
        .get('/api/issues/apitest')
        .query({open:true})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
           chai.request(server)
        .get('/api/issues/apitest')
        .query({open:true,issue_title:'Delete'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
    });
    
    suite('DELETE /api/issues/{project} => text', function() {
      
      test('No _id', function(done) {
         chai.request(server).delete('/api/issues/test').send({_id: ''}).end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, '"id_error"');
          done();
        });
      });
      
      test('Valid _id', function(done) {
         chai.request(server).delete('/api/issues/test').send({_id: '5df1ef1b5ec235347427deb9'}).end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, '"could not delete id 5df1ef1b5ec235347427deb9"');
           done();
        });
      });  
    });

});
