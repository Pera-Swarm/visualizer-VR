import Config from '../../data/config';

export function transformPosition(x,y,z, scale) {
    const tx = 0.01*Config.offsets.x + scale*(x);
    const ty = 0.01*Config.offsets.y + scale*(-y + Math.abs(Config.arena.minY) );  // actual Y axis
    const tz = 0.01*Config.offsets.z + scale*(-z); // actual Z axis

    return {posX: tx, posY:ty, posZ:tz};
}
export function transformScale(scale) {
    return {scaleX:scale, scaleY:scale, scaleZ:scale};
}

export function transformRotation(x,y,z) {
    return {rotX:x-Math.PI / 2, rotY:y, rotZ:z};
}
