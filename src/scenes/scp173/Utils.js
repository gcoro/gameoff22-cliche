export const Utils = Object.freeze({
    generateRandomCoords(minX, maxX, minY, maxY) {
        return {
            x: Math.floor(Math.random() * (maxX - minX - 1) + minX),
            y: Math.floor(Math.random() * (maxY - minY - 1) + minY),
        }
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
        )
    },

    /**
     * check if obj1 overlap obj2 by coordinates and obj2 area
     * this is useful if you need to understand if the corsor is overlapping an object by its position and dimensions
     * @param {*} param0
     * @param {*} param1
     * @returns
     */
    areObjectOverlapArea({ x: obj1X, y: obj1Y }, { x, y, width, height }) {
        return (
            obj1X >= x &&
            obj1X <= x + width &&
            obj1Y >= y &&
            obj1Y <= y + height
        )
    },

    generateRandomEnemyObject(array) {
        return array[Math.floor(Math.random() * array.length)]
    },
})
