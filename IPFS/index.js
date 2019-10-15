//Required modules
const ipfsAPI = require('ipfs-api');
const express = require('express');
const multer  =   require('multer');
const fs = require('fs');
const app = express();
const fileUpload = require('express-fileupload')
let nem = require("nem-sdk").default;
var transferTransaction = nem.model.objects.get("transferTransaction");
const pdf = require('pdf-parse');

app.use(function(req,res,next){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Header', 'Content-Type');
  next();
})

//Connceting to the ipfs network via infura gateway
const ipfs = ipfsAPI('ipfs.infura.io', '5001', {protocol: 'https'})

var storage = multer.memoryStorage()
var upload = multer({ storage: storage }).single('archivo')

//Reading file from computer -- path del archivo
//let testFile = fs.readFileSync("pruebaPDF.pdf");
//Creating buffer for ipfs function to add file to the system
//let testBuffer = new Buffer(testFile);

app.use(fileUpload())
app.use('/public', express.static(__dirname + '/public'))

app.post('/upload', (req, res, next) => {
  console.log("ejecuta", req.files.file.data)
  let uploadFile = req.files.file
  const fileName = req.files.file.name
  upload(req,res,function(err) {
    if(err) {
        return res.end("Error uploading file.");
    }
      //Ya que se subio correctamente se manda a IPFS accediendo 
      // al buffer donde se guardo con:  re.file.buffer  
      ipfs.files.add(req.files.file.data, function (err, file) {
        if (err) {
          console.log(err);
        }
          console.log(file)
          // respuesta con el hash del archivo con el 
          // cual se puede ir a buscar al IPFS
          res.send(file)
        })
    /*
    res.contentType("application/pdf")
    res.send(req.file.buffer)
    info del file que se subio
    console.log('----req.file---',req.file)
    info del buffer que manda a IPFS
    console.log('----req.file.buffer---',req.file.buffer)
    */
  });
})

app.post('/addfile', function (req, res, next) {
  //jala el archivo que se subio
  upload(req,res,function(err) {
    if(err) {
        return res.end("Error uploading file.");
    }
      //Ya que se subio correctamente se manda a IPFS accediendo 
      // al buffer donde se guardo con:  re.file.buffer  
      console.log("buffer", req.files.buffer)
      ipfs.files.add(req.file.buffer, function (err, file) {
        if (err) {
          console.log(err);
        }
          localStorage.setItem('documentHash', file.hash)
          console.log(file)
          // respuesta con el hash del archivo con el 
          // cual se puede ir a buscar al IPFS
          res.send(file)
        })
    /*
    res.contentType("application/pdf")
    res.send(req.file.buffer)
    info del file que se subio
    console.log('----req.file---',req.file)
    info del buffer que manda a IPFS
    console.log('----req.file.buffer---',req.file.buffer)
    */
  });
})

//obtener el archivo de IPFS
app.get('/getfile', function(req, res) {
    
    //Hash del archivo subido a IPFS -- se obtendra de la base de datos
    // const validCID = 'QmXXTxGSnMB24VmbW9nb8jp5akTYo9NFSYTonCu9cWGWe9'
    const validCID = req.query.hash

    ipfs.files.get(validCID, function (err, files) {
        files.forEach((file) => {
          //console.log(file.path)
          //console.log(file.content.toString('utf8'))

          // Para renderizar en browser
          res.contentType("application/pdf")
          console.log("content", file.content)
          res.send(file.content)
          console.log('obtenido')
        })
      })

})

app.get('/createapostile', async function(req, res){
  let validCID = req.query.hash

  ipfs.files.get(validCID, function (err, files) {
      files.forEach((file) => {
        //console.log(file.path)
        //console.log(file.content.toString('utf8'))

        // Para renderizar en browser
        //res.contentType("application/pdf")
        console.log("content", file.content)
        doTransaction(file.content);

      })
    })
  // let dataBuffer = fs.readFileSync('test.pdf');

async function doTransaction(text){
  let privateKey = req.query.private
  let password = req.query.password;
  let name = req.query.nombre;
  var endpoint = nem.model.objects.create("endpoint")(nem.model.nodes.defaultTestnet, nem.model.nodes.defaultPort);
  let common = nem.model.objects.create('common')(password,privateKey);
  var fileContent = nem.crypto.js.enc.Utf8.parse(text);
  var apostille = nem.model.apostille.create(common, `${name}`, fileContent, "UFM Certificados", nem.model.apostille.hashing["SHA256"], false, "", true, nem.model.network.data.testnet.id);
  var timeStamp = await nem.com.requests.chain.time(endpoint);
  const ts = Math.floor(timeStamp.receiveTimeStamp / 1000);
              apostille.timeStamp = ts;
              const due = 60;
              apostille.deadline = ts + due * 60;
              console.log(apostille);
              var response;
              try{
                  var response = await nem.model.transactions.send(common, apostille.transaction, endpoint);
                  if (response.code >= 2) {
                      console.error(response.message);
                  } else {
                      console.log('RESPONSE', response);
                      console.log("\nTransaction: " + response.message);
                      console.log("\nCreate a file with the fileContent text and name it:\n" + apostille.data.file.name.replace(/\.[^/.]+$/, "") + " -- Apostille TX " + response.transactionHash.data + " -- Date DD/MM/YYYY" + "." + apostille.data.file.name.split('.').pop());
                      console.log("When transaction is confirmed the file should audit successfully in Nano");
                      console.log("\nYou can also take the following hash: " + response.transactionHash.data + " and put it into the audit.js example");
                  }
                  console.log(response);
                  res.send(response);
              }catch(err){
                  res.send(err)
              }
      }
  })

  app.get('/auditapostile', async function(req, res){
    // localhost:3000/auditapostile?hash=
    let validCID = req.query.hashipfs

    ipfs.files.get(validCID, function (err, files) {
        files.forEach((file) => {
          //console.log(file.path)
          //console.log(file.content.toString('utf8'))

          // Para renderizar en browser
          //res.contentType("application/pdf")
          console.log("content", file.content)
          validation(file.content);

        })
      })
      function validation(text){
      var hash = req.query.hash;
      var contenido = text

      var endpoint = nem.model.objects.create("endpoint")(nem.model.nodes.defaultTestnet, nem.model.nodes.defaultPort);
      var fileContent = nem.crypto.js.enc.Utf8.parse(contenido);
      var txHash = hash;
      nem.com.requests.transaction.byHash(endpoint, txHash).then(function(response) {
          if (nem.model.apostille.verify(fileContent, response.transaction)) {
            // res.send(response.transaction);
              console.log(response)
              console.log("Apostille is valid");
              res.send(true)
          } else {
              console.log("Apostille is invalid");
          }
      }, function(err) {
          console.log("Apostille is invalid");
          console.log(err);
          res.send(false)
      });
  }
})

app.listen(4000, () => console.log('App listening on port 4000!'))
