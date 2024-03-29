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
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
// Register the plugins
//registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);//



class Upload extends Component {

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
      currentFile: localStorage.getItem('fileHash') ? localStorage.getItem('fileHash') : ''
    }
  }


  uploadFiles(fileItems) {
    this.setState({
      signed: false,
      files: fileItems.map(fileItem => fileItem.file)
    })
  }

  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({ numPages });
  }

  async signFile() {
    let password = 'Bichomaster1'
    let privateKey = '80e7ff26969d4a009d9b6724ea8c0ba7682a21685334cd063a7835ceca8ee906'
    let hash = localStorage.getItem('fileHash') //ipfs
    let fileName = this.state.files[0].name
    try {
        const resp = await fetch(`http://localhost:4000/apostilesecretaria?hash=${hash}&password=${password}&private=${privateKey}&nombre=${fileName}`)
        var response = await resp.json();
        if( response.message.indexOf('SUCCESS') >= 0 ) {
            console.log("signed success", response)
            localStorage.setItem('signedHash', response.transactionHash.data)
            this.setState({
              signedHash: response.transactionHash.data,
              signed: true
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



  renderTable(files) {
    const json = files
    console.log("FILE", files[0])
    const fileHash = this.state.currentFile
    const hrefFile = `http://localhost:4000/getFile?hash=${fileHash}`
    return  (
      <div>
        <Table id='tabla'>
          <TableHead>
            <TableRow>
              <TableCell id="players">File </TableCell>
              <TableCell>Size </TableCell>
              <TableCell>Last modified </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            { json.map((row) => (
              <TableRow key={row.name}>
                <TableCell component="th" scope="row">
                  <Grid container alignItems = 'center'>
                    <Grid item xs={0}>
                    </Grid>
                    <Grid item>
                      {row.name}
                    </Grid>
                  </Grid>
                </TableCell>
                <TableCell>
                  <Grid container alignItems='Center'>
                    <Grid item xs={0}>
                    </Grid>
                    <Grid item>
                    {row.size}
                    </Grid>
                  </Grid>
                </TableCell>
                <TableCell>
                  <Grid container alignItems='Center'>
                    <Grid item xs={0}>
                    </Grid>
                    <Grid item>
                    {row.lastModified}
                    </Grid>
                  </Grid>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="buttonValid">
          <Button href={hrefFile} target="_blank"> Descargar documento </Button>
          {this.state.signed ? null : <Button variant="contained" color="secondary" onClick={() => this.signFile()}> Validar </Button>}
          <div className="textContainer"> <p className="text"> Al validar los documentos usted esta firmando y autorizando la validez de los mismos. </p> </div>
        </div>
        <h1> Preview del Documento </h1>
        {this.state.currentFile ? this.renderDocument(hrefFile) : null }
      </div>
    )
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
                this.setState({
                  ... this.state,
                  currentFile: response[0].hash
                })
              }}
              onupdatefiles={ (fileItems) => this.uploadFiles(fileItems) }
            />
            {(this.state.files.length > 0) ? this.renderTable(this.state.files) : <div> Upload Files </div>}
          </div>
        </div>
      )
  }
}

export default  Upload