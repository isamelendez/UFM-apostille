import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { styles } from './styles.css'
import { FilePond } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Navbar from '../Navbar';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { Document, Page, pdfjs } from 'react-pdf';
import TextField from '@material-ui/core/TextField';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
// Register the plugins
//registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);//



class Audit extends Component {

  constructor(props){
    super(props);
    this.state = {
      files: [],
      numPages: null,
      pageNumber: 1,
      signed: false,
      // password: (localStorage.getItem('email').indexOf('secretaria') > -1) ? 'Bichomaster1' : 'Bichamaster1',
      // privateKey: (localStorage.getItem('email').indexOf('secretaria') > -1) ? '80e7ff26969d4a009d9b6724ea8c0ba7682a21685334cd063a7835ceca8ee906' : 'eb3b1ec302d3562d0934bf7795d8c2cb589fcadc5103a39c4db8d7ccb71fe9b6',
      secretaria: 'TDNEWLQIY3N45AYUHMD6TFZ3YLY4FGKF5HHKD7M5',
      facultad: '',
      hash: ''
    }
  }


  handleCodeChange(event) {
    this.setState({
        ...this.state,
        hash: event.target.value
    })
}

  uploadFiles(fileItems) {
    this.setState({
      verified: false,
      files: fileItems.map(fileItem => fileItem.file)
    })
  }

  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({ numPages });
  }

  async auditFile() {
    console.log("file")
    let password = 'Bichamaster1'
    let privateKey = 'eb3b1ec302d3562d0934bf7795d8c2cb589fcadc5103a39c4db8d7ccb71fe9b6'
    let ipfs = localStorage.getItem('fileHash')
    let hash = this.state.hash
    try {
        const resp = await fetch(`http://localhost:4000/auditapostile?hashipfs=${ipfs}&hash=${hash}`)
        var response = await resp.json();
        console.log("file is", response)
        if( response.message === "valido") {
            this.setState({
              verified: true,
              isValid: true
            })
       }
       else {
        this.setState({
          verified: true,
          isValid: false
        })
       }

    } catch(err) {
        console.log(err)
    }

}

  renderDocument(file) {
    const { pageNumber, numPages } = this.state;
    return (
      <div>
        <Document
          file={file}
          onLoadSuccess={this.onDocumentLoadSuccess}
        >
          <Page pageNumber={pageNumber} />
        </Document>
        <p>Page {pageNumber} of {numPages}</p>
      </div>
    );
  }

  render() {
    console.log("STATE FILES" , this.state.files)
    return(
        <div className="App">
          <Navbar />
          <header >
            <h1 >Upload files here</h1>
          </header>
          <div className="body">
            <FilePond
              files={this.state.files}
              allowMultiple={false}
              name={"file"}
              server='http://localhost:4000/upload'
              onprocessfile = {(error, file) => {
                const response = JSON.parse(file.serverId)
                console.log('done', response)
                localStorage.setItem('fileHash', response[0].hash)
              }}
              onupdatefiles={ (fileItems) => this.uploadFiles(fileItems) }
            />
            <TextField
              id="outlined-error"
              id="outlined-email-input"
              label="Ingresa el codigo"
              type="code"
              name="code"
              autoComplete="Ingresa el codigo"
              margin="normal"
              variant="outlined"
              onChange={(e) => this.handleCodeChange(e)}
          />
          {(localStorage.getItem('fileHash') && this.state.hash.length > 0) ? <Button variant="outlined" color="secondary" onClick={()=> this.auditFile()} >
              Validar
          </Button> : null
          }
          {
            this.state.verified ? this.state.isValid ? <div> Verificado exitosamente </div> :
            <div> Verificacion insatisfactoria, el archivo es corrupto </div> : null
          }
          </div>
        </div>
      )
  }
}

export default  Audit