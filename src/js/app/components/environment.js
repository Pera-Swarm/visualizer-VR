import * as THREE from 'three';

import Config from '../../data/config';
import {transformPosition, transformScale, transformRotation} from '../helpers/coordinateTransform';

export default class Environment {
    constructor() {
        console.log(`Environment: Scale: ${scene_scale}, arenaSize:${Config.arena.size}`);

        var geometry = new THREE.PlaneBufferGeometry(Config.arena.size, Config.arena.size);
        // var material = new THREE.MeshPhongMaterial({
        var material = new THREE.MeshStandardMaterial({
            color: 0x999999,
            depthWrite: false
        });

        const {posX, posY, posZ } = transformPosition(0,0,0, scene_scale);
        const {rotX, rotY, rotZ } = transformRotation(0,0,0);
        const {scaleX, scaleY, scaleZ } = transformScale(scene_scale);

        // Ground
        var ground = new THREE.Mesh(geometry, material);
        ground.rotation.set(rotX-Math.PI / 2, rotY, rotZ);
        ground.position.set(posX, posY, posZ);
        ground.scale.set(scaleX, scaleY, scaleZ);
        ground.material.opacity = 0.35;
        ground.receiveShadow = true;
        markerGroup.add(ground);

        // Grid
        var grid = new THREE.GridHelper(Config.arena.size, 18, 0x000000, 0x5b5b5b);
        grid.rotation.set(rotX, rotY, rotZ);
        grid.position.set(posX, posY, posZ);
        grid.scale.set(scaleX, scaleY, scaleZ);
        grid.material.opacity = 0.35;
        grid.material.transparent = true;
        markerGroup.add(grid);

        // Zero marker
        const zeroGeometry = new THREE.SphereGeometry(scene_scale*5, 16, 16);
        const zeroMarker = new THREE.Mesh( zeroGeometry, new THREE.MeshBasicMaterial( {color: 0xffff00} ) );
        zeroMarker.visible = Config.offsets.showZeroMarker;
        markerGroup.add(zeroMarker);
        window.zeroMarker = zeroMarker

        const markerGeometry = new THREE.SphereGeometry(5, 16, 16);
        const coordMarker = new THREE.Mesh( markerGeometry,new THREE.MeshBasicMaterial({color: 0xff0000}));
        coordMarker.position.set(posX, posY, posZ);
        coordMarker.scale.set(scene_scale, scene_scale, scene_scale);

        coordMarker.name = "coordinateMarker";
        coordMarker.visible = Config.offsets.showCoordMarker;
        markerGroup.add(coordMarker);
        window.coordMarker = coordMarker
    }
}
