//https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SES.html#sendEmail-property

const express = require('express')
const app = express()
const port = 3000

const AWS = require('aws-sdk');
const mime = require('mime-types')
//Set Version 
AWS.config.update({region: 'ap-south-1',signatureVersion: 'v4'});
const s3 = new AWS.S3({apiVersion: '2006-03-01'});
 
  app.get('/createBucket', (req, res) => {
    var params = {
        Bucket: req.query.name, 
        ACL: 'private', //By default
            CreateBucketConfiguration: {
                LocationConstraint: "ap-south-1"
            }
       };
       s3.createBucket(params, (err, data) => {
            if (err)  res.send(err.stack);
            else     res.send(data) ;           
      });
  })

  app.get('/deleteBucket', (req, res) => {
    var params = {
        Bucket: req.query.name
       };
       s3.deleteBucket(params,(err, data) => {
            if (err)  res.send(err.stack);
            else     res.send(data) ;           
      });
  })

  //http://localhost:3000/getPresignedURLToUpload?name=s3hrvite2020&key=doc/sample.doc
  app.get('/getPresignedURLToUpload', (req, res) => {
          //TEXT WORKIGN
          // PDF WORKING

      var params = {
        Bucket: req.query.name, 
        Key: req.query.key, 
        Expires: 60,
        ContentType:mime.lookup(req.query.key)
      }; 
      s3.getSignedUrl('putObject',params, (err, url) => {
            if (err)  res.send(err.stack);
            else     res.send(url) ;           
      });
  })


  //http://localhost:3000/getPresignedURLToView?name=s3hrvite2020&key=pdf/sample.pdf
   app.get('/getPresignedURLToView', (req, res) => {
    var params = {Bucket: req.query.name, Key: req.query.key, Expires: 120,ResponseContentType: mime.lookup(req.query.key)};  
    console.log(params);
    s3.getSignedUrl('getObject',params, (err, url) => {
          if (err)  res.send(err.stack);
          else     res.send(url) ;           
    });
  })

/*
  app.get('/getPresignedURLToUploadBroswer', (req, res) => {
 
      const params = {
        Bucket: req.query.name,
        //Expires: 60, // in seconds,
        Fields: {
          key: 'key1', // totally random
        },
        Conditions: [
          ["starts-with", "$Content-Type", "image/"],// <= I want to allow only images upload
          ["content-length-range", 0, 10485760], // <= file size limit is also don't work!
          
        ]
    }
    s3.createPresignedPost(params, (err, url) => {
          if (err)  res.send(err.stack);
          else     res.send(url) ;           
    });
}) */

  

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))