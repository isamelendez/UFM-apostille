import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { styles } from './styles.css'
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';
import Navbar from '../Navbar';

class Pending extends Component {

constructor(props){
    super(props);
    this.state = {
    rows: [],
    documents: []
    }
}

componentDidMount() {
    this.getFiles()
  }



async getFiles() {
    try {
        const resp = await fetch(`http://localhost:4000/getDocuments`)
        var response = await resp.json();
        console.log("file is", response)
        if( response.length > 0) {
            this.setState({
              documents: response
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

async signFile(hash, filename) {
    let password = 'Bichamaster1'
    let privateKey = 'eb3b1ec302d3562d0934bf7795d8c2cb589fcadc5103a39c4db8d7ccb71fe9b6'
    try {
        const resp = await fetch(`http://localhost:4000/apostiledecano?hash=${hash}&password=${password}&private=${privateKey}&nombre=${filename}`) //CAMBIAAAAR
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

renderAccordion() {
    const files = this.state.documents
    return (
        <div className="rootMain">
          {files.map((row) => (
          <ExpansionPanel>
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography className="heading">{row.fileName } </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Typography>
                <p>Nombre del archivo: {row.fileName} < br /> </p>
                <p>Estudiante: {row.correo} < br /> </p>
                <p>Hash validacion secretaria: {row.hashSecretaria} < br /> </p>
                <p> Hash IPFS: {row.hashIpfs} </p>
                <Button variant="outlined" color="secondary" target="_blank" href={`http://localhost:4000/getFile?hash=${row.hashIpfs}`}>
                    Ver archivo
                </Button>
                <Button variant="outlined" color="secondary" onClick={() => this.signFile(row.hashIpfs, row.fileName)}>
                    Validar archivo
                </Button>
              </Typography>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          ))
          }
        </div>
      )
}

render() {
    return(
        <div className="App">
            <Navbar />
            <h1> Pedientes por validar </h1>
            {(this.state.documents.length > 0) ? this.renderAccordion() : <h1>No hay archivos pendientes</h1>}
        </div>
    )
}

}

export default  Pending