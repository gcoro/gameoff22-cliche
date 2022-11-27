const StorageService = Object.freeze({
    saveScore(key, value, reset = false) {
        if (reset) {
            localStorage.setItem(key, value)
        } else {
            let precValue = localStorage.getItem(key) ?? 0
            localStorage.setItem(key, precValue + value)
        }
    },
})
