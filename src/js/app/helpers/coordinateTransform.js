
export function transformPosition(x,y,z, scale) {
    return {posX:scale * x, posY:-1*scale * y, posZ:-1*scale*z};
}
export function transformScale(scale) {
    return {scaleX:scale, scaleY:scale, scaleZ:scale};
}

export function transformRotation(x,y,z) {
    return {rotX:x-Math.PI / 2, rotY:y, rotZ:z};
}
