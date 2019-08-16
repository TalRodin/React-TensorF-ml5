import React, { Component } from "react";
import Dropzone from "react-dropzone";
import '../styles/App.css';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import { shadows } from '@material-ui/system';
import TextField from '@material-ui/core/TextField';


class App extends Component {
    constructor(props){
        super(props)
        this.imageRef = React.createRef();
        this.state = {
            predictions: [],
            pic: '',
            label: '',
            confidence: null,
            loading: false          
        }
        this.predict = this.predict.bind(this);
    }
    predict(){
      const classifier = ml5.imageClassifier('MobileNet', () => console.log('Model is ready!!!'))
      const image = document.getElementById('image')

      classifier.predict(image, function(err, results){
        if (!err){
          result.innerText = results[0].className;
          probability.innerText = results[0].probability.toFixed(4)
        }}).then((results) => {
            this.setState({
            predictions: results
            })
        })
    }
    componentDidMount() {
      this.predict()
    }
    onDrop = async acceptedFiles => {
      try {
        const pic = URL.createObjectURL(acceptedFiles[0]);
        this.setState({
          pic,
          label: '',
          confidence: null,
          loading: true
        });
        const classifier = await ml5.imageClassifier("MobileNet");
        const results = await classifier.predict(this.imageRef.current);
        this.setState({
          label: results[0].className,
          confidence: results[0].probability,
          loading: false
        });
      } catch (error) {
        this.setState({
        loading: false
        });
        console.log(error);
        throw error;
      }
    };
    render() {
        const { pic, label, confidence, loading } = this.state;
        let predictions = (<div className = "loader"></div>);
        if (this.state.predictions.length > 0){
            predictions = this.state.predictions.map((pred, i) => {
              let { className, probability } = pred;
              probability = Math.floor(probability * 10000) / 100 + "%";
              return (
                <Grid item xs container direction='column-reverse' key={ i + '' }>
                <Typography variant="body2" gutterBottom> { className }</Typography> 
                <Typography variant="body2" color="textSecondary">{ probability } </Typography>
                </Grid>
              )
            })
          }
        return (
            <div>
                <Paper style={{padding: 20, margin: 30}} >
                  <Grid container spacing={2}>
                    <Typography variant="overline" display="block" gutterBottom>
                      <p>Le modele considere que ceci est '<span id = 'result'style={{color:"red"}} >...</span>' avec une confidence de '<span id="probability" style={{color:"red"}}>...</span>'%</p>
                      <Grid item>
                        <img src='src/images/frenchie.jpg' crossOrigin="anonymous" id='image' width='400'/>
                      </Grid>
                    </Typography>
                  <Grid item xs={10} sm container>
                    <Grid item xs container direction="column" spacing={2}>
                      {predictions}
                    </Grid>
                    </Grid>
                  </Grid>
                </Paper>
                <hr />
                <Paper style={{padding:20, margin:30}} >
                  <div>
                     {pic ? (<img 
                        src={pic}
                        alt={"pic"}
                        align='right'
                        style={{ width: 450, height: 250 }}
                        ref={this.imageRef}
                      />):null}
                  </div>
                  <div style={{ paddingTop: 20 }}>
                    {loading ? <p>Loading...</p> : null}
                  </div>
                  <div>
                    <Typography variant="body2" align='right' gutterBottom>{label}</Typography>
                    <Typography variant="body2" color="textSecondary" align='right' gutterBottom>{confidence && `${Math.round(confidence * 100)}%`}</Typography>
                  </div>
                  <Box borderRadius={16} >
                    <div  style={{ padding: 75, cursor: "pointer", width:'200px', height: '200px', align:'center', color:'#263238' }}>
                      <div className='Dropzone'>
                        <Dropzone onDrop={this.onDrop} >
                          {({ getRootProps, getInputProps, isDragActive }) => (
                            <section >
                              <div border-color='#00e676' {...getRootProps()}>
                                <input  {...getInputProps()}/>
                                { isDragActive ? <Typography variant="body2" gutterBottom>Drop Image Here</Typography>: <Typography color="textSecondary" variant="body2" gutterBottom>Drag 'n' drop some files here, or click to select files</Typography>}
                              </div>
                            </section>
                          )}
                        </Dropzone>
                      </div>
                    </div>
                  </Box>
                </Paper>
            </div>
        );
    }
}
export default App;
