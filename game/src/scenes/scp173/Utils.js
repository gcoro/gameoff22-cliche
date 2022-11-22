const Utils = Object.freeze({
    generateRandomCoords(minX, maxX, minY, maxY) {
        return {
            x: Math.floor(Math.random() * (maxX - minX - 1) + minX),
            y: Math.floor(Math.random() * (maxY - minY - 1) + minY),
        };
    },

    /**
     * check if 2 objects are overlapping
     * @param {*} obj1
     * @param {*} obj2
     * @returns
     */
    areObjectsOverlapping(obj1, obj2, range = 16) {
        return (
            Math.abs(obj1.x - obj2.x) <= range &&
            Math.abs(obj1.y - obj2.y) <= range
        );
    },
});
