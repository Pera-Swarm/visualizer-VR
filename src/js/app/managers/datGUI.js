import Config, { saveConfig } from '../../data/config';
import { transformPosition, transformScale, transformRotation } from '../helpers/coordinateTransform';

// COMMENT(NuwanJ)
// Store the last state of the toggles in the window.localStorage
// Refer: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
// Refer: https://github.com/dataarts/dat.gui/blob/master/API.md#GUI+useLocalStorage

// Manages all dat.GUI interactions
export default class DatGUI {
    constructor(main) {
        this.gui = new dat.GUI();

        this.gui.useLocalStorage = true;

        // this.camera = main.camera.threeCamera;
        // this.controls = main.controls.threeControls;
        // this.light = main.light;
    }

    load(main, mesh) {
        const offsetRange = parseInt(Config.offsets.scaleRange);

        // ---------------------------------------------------------------------
        // Robot Snapshots
        // this.gui
        // .add(Config, 'isShowingRobotSnapshots')
        // .name('Robot Snapshots')
        // .onChange((value) => {
        //     Config.isShowingRobotSnapshots = value;
        //     saveConfig(Config);
        // });

        // ---------------------------------------------------------------------
        // labelsFolder

        // const labelsFolder = this.gui.addFolder('Labels');
        // labelsFolder
        // .add(Config, 'isShowingLables')
        // .name('All Labels')
        // .onChange((value) => {
        //     Config.isShowingLables = value;
        //     Config.labelsVisibility = {
        //         obstacles: value,
        //         robots: value
        //     };
        //     saveConfig(Config);
        // });
        // .add(Config.labelsVisibility, 'obstacles')
        // .name('Obstacle Labels')
        // .onChange((value) => {
        //     // this.toggleLabels(this.scene.children, 'Obstacle', value);
        //     // alert('Obstacle Label');
        //     this.toggleLabels(window.markerGroup.children, 'Obstacle', value);
        // });
        // labelsFolder
        // .add(Config.labelsVisibility, 'robots')
        // .name('Robot Labels')
        // .onChange((value) => {
        //     // this.toggleLabels(this.scene.children, 'Robot', value);
        //     // alert('Robot Label');
        //     this.toggleLabels(window.markerGroup.children, 'Robot', value);
        // });

        // ---------------------------------------------------------------------
        /* Reality Folder */
        const realityFolder = this.gui.addFolder('Reality');

        realityFolder
            .add(Config.selectedRealities, 'real')
            .name('Physical Reality')
            .listen()
            .onChange((value) => {
                this.toggleReality('real', 'R');
                saveConfig(Config);
            });
        realityFolder
            .add(Config.selectedRealities, 'virtual')
            .name('Virtual Reality')
            .listen()
            .onChange((value) => {
                this.toggleReality('virtual', 'V');
                saveConfig(Config);
            });

        // ---------------------------------------------------------------------
        const placeFolder = this.gui.addFolder('Placement');

        // Toggle visibility of Zero marker (yellow)
        placeFolder
            .add(Config.offsets, 'showZeroMarker')
            .name('Zero Marker')
            .listen()
            .onChange((value) => {
                saveConfig(Config);
                window.zeroMarker.visible = value;
            });

        // Toggle visibility of Coord marker (red)
        placeFolder
            .add(Config.offsets, 'showCoordMarker')
            .name('Coordinate Marker')
            .listen()
            .onChange((value) => {
                saveConfig(Config);
                window.coordMarker.visible = value;
            });
        // ---------------------------------------------------------------------
        // X Offset
        placeFolder
            .add(Config.offsets, 'x')
            .min(-1 * parseInt(360))
            .max(parseInt(360))
            .name('X Offset')
            .listen()
            .onChange((value) => {
                Config.offsets.x = value;
                this.updateCoord();
                saveConfig(Config);
            });
        // Y Offset
        placeFolder
            .add(Config.offsets, 'y')
            .min(-1 * parseInt(360))
            .max(parseInt(360))
            .name('Y Offset')
            .listen()
            .onChange((value) => {
                Config.offsets.y = value;
                this.updateCoord();
                saveConfig(Config);
            });
        // Z Offset
        placeFolder
            .add(Config.offsets, 'z')
            .min(-1 * parseInt(500))
            .max(parseInt(500))
            .name('Z Offset')
            .listen()
            .onChange((value) => {
                Config.offsets.z = value;
                this.updateCoord();
                saveConfig(Config);
            });
        // Scale Offset
        placeFolder
            .add(Config, 'scale', 0, 0.1)
            .name('Scale')
            .listen()
            .onChange((value) => {
                Config.offsets.scale = value;
                window.coordMarker.scale.set(value, value, value);
                saveConfig(Config);
            });

        /* Global */
        this.gui.open();
        // this.gui.close();

        // this.model = main.model;
        // this.meshHelper = main.meshHelper;
    }

    toggleLabels(objects, type, value) {
        saveConfig(Config);
        if (Array.isArray(objects) && type !== undefined && type !== '') {
            for (var variable of objects) {
                if (variable.name.startsWith(type)) {
                    variable.children[0].visible = value;
                }
            }
        }
    }

    toggleReality(reality, selected) {
        // by default visualizer will intercept all the communication coming to the channel regardless of the reality.
        // this control panel will only toggle the 'visibility' of objects in the selected realities.
        const objects = window.markerGroup.children;

        saveConfig(Config);
        Object.entries(objects).forEach((obj) => {
            const name = obj[1]['name'];
            const reality = obj[1]['reality'];

            if (reality !== undefined && reality === 'R') {
                // obj[1].transparent = Config.selectedRealities.real;
                obj[1].material.opacity = Config.selectedRealities.real ? 1.0 : Config.hiddenOpacity;
            } else if (reality !== undefined && reality === 'V') {
                // obj[1].transparent = Config.selectedRealities.virtual;
                obj[1].material.opacity = Config.selectedRealities.virtual ? 1.0 : Config.hiddenOpacity;
            }
        });
    }

    updateCoord() {
        const pos = window.coordMarker.position;
        const { posX, posY, posZ } = transformPosition(pos.x, pos.y, pos.z, scene_scale);
        window.coordMarker.position.set(posX, posY, posZ);
    }

    show() {
        // this.gui.show();
    }

    unload() {
        this.gui.destroy();
        this.gui = new dat.GUI();
    }
}
