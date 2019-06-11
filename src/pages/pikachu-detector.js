import React from 'react'
import Helmet from 'react-helmet'
import * as tf from '@tensorflow/tfjs';
import {loadGraphModel} from '@tensorflow/tfjs-converter';

class PikachuDetector extends React.Component {

    componentDidMount() {
        this.loadModel();
        // this.setState({
        //     tf: require('@tensorflow/tfjs')
        // });
    }

    constructor(props) {
        super(props);
        this.state = {
            clicked: false,
            file: null,
            model: null,
            output: 'loading model'
        };
        this.handleChange = this.handleChange.bind(this)
    }

    async loadModel() {
        // const MODEL_URL = 'http://localhost:8000/model.json';
        const MODEL_URL = 'https://www.coocloud.co.za/model.json';

        // const model = await loadGraphModel(MODEL_URL);
        const model = await tf.loadLayersModel(MODEL_URL);
        // const model = await tf.models.modelFromJSON(MODEL_URL);
        // const handler = tfn.io.fileSystem(MODEL_URL);
        // const model = await tf.loadModel(handler);
        // const model = await tf.loadLayersModel('file://static/model.json');
        console.log(model);
        console.log("model loaded");
        this.setState({
            model
        })
        // const pika = document.getElementById('imageFile');
        // model.execute(tf.fromPixels(pika));
    }

    async predict(event) {
        let {model, file} = this.state;
        this.setState({
            output: 'predicting'
        });
        console.log(model);
        console.log(file);
        // var canvas = document.createElement("canvas");
        // var ctx = canvas.getContext("2d");
        // var imageData;
        let file2 = document.getElementById("myImage");
        // const img = document.getElementById('myimg');
        const tfImg = tf.browser.fromPixels(file2);
        const smalImg = tf.image.resizeBilinear(tfImg, [150, 150]);
        const resized = tf.cast(smalImg, 'float32');
        const t4d = tf.tensor4d(Array.from(resized.dataSync()),[1,150,150,3]);
        // ctx.drawImage(file2, 0, 0);
        // imageData = ctx.getImageData(0, 0, file2.width, file2.height).data;
        // const example = tf.browser.fromPixels(new ImageData(imageData, 150, 150));
        // debugger;
        const example = tf.browser.fromPixels(file2);
        const prediction = await model.predict(t4d);
        console.log('predicting');
        console.log(prediction);
        console.log(prediction.print());
        // let modelPredFlat = prediction.flatten();
        let predData = await prediction.data();
        console.log(predData);
        if (predData[0] > 0.5) {
            console.log("Not Pikachu");
            this.setState({
                output: 'Not Pikachu'
            });
        } else {
            console.log("Pikachu");
            this.setState({
                output: 'Pikachu'
            });
        }
    }

    handleChange(event) {
        // var file = document.getElementById('imageFile').files[0]; -->bad
        this.setState({
            file: URL.createObjectURL(event.target.files[0]),
            output: ''
        })
    }


    render() {
        const siteTitle = 'Pikachu Detector | coocloud'
        const siteDescription = 'Pikachu Image Classifier';
        const viewportDescription = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0';

        return (
            <React.Fragment>
                <header>
                    {/*<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest"></script>*/}
                    <Helmet
                    htmlAttributes={{lang: 'en'}}
                    meta={[{name: 'description', content: siteDescription}]}
                    meta={[{name: 'viewport', content: viewportDescription}]}
                    title={`${siteTitle}`}
                /></header>

                <div className="pikachu">
                    <h1 className="heading">Pikachu Detector (WIP - only used 300 images to train)</h1>
                    <div>
                        <input id="imageFile" type="file" onChange={this.handleChange}/>
                        <img id="myImage" src={this.state.file} alt="Image to predict"/>
                    </div>
                    <div>
                        <button className="predictButton" onClick={(e) => this.predict(e)}>Predict</button>
                    </div>
                    <div>
                        <span>{this.state.output}</span>
                    </div>
                </div>


            </React.Fragment>

        )
    }

}

export default PikachuDetector;
