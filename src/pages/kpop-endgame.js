import React from 'react'
import Helmet from 'react-helmet'
import Tachyons from "../components/tachyons"

// import html2canvas from 'html2canvas';

class KpopEndgame extends React.Component {

    componentDidMount() {
        this.setState({
            html2canvas: require('html2canvas')
        });
        // import('html2canvas').then((html2canvas) => {
        //     this.setState({
        //         html2canvas
        //     })
        // }).catch(console.error);
    }

    constructor(props) {
        super(props);
        this.state = {
            clicked: false,
            DEBUG: false,
            REPETITION_COUNT: 2,
            NUM_FRAMES: 120,
            html2canvas: null,
            ALL_ARTIST_COUNT: 33,
            gauntletUsageText: "Click the gauntlet and slowly scroll down"
        };
    }

    generateFrames($canvas, count = 32) {
        const {REPETITION_COUNT} = this.state;
        const {width, height} = $canvas;
        const ctx = $canvas.getContext("2d");
        const originalData = ctx.getImageData(0, 0, width, height);
        const imageDatas = [...Array(count)].map(
            (_, i) => ctx.createImageData(width, height)
        );
        debugger;

        // assign the pixels to a canvas
        // each pixel is assigned to 2 canvas', based on its x-position
        for (let x = 0; x < width; ++x) {
            for (let y = 0; y < height; ++y) {
                for (let i = 0; i < REPETITION_COUNT; ++i) {
                    const dataIndex = Math.floor(
                        count * (Math.random() + 2 * x / width) / 3
                    );
                    const pixelIndex = (y * width + x) * 4;
                    // copy the pixel over from the original image
                    for (let offset = 0; offset < 4; ++offset) {
                        imageDatas[dataIndex].data[pixelIndex + offset]
                            = originalData.data[pixelIndex + offset];
                    }
                }
            }
        }

        // turn image datas into canvas'
        return imageDatas.map(data => {
            const $c = $canvas.cloneNode(true);
            $c.getContext("2d").putImageData(data, 0, 0);
            return $c;
        });
    }

    handleButtonClick(event) {
        let {clicked} = this.state;
        console.log("Disintegrate: ", event);
        console.log(clicked);
        // this.disintegrate();
        this.setState({
            clicked: true
        });
        let myTimeoutFunction = setTimeout(() => {
            let { ALL_ARTIST_COUNT } = this.state;
            console.log('set timeout');
            this.disintegrate();
            let disintegratedArtistsCount = document.querySelectorAll(".disintegrated").length;
            console.log(ALL_ARTIST_COUNT, disintegratedArtistsCount);
            if (disintegratedArtistsCount >= ALL_ARTIST_COUNT) {
                clearInterval(myTimeoutFunction);
                this.setState({
                    gauntletUsageText: "Can someone bring them all back? 😔"
                });
            }
        }, 250);
        // if (clicked) {
        //     console.log('Already Disintegrated');
        // } else {
        //     this.disintegrate();
        //     this.setState({
        //         clicked: true
        //     })
        // }
    }

    replaceElementVisually($old, $new) {
        const $parent = $old.offsetParent;
        $new.style.top = `${$old.offsetTop}px`;
        $new.style.left = `${$old.offsetLeft}px`;
        $new.style.width = `${$old.offsetWidth}px`;
        $new.style.height = `${$old.offsetHeight}px`;
        $parent.appendChild($new);
        $old.style.visibility = "hidden";
    }

    disintegrate() {
        console.log('disintegrating');
        let i = 1;
        document.querySelectorAll(".artist").forEach(artist => {
            // html2canvas(artist).then(function(canvas) {
            //     document.body.appendChild(canvas);
            //     disintegrate2();
            // });
            // this.disintegrate2(artist);
            // setTimeout(() => this.disintegrate3(artist), i * 20);
            // i += 1;
            // console.log(artist);
            if (this.isInViewport(artist)) {
                if (artist.classList.contains("disintegrated") || artist.classList.contains("busy")) {
                    console.log("element already disintegrated");
                } else {
                    this.disintegrate3(artist);
                    artist.classList.add("busy");
                }
            }
        });
    }

    setIntervalDisintegrate() {
        console.log("set interval");
        let {clicked} = this.state;
        if (clicked) {
            this.disintegrate();
        }
    }

