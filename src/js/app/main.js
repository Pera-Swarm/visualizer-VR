// Global imports -
import * as THREE from 'three';
import * as THREEAR from 'threear';

import TWEEN, { update } from '@tweenjs/tween.js';

// Components
import Renderer from './components/renderer';
import Label from './components/label';
import Camera from './components/camera';
import Light from './components/light';
import Controls from './components/controls';
import Geometry from './components/geometry';
import Environment from './components/environment';

// Config data
import Config from './../data/config';

// Helpers
import Stats from './helpers/stats';

// Managers
import DatGUI from './managers/datGUI';

// Newly implemented classes
import MQTTClient from './managers/mqttClient';

// Global Variables
let camera, labelRenderer, INTERSECTED, selectedLabel;

// For click event on robots
// const raycaster = new THREE.Raycaster();
// const mouse = new THREE.Vector2();

// This class instantiates and ties all of the components together, starts the loading process and renders the main loop
export default class Main {
    constructor(container) {
        this.container = container;

        if (window.devicePixelRatio) {
            Config.dpr = window.devicePixelRatio;
        }

        // Set up gui
        if (Config.isDev) {
            // this.gui = new DatGUI(this)
        }

        // Main scene creation, and set global scale
        window.scene = new THREE.Scene();
        window.scene_scale = Config.scale;

        // High level reality flag
        window.selectedReality = Config.selectedReality;

        // Renderer object
        window.renderer = new Renderer(scene, container).threeRenderer;

        // init scene and camera
        camera = new THREE.Camera();
        // camera = new Camera(renderer); // Perspective camera giving an error
        scene.add(camera);

        // Create and place lights in scene
        this.light = new Light(scene);
        this.camera = camera;

        const lights = ['ambient', 'directional', 'point', 'hemi'];
        lights.forEach((light) => this.light.place(light));

        var markerGroup = new THREE.Group();
        scene.add(markerGroup);
        window.markerGroup = markerGroup;

        var source = new THREEAR.Source({ renderer, camera });

        this.mqtt = new MQTTClient(scene, markerGroup);

        // Set up Stats if dev environment
        if (Config.isDev && Config.isShowingStats) {
            this.stats = new Stats();
            // this.container.appendChild(this.stats.dom);
        }

        if (Config.isShowingLables) {
            this.labelRenderer = Label();
            window.labelRenderer = this.labelRenderer; // add to global scope
            this.container.appendChild(this.labelRenderer.domElement);
        }

        // Set up gui
        if (Config.isDev) {
            this.gui = new DatGUI(this);
        }

        THREEAR.initialize({ source: source }).then((controller) => {
            //  -------------------------------------------------------
            // Create the environment
            this.environment = new Environment();

            // -------------------------------------------------------
            if (Config.isDev) {
                this.gui.load(this);
                // this.gui.show();
            }

            var patternMarker = new THREEAR.PatternMarker({
                // patternUrl: './assets/data/hiro.patt',
                patternUrl: './assets/data/pattern-kanji.patt',
                markerObject: markerGroup
            });

            controller.trackMarker(patternMarker);

            // run the rendering loop
            var lastTimeMsec = 0;

            requestAnimationFrame(function animate(nowMsec) {
                // keep looping
                requestAnimationFrame(animate);
                // measure time
                lastTimeMsec = lastTimeMsec || nowMsec - 1000 / 60;
                var deltaMsec = Math.min(200, nowMsec - lastTimeMsec);
                lastTimeMsec = nowMsec;

                // call each update function
                controller.update(source.domElement);

                // Call render function and pass in created scene and camera
                renderer.render(scene, camera);

                // render labels if enabled
                if (Config.isShowingLables) {
                    window.labelRenderer.domElement.hidden = false;
                } else {
                    window.labelRenderer.domElement.hidden = true;
                }

                // window.labelRenderer.render(scene, camera.threeCamera);

                if (Config.isDev && Config.isShowingStats) {
                    // this.stats.update();
                }

                // Delta time is sometimes needed for certain updates
                //const delta = this.clock.getDelta();

                // Call any vendor or module frame updates here
                TWEEN.update();
                //this.controls.threeControls.update();
            });
        });

        this.container.querySelector('#loading').style.display = 'none';

        // Eventlistner for catching mouse click events
        window.addEventListener('click', this.onDocumentMouseDown, false);
    }

    onDocumentMouseDown(event) {
        event.preventDefault();

        // // Not supported in AR so far
        // mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        // mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        //
        // raycaster.setFromCamera(mouse, camera);
        //
        // const intersects = raycaster.intersectObjects(scene.children);
        //
        // if (intersects.length > 0) {
        //     const object = intersects[0].object;
        //     if (INTERSECTED) INTERSECTED.material.setValues({ opacity: INTERSECTED.currentOpacity });
        //     INTERSECTED = object;
        //     selectedLabel = INTERSECTED.children[0];
        //     INTERSECTED.currentOpacity = INTERSECTED.material.opacity;
        //     INTERSECTED.labelsVisibility = INTERSECTED.material.labelVisibility;
        //     if (selectedLabel !== undefined && selectedLabel.visible !== undefined && Config.isShowingLables) {
        //         selectedLabel.visible = !selectedLabel.visible;
        //     }
        //     INTERSECTED.material.selected = !INTERSECTED.material.selected;
        //     // Obstacle selection event handling
        //     if (INTERSECTED.name.startsWith('Obstacle')) {
        //         if (INTERSECTED.material.selected) {
        //             INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
        //             INTERSECTED.material.emissive.setHex(0xf95f4a);
        //         } else {
        //             INTERSECTED.currentHex = INTERSECTED.material.userData.originalEmmisive;
        //             INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
        //         }
        //         // Robot selection event handling
        //     } else if (INTERSECTED.name.startsWith('Robot')) {
        //         if (INTERSECTED.material.selected) {
        //             INTERSECTED.material.setValues({ opacity: 0.5 });
        //         } else {
        //             INTERSECTED.material.setValues({ opacity: 1 });
        //         }
        //         if (INTERSECTED.clickEvent !== undefined) {
        //             INTERSECTED.clickEvent(INTERSECTED);
        //         }
        //     }
        // } else {
        //     if (INTERSECTED) INTERSECTED.material.setValues({ opacity: INTERSECTED.currentOpacity });
        //     INTERSECTED = null;
        // }
    }

    onDocumentMouseMove(event) {
        event.preventDefault();

        // // Not supported in AR so far
        // mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        // mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        //
        // raycaster.setFromCamera(mouse, camera.threeCamera);
        //
        // const intersects = raycaster.intersectObjects(scene.children, true);
        // if (intersects.length > 0) {
        //     const object = intersects[0].object;
        //     if (INTERSECTED !== object) {
        //         if (INTERSECTED) INTERSECTED.material.setValues({ opacity: INTERSECTED.currentOpacity });
        //         INTERSECTED = object;
        //         selectedLabel = INTERSECTED.children[0];
        //         INTERSECTED.currentOpacity = INTERSECTED.material.opacity;
        //         INTERSECTED.currentColor = INTERSECTED.material.opacity;
        //         INTERSECTED.material.setValues({ color: 0x03dffc, opacity: 0.75 });
        //     }
        // } else {
        //     if (INTERSECTED)
        //     INTERSECTED.material.setValues({ opacity: 1.0, color: INTERSECTED.material.userData.originalColor });
        //     INTERSECTED = null;
        // }
    }
}
