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
    }
  }




  uploadFiles(fileItems) {
    this.setState({
      files: fileItems.map(fileItem => fileItem)
    })
  }

  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({ numPages });
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
          <Button variant="contained" color="secondary" > Validar </Button>
          <div className="textContainer"> <p className="text"> Al validar los documentos usted esta firmando y autorizando la validez de los mismos. </p> </div>
        </div>
        {this.renderDocument(files[0].name)}
      </div>
    )
  }

  render() {
    console.log("STATE FILES" , this.state.files)
    return(
        <div>
          <header >
            <h1 >Upload files here</h1>
          </header>
          <div className="body">

              <form id      =  "uploadForm"
                enctype   =  "multipart/form-data"
                action    =  "http://localhost:4000/addfile"
                method    =  "post">

                <input type="file" name="archivo" />
                <input type="submit" value="Enviar archivo" name="submit" />
            </form>
            <FilePond
              files={this.state.files}
              allowMultiple={true}
              maxFiles={3}
              server='http://localhost:4000/addfile'
              onupdatefiles={ (fileItems) => this.uploadFiles(fileItems) }
            />
            {(this.state.files.length > 0) ? this.renderTable(this.state.files) : <div> Upload Files </div>}
          </div>
        </div>
      )
  }
}

export default  Upload