    isInViewport(elem) {
        if (window) {
            var bounding = elem.getBoundingClientRect();
            return (
                bounding.top >= 0 &&
                bounding.left >= 0 &&
                bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        }
        return false;
    }

    disintegrate3($elm) {
        const {html2canvas} = this.state;
        // original code from https://jsfiddle.net/or20wx3h/
        var useWidth = $elm.style.width;
        var useHeight = $elm.style.height;
        let frameIter = 32;

        let window_width = 900;
        if (window) {
            console.log(window.screen.width);
            window_width = window.screen.width;
        }

        if (window_width <= 900) {
            // $elm.style.position = 'relative';
            // $elm.style.top = window.innerHeight + 'px';
            // $elm.style.left = 0;
            frameIter = 4;
        }


        html2canvas($elm, {
            width: useWidth,
            height: useHeight,
        }).then($canvas => {

            if (window_width <= 900) {
                // $elm.style.position = 'absolute';
                // $elm.style.top = 0;
                // $elm.style.left = "-9999px";
            }

            const ctx = $canvas.getContext("2d");
            const {width, height} = $canvas;
            const originalFrame = ctx.getImageData(0, 0, width, height);

            // generate our frames
            const frames = [];
            for (let i = 0; i < frameIter; ++i) {
                frames[i] = ctx.createImageData(width, height);
            }
            for (let x = 0; x < width; ++x) {
                for (let y = 0; y < height; ++y) {
                    for (let l = 0; l < 2; ++l) {
                        var frameIndex = Math.floor(frameIter * (Math.random() + 2 * x / width) / 3);
                        var pixelIndex = 4 * (y * width + x);
                        for (let channelOffset = 0; 4 > channelOffset; ++channelOffset) {
                            frames[frameIndex].data[pixelIndex + channelOffset]
                                = originalFrame.data[pixelIndex + channelOffset];
                        }
                    }
                }
            }

            // generate the container for our frames
            const $container = document.createElement("div");
            $container.classList.add("disintegration-container");
            $container.style.width = `${width}px`;
            $container.style.height = `${height}px`;

            // then generate all the canvas'
            const $frameCanvases = frames.map((frameData, i) => {
                const $c = $canvas.cloneNode(true);
                $c.getContext("2d").putImageData(frameData, 0, 0);
                $c.style.transitionDelay = `${1.35 * i / frames.length}s`;

                $container.appendChild($c);
                return $c;
            });

            // animate the canvas'
            $elm.classList.add("disintegrated");
            $elm.appendChild($container);
            $container.offsetLeft; // forces reflow, so CSS we apply below does transition
            $frameCanvases.forEach($c => {
                const random = 2 * Math.PI * (Math.random() - .5);
                $c.style.transform = `rotate(${15 * (Math.random() - 0.5)}deg) translate(${60 * Math.cos(random)}px, ${30 * Math.sin(random)}px)
rotate(${15 * (Math.random() - 0.5)}deg)`;
                $c.style.opacity = 0;
            });
        });
    }

    disintegrate2($elm) {
        const {html2canvas} = this.state;
        const {DEBUG, NUM_FRAMES} = this.state;
        html2canvas($elm).then($canvas => {
            // create the container we'll use to replace the element with
            const $container = document.createElement("div");
            $container.classList.add("disintegration-container");

            // setup the frames for animation
            const $frames = this.generateFrames($canvas, NUM_FRAMES);
            $frames.forEach(($frame, i) => {
                $frame.style.transitionDelay = `${1.35 * i / $frames.length}s`;
                $container.appendChild($frame);
            });

            // then insert them into the DOM over the element
            this.replaceElementVisually($elm, $container);

            // then animate them
            $container.offsetLeft; // forces reflow, so CSS we apply below does transition
            if (!DEBUG) {
                // set the values the frame should animate to
                // note that this is done after reflow so the transitions trigger
                $frames.forEach($frame => {
                    const randomRadian = 2 * Math.PI * (Math.random() - 0.5);
                    $frame.style.transform =
                        `rotate(${15 * (Math.random() - 0.5)}deg) translate(${60 * Math.cos(randomRadian)}px, ${30 * Math.sin(randomRadian)}px)
rotate(${15 * (Math.random() - 0.5)}deg)`;
                    $frame.style.opacity = 0;
                });
            } else {
                $frames.forEach($frame => {
                    $frame.style.animation = `debug-pulse 1s ease ${$frame.style.transitionDelay} infinite alternate`;
                });
            }
        });
    }

    render() {
        const siteTitle = 'Kpop Endgame | coocloud'
        const siteDescription = 'List of kpop artists who managed to survive the SNAP';
        const viewportDescription = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0';
        // let { gauntletUsageText } = this.state;
        return (
            <React.Fragment>
                <header><Helmet
                    htmlAttributes={{lang: 'en'}}
                    meta={[{name: 'description', content: siteDescription}]}
                    meta={[{name: 'viewport', content: viewportDescription}]}
                    title={`${siteTitle}`}
                /></header>

                <div className="kpop">
                    <section className="mw5 mw7-ns center bg-light-gray pa3 ph5-ns">
                        <div onClick={(e) => this.handleButtonClick(e)}>
                            <h1 className="mt0">KPOP Endgame</h1>
                            <h4>Google's Thanos's Infinity Gauntlet</h4>
                            <p className="lh-copy measure clickable">
                                <img className="google" src="https://www.google.com/logos/fnbx/thanos/thanos_idle.png"
                                     alt="Google's Thanos infinity gauntlet"
                                />
                            </p>
                            <span className="gauntlet-text">{this.state.gauntletUsageText}</span>
                        </div>
                    </section>

                    <Tachyons>
                        <article>
                            <h2 className="f3 fw4 pa3 mv0">Artists</h2>
                            <div className="cf pa2">
                                <div className="fl w-50 w-25-m w-20-l pa2">
                                    <a href="https://www.instagram.com/yoona__lim/"
                                       className="db link dim tc">
                                        <img
                                            src="https://wiki.d-addicts.com/images/9/9a/YoonA.jpg"
                                            alt="Yoona Im" className="w-100 db outline black-10"/>
                                        <dl className="mt2 f6 lh-copy">
                                            <dt className="clip">Title</dt>
                                            <dd className="ml0 black truncate w-100">SNSD</dd>
                                            <dt className="clip">Artist</dt>
                                            <dd className="ml0 gray truncate w-100">Yoona Im</dd>
                                        </dl>
                                    </a>
                                </div>
                                <div className="fl w-50 w-25-m w-20-l pa2">
                                    <a href="https://www.instagram.com/jessica.syj/?hl=en"
                                       className="db link dim tc artist">
                                        <img
                                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Jessica_on_the_CLEO_Thailand_magazine_%28cropped%29.png/250px-Jessica_on_the_CLEO_Thailand_magazine_%28cropped%29.png"
                                            alt="Jessica Jung" className="w-100 db outline black-10"/>
                                        <dl className="mt2 f6 lh-copy">
                                            <dt className="clip">Title</dt>
                                            <dd className="ml0 black truncate w-100 ttu">SNSD</dd>
                                            <dt className="clip">Artist</dt>
                                            <dd className="ml0 gray truncate w-100">Jessica Jung</dd>
                                        </dl>
                                    </a>
                                </div>
                                <div className="fl w-50 w-25-m w-20-l pa2">
                                    <a href="https://www.instagram.com/taeyeon_ss/"
                                       className="db link dim tc">
                                        <img
                                            src="https://channel-korea.com/wp-content/uploads/2018/07/taeyeon.jpg"
                                            alt="Taeyeon Kim"
                                            className="w-100 db outline black-10"/>
                                        <dl className="mt2 f6 lh-copy">
                                            <dt className="clip">Title</dt>
                                            <dd className="ml0 black truncate w-100">SNSD</dd>
                                            <dt className="clip">Artist</dt>
                                            <dd className="ml0 gray truncate w-100">Taeyeon Kim</dd>
                                        </dl>
                                    </a>
                                </div>
                                <div className="fl w-50 w-25-m w-20-l pa2">
                                    <a href="https://www.instagram.com/tiffanyyoungofficial/"
                                       className="db link dim tc">
                                        <img
                                            src="https://img00.deviantart.net/d7fa/i/2012/100/4/9/girls_generation_snsd_run_devil_run_tiffany_01_by_rundevilrunjs-d4vnvm8.jpg"
                                            alt="Tiffany Young Deviantart" className="w-100 db outline black-10"/>
                                        <dl className="mt2 f6 lh-copy">
                                            <dt className="clip">Title</dt>
                                            <dd className="ml0 black truncate w-100">SNSD</dd>
                                            <dt className="clip">Artist</dt>
                                            <dd className="ml0 gray truncate w-100">Tiffany Young</dd>
                                        </dl>
                                    </a>
                                </div>
                                <div className="fl w-50 w-25-m w-20-l pa2">
                                    <a href="https://www.instagram.com/515sunnyday/"
                                       className="db link dim tc">
                                        <img
                                            src="https://www.allkpop.com/upload/2017/12/af_org/28055730/Girls-Generation-Sunny.jpg"
                                            alt="Sunny" className="w-100 db outline black-10"/>
                                        <dl className="mt2 f6 lh-copy">
                                            <dt className="clip">Title</dt>
                                            <dd className="ml0 black truncate w-100">SNSD</dd>
                                            <dt className="clip">Artist</dt>
                                            <dd className="ml0 gray truncate w-100">Sunny</dd>
                                        </dl>
                                    </a>
                                </div>
                                <div className="fl w-50 w-25-m w-20-l pa2">
                                    <a href="https://www.instagram.com/seojuhyun_s/"
                                       className="db link dim tc">
                                        <img
                                            src="https://channel-korea.com/wp-content/uploads/2018/04/Seohyun-SNSD.jpg"
                                            alt="Seohyun channel korea" className="w-100 db outline black-10"/>
                                        <dl className="mt2 f6 lh-copy">
                                            <dt className="clip">Title</dt>
                                            <dd className="ml0 black truncate w-100">SNSD</dd>
                                            <dt className="clip">Artist</dt>
                                            <dd className="ml0 gray truncate w-100">Seohyun</dd>
                                        </dl>
                                    </a>
                                </div>
                                <div className="fl w-50 w-25-m w-20-l pa2">
                                    <a href="https://www.instagram.com/yulyulk/"
                                       className="db link dim tc">
                                        <img
                                            src="https://koreaboo-cdn.storage.googleapis.com/2015/09/SNSD_Yuri-UrbanDecay.jpg"
                                            alt="Yuri Koreaboo" className="w-100 db outline black-10"/>
                                        <dl className="mt2 f6 lh-copy">
                                            <dt className="clip">Title</dt>
                                            <dd className="ml0 black truncate w-100">SNSD</dd>
                                            <dt className="clip">Artist</dt>
                                            <dd className="ml0 gray truncate w-100">Yuri Kwon</dd>
                                        </dl>
                                    </a>
                                </div>
                                <div className="fl w-50 w-25-m w-20-l pa2">
                                    <a href="https://www.instagram.com/sooyoungchoi/"
                                       className="db link dim tc">
                                        <img
                                            src="https://www.allkpop.com/upload/2018/01/af_org/03055852/Girls-Generation-Sooyoung.jpg"
                                            alt="Sooyoung Allkpop" className="w-100 db outline black-10"/>
                                        <dl className="mt2 f6 lh-copy">
                                            <dt className="clip">Title</dt>
                                            <dd className="ml0 black truncate w-100">SNSD</dd>
                                            <dt className="clip">Artist</dt>
                                            <dd className="ml0 gray truncate w-100">Sooyoung Choi</dd>
                                        </dl>
                                    </a>
                                </div>
                                <div className="fl w-50 w-25-m w-20-l pa2">
                                    <a href="https://www.instagram.com/watasiwahyo/"
                                       className="db link dim tc">
                                        <img
                                            src="https://www.allkpop.com/upload/2018/03/af_org/29102610/Girls-Generation-Hyoyeon.jpg"
                                            alt="Hyoyeon Allkpop" className="w-100 db outline black-10"/>
                                        <dl className="mt2 f6 lh-copy">
                                            <dt className="clip">Title</dt>
                                            <dd className="ml0 black truncate w-100">SNSD</dd>
                                            <dt className="clip">Artist</dt>
                                            <dd className="ml0 gray truncate w-100">Hyoyeon</dd>
                                        </dl>
                                    </a>
                                </div>
                                <div className="fl w-50 w-25-m w-20-l pa2 artist">
                                    <a href="https://en.wikipedia.org/wiki/Sunye"
                                       className="db link dim tc">
                                        <img
                                            src="https://0.soompi.io/wp-content/uploads/2013/05/Screen-Shot-2013-05-10-at-12.19.19-AM.png"
                                            alt="Sunye soompi" className="w-100 db outline black-10"/>
                                        <dl className="mt2 f6 lh-copy">
                                            <dt className="clip">Title</dt>
                                            <dd className="ml0 black truncate w-100">Wonder Girls</dd>
                                            <dt className="clip">Artist</dt>
                                            <dd className="ml0 gray truncate w-100">Sunye</dd>
                                        </dl>
                                    </a>
                                </div>
                                <div className="fl w-50 w-25-m w-20-l pa2 artist">
                                    <a href="https://www.instagram.com/hi_yubin/"
                                       className="db link dim tc">
                                        <img
                                            src="https://0.soompi.io/wp-content/uploads/2016/09/06020735/Yubin.png"
                                            alt="Yu-bin soompi" className="w-100 db outline black-10"/>
                                        <dl className="mt2 f6 lh-copy">
                                            <dt className="clip">Title</dt>
                                            <dd className="ml0 black truncate w-100">Wonder Girls</dd>
                                            <dt className="clip">Artist</dt>
                                            <dd className="ml0 gray truncate w-100">Yu-bin</dd>
                                        </dl>
                                    </a>
                                </div>
                                <div className="fl w-50 w-25-m w-20-l pa2 artist">
                                    <a href="https://www.instagram.com/hatfelt/"
                                       className="db link dim tc">
                                        <img
                                            src="https://0.soompi.io/wp-content/uploads/2017/01/27203302/yeeun-gq.jpg"
                                            alt="Ye-eun soompi" className="w-100 db outline black-10"/>
                                        <dl className="mt2 f6 lh-copy">
                                            <dt className="clip">Title</dt>
                                            <dd className="ml0 black truncate w-100">Wonder Girls</dd>
                                            <dt className="clip">Artist</dt>
                                            <dd className="ml0 gray truncate w-100">Ye-eun</dd>
                                        </dl>
                                    </a>
                                </div>
                                <div className="fl w-50 w-25-m w-20-l pa2 artist">
                                    <a href="https://www.instagram.com/ssoheean/"
                                       className="db link dim tc">
                                        <img
                                            src="https://www.allkpop.com/upload/2018/09/af_org/09194631/Sohee.jpg"
                                            alt="Sohee allkpop" className="w-100 db outline black-10"/>
                                        <dl className="mt2 f6 lh-copy">
                                            <dt className="clip">Title</dt>
                                            <dd className="ml0 black truncate w-100">Wonder Girls</dd>
                                            <dt className="clip">Artist</dt>
                                            <dd className="ml0 gray truncate w-100">Sohee</dd>
                                        </dl>
                                    </a>
                                </div>
                                <div className="fl w-50 w-25-m w-20-l pa2 artist">
                                    <a href="https://www.instagram.com/miyayeah/"
                                       className="db link dim tc">
                                        <img
                                            src="https://www.allkpop.com/upload/2017/09/af_org/26152619/sunmi.jpg"
                                            alt="Sunmi allkpop" className="w-100 db outline black-10"/>
                                        <dl className="mt2 f6 lh-copy">
                                            <dt className="clip">Title</dt>
                                            <dd className="ml0 black truncate w-100">Wonder Girls</dd>
                                            <dt className="clip">Artist</dt>
                                            <dd className="ml0 gray truncate w-100">Sunmi</dd>
                                        </dl>
                                    </a>
                                </div>
                                <div className="fl w-50 w-25-m w-20-l pa2 artist">
                                    <a href="https://www.instagram.com/wg_lim/"
                                       className="db link dim tc">
                                        <img
                                            src="https://i.pinimg.com/originals/05/dc/73/05dc73960ff4c78d770d79dc931e90a3.jpg"
                                            alt="Hye-rim pinterest" className="w-100 db outline black-10"/>
                                        <dl className="mt2 f6 lh-copy">
                                            <dt className="clip">Title</dt>
                                            <dd className="ml0 black truncate w-100">Wonder Girls</dd>
                                            <dt className="clip">Artist</dt>
                                            <dd className="ml0 gray truncate w-100">Hye-rim</dd>
                                        </dl>
                                    </a>
                                </div>
                                <div className="fl w-50 w-25-m w-20-l pa2 artist">
                                    <a href="https://en.wikipedia.org/wiki/Son_Ji-hyun"
                                       className="db link dim tc">
                                        <img
                                            src="https://www.allkpop.com/upload/2017/12/af_org/11192918/Jihyun.jpg"
                                            alt="Jihyun allkpop" className="w-100 db outline black-10"/>
                                        <dl className="mt2 f6 lh-copy">
                                            <dt className="clip">Title</dt>
                                            <dd className="ml0 black truncate w-100">4Minute</dd>
                                            <dt className="clip">Artist</dt>
                                            <dd className="ml0 gray truncate w-100">Ji-hyun</dd>
                                        </dl>
                                    </a>
                                </div>
                                <div className="fl w-50 w-25-m w-20-l pa2 artist">
                                    <a href="https://www.instagram.com/hyunah_aa/"
                                       className="db link dim tc">
                                        <img
                                            src="https://www.allkpop.com/upload/2013/12/af_org/4minute-HyunA_1387346701_af_org.jpg"
                                            alt="Hyuna allkpop" className="w-100 db outline black-10"/>
                                        <dl className="mt2 f6 lh-copy">
                                            <dt className="clip">Title</dt>
                                            <dd className="ml0 black truncate w-100">4Minute</dd>
                                            <dt className="clip">Artist</dt>
                                            <dd className="ml0 gray truncate w-100">Hyuna</dd>
                                        </dl>
                                    </a>
                                </div>
                                <div className="fl w-50 w-25-m w-20-l pa2 artist">
                                    <a href="https://en.wikipedia.org/wiki/Heo_Ga-yoon"
                                       className="db link dim tc">
                                        <img
                                            src="https://www.allkpop.com/upload/2016/08/af_org/Gayoon_1470869857_af_org.jpg"
                                            alt="Gayoon allkpop" className="w-100 db outline black-10"/>
                                        <dl className="mt2 f6 lh-copy">
                                            <dt className="clip">Title</dt>
                                            <dd className="ml0 black truncate w-100">4Minute</dd>
                                            <dt className="clip">Artist</dt>
                                            <dd className="ml0 gray truncate w-100">Gayoon</dd>
                                        </dl>
                                    </a>
                                </div>
                                <div className="fl w-50 w-25-m w-20-l pa2 artist">
                                    <a href="https://en.wikipedia.org/wiki/Kwon_So-hyun"
                                       className="db link dim tc">
                                        <img
                                            src="https://www.allkpop.com/upload/2018/02/af_org/07192951/Sohyun.jpg"
                                            alt="So-hyun allkpop" className="w-100 db outline black-10"/>
                                        <dl className="mt2 f6 lh-copy">
                                            <dt className="clip">Title</dt>
                                            <dd className="ml0 black truncate w-100">4Minute</dd>
                                            <dt className="clip">Artist</dt>
                                            <dd className="ml0 gray truncate w-100">So-hyun</dd>
                                        </dl>
                                    </a>
                                </div>
                                <div className="fl w-50 w-25-m w-20-l pa2 artist">
                                    <a href="https://en.wikipedia.org/wiki/Jeon_Ji-yoon"
                                       className="db link dim tc">
                                        <img
                                            src="https://www.allkpop.com/upload/2017/03/af_org/4minute-Jiyoon_1490810846_af_org.jpg"
                                            alt="Ji-yoon allkpop" className="w-100 db outline black-10"/>
                                        <dl className="mt2 f6 lh-copy">
                                            <dt className="clip">Title</dt>
                                            <dd className="ml0 black truncate w-100">4Minute</dd>
                                            <dt className="clip">Artist</dt>
                                            <dd className="ml0 gray truncate w-100">Ji-yoon</dd>
                                        </dl>
                                    </a>
                                </div>
                                <div className="fl w-50 w-25-m w-20-l pa2 artist">
                                    <a href="https://www.instagram.com/gyuri_88/"
                                       className="db link dim tc">
                                        <img
                                            src="https://kprofiles.com/wp-content/uploads/2018/02/Gyuri.jpg"
                                            alt="Gyuri kprofiles" className="w-100 db outline black-10"/>
                                        <dl className="mt2 f6 lh-copy">
                                            <dt className="clip">Title</dt>
                                            <dd className="ml0 black truncate w-100">Kara</dd>
                                            <dt className="clip">Artist</dt>
                                            <dd className="ml0 gray truncate w-100">Gyuri</dd>
                                        </dl>
                                    </a>
                                </div>
                                <div className="fl w-50 w-25-m w-20-l pa2 artist">
                                    <a href="https://www.instagram.com/thesy88/"
                                       className="db link dim tc">
                                        <img
                                            src="https://kprofiles.com/wp-content/uploads/2018/02/Seungyeon.jpg"
                                            alt="Seungyeon kprofiles" className="w-100 db outline black-10"/>
                                        <dl className="mt2 f6 lh-copy">
                                            <dt className="clip">Title</dt>
                                            <dd className="ml0 black truncate w-100">Kara</dd>
                                            <dt className="clip">Artist</dt>
                                            <dd className="ml0 gray truncate w-100">Seungyeon</dd>
                                        </dl>
                                    </a>
                                </div>
                                <div className="fl w-50 w-25-m w-20-l pa2 artist">
                                    <a href="https://www.instagram.com/koohara__/"
                                       className="db link dim tc">
                                        <img
                                            src="https://kprofiles.com/wp-content/uploads/2018/02/Hara.jpg"
                                            alt="Hara kprofiles" className="w-100 db outline black-10"/>
                                        <dl className="mt2 f6 lh-copy">
                                            <dt className="clip">Title</dt>
                                            <dd className="ml0 black truncate w-100">Kara</dd>
                                            <dt className="clip">Artist</dt>
                                            <dd className="ml0 gray truncate w-100">Hara</dd>
                                        </dl>
                                    </a>
                                </div>
                                <div className="fl w-50 w-25-m w-20-l pa2 artist">
                                    <a href="https://www.instagram.com/young_g_hur/"
                                       className="db link dim tc">
                                        <img
                                            src="https://kprofiles.com/wp-content/uploads/2018/02/Youngji.jpg"
                                            alt="Youngji kprofiles" className="w-100 db outline black-10"/>
                                        <dl className="mt2 f6 lh-copy">
                                            <dt className="clip">Title</dt>
                                            <dd className="ml0 black truncate w-100">Kara</dd>
                                            <dt className="clip">Artist</dt>
                                            <dd className="ml0 gray truncate w-100">Youngji</dd>
                                        </dl>
                                    </a>
                                </div>
                                <div className="fl w-50 w-25-m w-20-l pa2 artist">
                                    <a href="https://en.wikipedia.org/wiki/Kara_(South_Korean_group)"
                                       className="db link dim tc">
                                        <img
                                            src="https://kprofiles.com/wp-content/uploads/2018/02/Sunghee.png"
                                            alt="Sunghee kprofiles" className="w-100 db outline black-10"/>
                                        <dl className="mt2 f6 lh-copy">
                                            <dt className="clip">Title</dt>
                                            <dd className="ml0 black truncate w-100">Kara</dd>
                                            <dt className="clip">Artist</dt>
                                            <dd className="ml0 gray truncate w-100">Sunghee</dd>
                                        </dl>
                                    </a>
                                </div>
                                <div className="fl w-50 w-25-m w-20-l pa2 artist">
                                    <a href="https://www.instagram.com/nicole__jung"
                                       className="db link dim tc">
                                        <img
                                            src="https://www.allkpop.com/upload/2018/06/af_org/18153318/KARA-Nicole.jpg"
                                            alt="Nicole allkpop" className="w-100 db outline black-10"/>
                                        <dl className="mt2 f6 lh-copy">
                                            <dt className="clip">Title</dt>
                                            <dd className="ml0 black truncate w-100">Kara</dd>
                                            <dt className="clip">Artist</dt>
                                            <dd className="ml0 gray truncate w-100">Nicole</dd>
                                        </dl>
                                    </a>
                                </div>
                                <div className="fl w-50 w-25-m w-20-l pa2 artist">
                                    <a href="https://www.instagram.com/kkangjji_/"
                                       className="db link dim tc">
                                        <img
                                            src="https://kprofiles.com/wp-content/uploads/2018/02/Jiyoung.jpg"
                                            alt="Jiyoung kprofiles" className="w-100 db outline black-10"/>
                                        <dl className="mt2 f6 lh-copy">
                                            <dt className="clip">Title</dt>
                                            <dd className="ml0 black truncate w-100">Kara</dd>
                                            <dt className="clip">Artist</dt>
                                            <dd className="ml0 gray truncate w-100">Jiyoung</dd>
                                        </dl>
                                    </a>
                                </div>
                                <div className="fl w-50 w-25-m w-20-l pa2">
                                    <a href="https://www.instagram.com/yura_936/"
                                       className="db link dim tc">
                                        <img
                                            src="https://www.allkpop.com/upload/2014/06/af_org/Girls-Day-Yura_1403624706_af_org.jpg"
                                            alt="Yura" className="w-100 db outline black-10"/>
                                        <dl className="mt2 f6 lh-copy">
                                            <dt className="clip">Title</dt>
                                            <dd className="ml0 black truncate w-100">Girl's Day</dd>
                                            <dt className="clip">Artist</dt>
                                            <dd className="ml0 gray truncate w-100">Yura</dd>
                                        </dl>
                                    </a>
                                </div>
                                <div className="fl w-50 w-25-m w-20-l pa2">
                                    <a href="https://www.instagram.com/bbang_93/"
                                       className="db link dim tc">
                                        <img
                                            src="https://www.allkpop.com/upload/2017/11/af_org/08043727/Girls-Day-Minah.jpg"
                                            alt="Minah" className="w-100 db outline black-10"/>
                                        <dl className="mt2 f6 lh-copy">
                                            <dt className="clip">Title</dt>
                                            <dd className="ml0 black truncate w-100">Girl's Day</dd>
                                            <dt className="clip">Artist</dt>
                                            <dd className="ml0 gray truncate w-100">Minah</dd>
                                        </dl>
                                    </a>
                                </div>
                                <div className="fl w-50 w-25-m w-20-l pa2">
                                    <a href="https://www.instagram.com/hyeri_0609/"
                                       className="db link dim tc">
                                        <img
                                            src="https://www.allkpop.com/upload/2016/02/af_org/Hyeri_1454572185_af_org.jpeg"
                                            alt="Hyeri" className="w-100 db outline black-10"/>
                                        <dl className="mt2 f6 lh-copy">
                                            <dt className="clip">Title</dt>
                                            <dd className="ml0 black truncate w-100">Girl's Day</dd>
                                            <dt className="clip">Artist</dt>
                                            <dd className="ml0 gray truncate w-100">Hyeri</dd>
                                        </dl>
                                    </a>
                                </div>
                                <div className="fl w-50 w-25-m w-20-l pa2 artist">
                                    <a href="https://www.instagram.com/ssozi_sojin/"
                                       className="db link dim tc">
                                        <img
                                            src="https://www.allkpop.com/upload/2016/05/af_org/Girls-Day-Sojin_1463665756_af_org.jpg"
                                            alt="Sojin" className="w-100 db outline black-10"/>
                                        <dl className="mt2 f6 lh-copy">
                                            <dt className="clip">Title</dt>
                                            <dd className="ml0 black truncate w-100">Girl's Day</dd>
                                            <dt className="clip">Artist</dt>
                                            <dd className="ml0 gray truncate w-100">Sojin</dd>
                                        </dl>
                                    </a>
                                </div>
                                <div className="fl w-50 w-25-m w-20-l pa2 artist">
                                    <a href="https://www.instagram.com/chaelincl/"
                                       className="db link dim tc">
                                        <img
                                            src="https://1.soompi.io/wp-content/uploads/2014/02/2NE1-NEW-ALBUM-CRUSH-TEASER-PIC3.jpg"
                                            alt="CL" className="w-100 db outline black-10"/>
                                        <dl className="mt2 f6 lh-copy">
                                            <dt className="clip">Title</dt>
                                            <dd className="ml0 black truncate w-100">2NE1</dd>
                                            <dt className="clip">Artist</dt>
                                            <dd className="ml0 gray truncate w-100">CL</dd>
                                        </dl>
                                    </a>
                                </div>
                                <div className="fl w-50 w-25-m w-20-l pa2 artist">
                                    <a href="https://www.instagram.com/newharoobompark/"
                                       className="db link dim tc">
                                        <img
                                            src="https://1.soompi.io/wp-content/uploads/2014/02/2NE1_GOTTA_-BE_YOU_TEASER_4.jpg"
                                            alt="Bom" className="w-100 db outline black-10"/>
                                        <dl className="mt2 f6 lh-copy">
                                            <dt className="clip">Title</dt>
                                            <dd className="ml0 black truncate w-100">2NE1</dd>
                                            <dt className="clip">Artist</dt>
                                            <dd className="ml0 gray truncate w-100">Bom</dd>
                                        </dl>
                                    </a>
                                </div>
                                <div className="fl w-50 w-25-m w-20-l pa2 artist">
                                    <a href="https://www.instagram.com/daraxxi/"
                                       className="db link dim tc">
                                        <img
                                            src="https://1.soompi.io/wp-content/uploads/2014/02/2NE1-NEW-ALBUM-CRUSH-TEASER-PIC1.jpg"
                                            alt="Dara" className="w-100 db outline black-10"/>
                                        <dl className="mt2 f6 lh-copy">
                                            <dt className="clip">Title</dt>
                                            <dd className="ml0 black truncate w-100">2NE1</dd>
                                            <dt className="clip">Artist</dt>
                                            <dd className="ml0 gray truncate w-100">Dara</dd>
                                        </dl>
                                    </a>
                                </div>
                                <div className="fl w-50 w-25-m w-20-l pa2 artist">
                                    <a href="https://www.instagram.com/_minzy_mz/"
                                       className="db link dim tc">
                                        <img
                                            src="https://1.soompi.io/wp-content/uploads/2014/02/2NE1-NEW-ALBUM-CRUSH-TEASER-PIC2.jpg"
                                            alt="Minzy" className="w-100 db outline black-10"/>
                                        <dl className="mt2 f6 lh-copy">
                                            <dt className="clip">Title</dt>
                                            <dd className="ml0 black truncate w-100">2NE1</dd>
                                            <dt className="clip">Artist</dt>
                                            <dd className="ml0 gray truncate w-100">Minzy</dd>
                                        </dl>
                                    </a>
                                </div>
                                <div className="fl w-50 w-25-m w-20-l pa2">
                                    <a href="https://www.instagram.com/sooyaaa__/"
                                       className="db link dim tc">
                                        <img
                                            src="https://koreaboo-cdn.storage.googleapis.com/2017/07/jisoo1.jpg"
                                            alt="Jisoo Koreaboo" className="w-100 db outline black-10"/>
                                        <dl className="mt2 f6 lh-copy">
                                            <dt className="clip">Title</dt>
                                            <dd className="ml0 black truncate w-100">Blackpink</dd>
                                            <dt className="clip">Artist</dt>
                                            <dd className="ml0 gray truncate w-100">Jisoo</dd>
                                        </dl>
                                    </a>
                                </div>
                                <div className="fl w-50 w-25-m w-20-l pa2">
                                    <a href="https://www.instagram.com/lalalalisa_m/"
                                       className="db link dim tc">
                                        <img
                                            src="https://uploads.disquscdn.com/images/3628188abfd0a0f461ecb06f105476841350cfca96484772f127cc2e379c1261.jpg"
                                            alt="Lisa" className="w-100 db outline black-10"/>
                                        <dl className="mt2 f6 lh-copy">
                                            <dt className="clip">Title</dt>
                                            <dd className="ml0 black truncate w-100">Blackpink</dd>
                                            <dt className="clip">Artist</dt>
                                            <dd className="ml0 gray truncate w-100">Lisa</dd>
                                        </dl>
                                    </a>
                                </div>
                                <div className="fl w-50 w-25-m w-20-l pa2">
                                    <a href="https://www.instagram.com/roses_are_rosie"
                                       className="db link dim tc">
                                        <img
                                            src="https://uploads.disquscdn.com/images/71211b1693e144d78a1984485ae01d511183bbed38385cff2e3c45f62d7b4fca.png"
                                            alt="ROSÉ" className="w-100 db outline black-10"/>
                                        <dl className="mt2 f6 lh-copy">
                                            <dt className="clip">Title</dt>
                                            <dd className="ml0 black truncate w-100">Blackpink</dd>
                                            <dt className="clip">Artist</dt>
                                            <dd className="ml0 gray truncate w-100">ROSÉ</dd>
                                        </dl>
                                    </a>
                                </div>
                                <div className="fl w-50 w-25-m w-20-l pa2">
                                    <a href="https://www.instagram.com/jennierubyjane"
                                       className="db link dim tc">
                                        <img
                                            src="https://www.allkpop.com/upload/2018/08/af_org/18093512/black-pink-jennie.jpg"
                                            alt="Jennie" className="w-100 db outline black-10"/>
                                        <dl className="mt2 f6 lh-copy">
                                            <dt className="clip">Title</dt>
                                            <dd className="ml0 black truncate w-100">Blackpink</dd>
                                            <dt className="clip">Artist</dt>
                                            <dd className="ml0 gray truncate w-100">Jennie</dd>
                                        </dl>
                                    </a>
                                </div>
                                <div className="fl w-50 w-25-m w-20-l pa2 artist">
                                    <a href="https://www.instagram.com/xhyolynx/"
                                       className="db link dim tc">
                                        <img
                                            src="https://0.soompi.io/wp-content/uploads/2016/06/08211828/Hyorin-1.png"
                                            alt="Hyorin" className="w-100 db outline black-10"/>
                                        <dl className="mt2 f6 lh-copy">
                                            <dt className="clip">Title</dt>
                                            <dd className="ml0 black truncate w-100">Sistar</dd>
                                            <dt className="clip">Artist</dt>
                                            <dd className="ml0 gray truncate w-100">Hyorin</dd>
                                        </dl>
                                    </a>
                                </div>
                                <div className="fl w-50 w-25-m w-20-l pa2 artist">
                                    <a href="https://www.instagram.com/borabora_sugar"
                                       className="db link dim tc">
                                        <img
                                            src="https://0.soompi.io/wp-content/uploads/2016/06/08212208/Bora-1.png"
                                            alt="Bora" className="w-100 db outline black-10"/>
                                        <dl className="mt2 f6 lh-copy">
                                            <dt className="clip">Title</dt>
                                            <dd className="ml0 black truncate w-100">Sistar</dd>
                                            <dt className="clip">Artist</dt>
                                            <dd className="ml0 gray truncate w-100">Bora</dd>
                                        </dl>
                                    </a>
                                </div>
                                <div className="fl w-50 w-25-m w-20-l pa2 artist">
                                    <a href="https://www.instagram.com/official_soyou/"
                                       className="db link dim tc">
                                        <img
                                            src="https://0.soompi.io/wp-content/uploads/2016/06/09042522/Soyou-1.png"
                                            alt="Soyu" className="w-100 db outline black-10"/>
                                        <dl className="mt2 f6 lh-copy">
                                            <dt className="clip">Title</dt>
                                            <dd className="ml0 black truncate w-100">Sistar</dd>
                                            <dt className="clip">Artist</dt>
                                            <dd className="ml0 gray truncate w-100">Soyu</dd>
                                        </dl>
                                    </a>
                                </div>
                                <div className="fl w-50 w-25-m w-20-l pa2 artist">
                                    <a href="https://www.instagram.com/som0506/"
                                       className="db link dim tc">
                                        <img
                                            src="https://www.allkpop.com/upload/2016/01/af_org/Dasom_1453752108_af_org.jpg"
                                            alt="Dasom" className="w-100 db outline black-10"/>
                                        <dl className="mt2 f6 lh-copy">
                                            <dt className="clip">Title</dt>
                                            <dd className="ml0 black truncate w-100">Sistar</dd>
                                            <dt className="clip">Artist</dt>
                                            <dd className="ml0 gray truncate w-100">Dasom</dd>
                                        </dl>
                                    </a>
                                </div>
                                <div className="fl w-50 w-25-m w-20-l pa2 artist">
                                    <a href="https://www.instagram.com/kimjeii/"
                                       className="db link dim tc">
                                        <img
                                            src="https://www.allkpop.com/upload/2017/06/content/Jei_1496690193_0000569880_005_20170605111332930.jpg"
                                            alt="Jei" className="w-100 db outline black-10"/>
                                        <dl className="mt2 f6 lh-copy">
                                            <dt className="clip">Title</dt>
                                            <dd className="ml0 black truncate w-100">Fiestar</dd>
                                            <dt className="clip">Artist</dt>
                                            <dd className="ml0 gray truncate w-100">Jei</dd>
                                        </dl>
                                    </a>
                                </div>
                                <div className="fl w-50 w-25-m w-20-l pa2 artist">
                                    <a href="https://en.wikipedia.org/wiki/Cao_Lu"
                                       className="db link dim tc">
                                        <img
                                            src="https://www.allkpop.com/upload/2016/03/af_org/Cao-Lu_1457543396_af_org.jpg"
                                            alt="Cao Lu" className="w-100 db outline black-10"/>
                                        <dl className="mt2 f6 lh-copy">
                                            <dt className="clip">Title</dt>
                                            <dd className="ml0 black truncate w-100">Fiestar</dd>
                                            <dt className="clip">Artist</dt>
                                            <dd className="ml0 gray truncate w-100">Cao Lu</dd>
                                        </dl>
                                    </a>
                                </div>
                                <div className="fl w-50 w-25-m w-20-l pa2 artist">
                                    <a href="https://www.instagram.com/linzy_minji/"
                                       className="db link dim tc">
                                        <img
                                            src="https://www.allkpop.com/upload/2016/03/content/Linzy_1457587592_CdKRlBKUAAAd2pY.jpg"
                                            alt="Linzy" className="w-100 db outline black-10"/>
                                        <dl className="mt2 f6 lh-copy">
                                            <dt className="clip">Title</dt>
                                            <dd className="ml0 black truncate w-100">Fiestar</dd>
                                            <dt className="clip">Artist</dt>
                                            <dd className="ml0 gray truncate w-100">Linzy</dd>
                                        </dl>
                                    </a>
                                </div>
                                <div className="fl w-50 w-25-m w-20-l pa2 artist">
                                    <a href="https://en.wikipedia.org/wiki/Fiestar"
                                       className="db link dim tc">
                                        <img
                                            src="https://www.allkpop.com/upload/2016/05/af_org/FIESTAR-Hyemi-Hyemi_1464102621_af_org.jpg"
                                            alt="Hyemi" className="w-100 db outline black-10"/>
                                        <dl className="mt2 f6 lh-copy">
                                            <dt className="clip">Title</dt>
                                            <dd className="ml0 black truncate w-100">Fiestar</dd>
                                            <dt className="clip">Artist</dt>
                                            <dd className="ml0 gray truncate w-100">Hyemi</dd>
                                        </dl>
                                    </a>
                                </div>
                                <div className="fl w-50 w-25-m w-20-l pa2 artist">
                                    <a href="https://en.wikipedia.org/wiki/Yezi"
                                       className="db link dim tc">
                                        <img
                                            src="https://www.allkpop.com/upload/2016/08/af_org/FIESTAR-Yezi_1472656035_af_org.jpg"
                                            alt="Yezi" className="w-100 db outline black-10"/>
                                        <dl className="mt2 f6 lh-copy">
                                            <dt className="clip">Title</dt>
                                            <dd className="ml0 black truncate w-100">Fiestar</dd>
                                            <dt className="clip">Artist</dt>
                                            <dd className="ml0 gray truncate w-100">Yezi</dd>
                                        </dl>
                                    </a>
                                </div>
                            </div>
                        </article>

                        <footer className="pv4 ph3 ph5-m ph6-l mid-gray">
                            <small className="f6 db tc">© 2019 <b className="ttu">coocloud</b>., All Rights Reserved.
                                Contents shamelessly stolen from the following sites:
                            </small>
                            <div className="tc mt3">
                                <a href="https://www.google.com/search?source=hp&ei=4ODNXNPjF4vKwAKri74g&q=thanos&oq=&gs_l=psy-ab.1.0.35i39l6.0.0..4443...2.0..0.246.246.2-1......0......gws-wiz.....6.7HPzxswbqSg"
                                   title="Language" className="f6 dib ph2 link mid-gray dim">Google</a>
                                <a href="https://allkpop.com/" title="Privacy"
                                   className="f6 dib ph2 link mid-gray dim">Allkpop</a>
                                <a href="https://soompi.com/" title="Privacy"
                                   className="f6 dib ph2 link mid-gray dim">Soompi</a>
                                <a href="https://kprofiles.com/" title="Privacy"
                                   className="f6 dib ph2 link mid-gray dim">Kprofiles</a>
                                <a href="https://jsfiddle.net/or20wx3h/" title="Terms"
                                   className="f6 dib ph2 link mid-gray dim">JSFiddle</a>
                            </div>
                        </footer>
                    </Tachyons>
                </div>
            </React.Fragment>

        )
    }

}

export default KpopEndgame;
