import React from 'react'
import Helmet from 'react-helmet'
import * as tf from '@tensorflow/tfjs';
import {loadGraphModel} from '@tensorflow/tfjs-converter';

class CatsDogsDetector extends React.Component {

    componentDidMount() {
        this.loadModel();
    }

    constructor(props) {
        super(props);
        this.state = {
            clicked: false,
            file: null,
            model: null,
            output: 'loading model',
            load: true
        };
        this.handleChange = this.handleChange.bind(this)
    }

    async loadModel() {
        // const MODEL_URL = 'http://localhost:8000/catsdogs/cdmodel.json';
        // const MODEL_URL = 'https://www.coocloud.co.za/catsdogs/cdmodel.json';
        const MODEL_URL = 'catsdogs/cdmodel.json';
        const model = await tf.loadLayersModel(MODEL_URL);
        console.log("model loaded");
        this.setState({
            model,
            load: false,
            output: 'model loaded'
        })
    }

    async predict(event) {
        let {model, file} = this.state;
        this.setState({
            output: 'predicting'
        });
        let file2 = document.getElementById("myImage");
        const tfImg = tf.browser.fromPixels(file2);
        const smalImg = tf.image.resizeBilinear(tfImg, [150, 150]);
        const resized = tf.cast(smalImg, 'float32');
        const t4d = tf.tensor4d(Array.from(resized.dataSync()),[1,150,150,3]);

        const example = tf.browser.fromPixels(file2);
        const prediction = await model.predict(t4d);
        console.log('predicting');
        console.log(prediction);
        console.log(prediction.print());
        // let modelPredFlat = prediction.flatten();
        let predData = await prediction.data();
        console.log(predData);
        if (predData[0] < 0.5) {
            console.log("Cat");
            this.setState({
                output: 'This looks more like a Cat'
            });
        } else {
            this.setState({
                output: 'This looks more like a Dog'
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
        const siteTitle = 'Cats Dogs Detector | coocloud'
        const siteDescription = 'Cats Dogs Image Classifier';
        const viewportDescription = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0';

        return (
            <React.Fragment>
                <header>
                    <Helmet
                        htmlAttributes={{lang: 'en'}}
                        meta={[{name: 'description', content: siteDescription}]}
                        meta={[{name: 'viewport', content: viewportDescription}]}
                        title={`${siteTitle}`}
                    /></header>

                <div className="catsdogs">
                    <h1 className="heading">Cats Dogs Detector</h1>
                    <div>
                        <input id="imageFile" type="file" onChange={this.handleChange}/>
                        <img id="myImage" src={this.state.file} alt="Image to predict"/>
                    </div>
                    <div>
                        <button disabled={this.state.load} className="predictButton" onClick={(e) => this.predict(e)}>Predict</button>
                    </div>
                    <div>
                        <span>{this.state.output}</span>
                    </div>
                </div>


            </React.Fragment>

        )
    }

}

export default CatsDogsDetector;
