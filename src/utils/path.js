const regedit = require('regedit')
const path = require('path')
const Store = require('electron-store')
const store = new Store()

const initWowPath = async () => {
    if (!store.has('installationFolder')) {
        const installationFolder = await wowDefaultPath()
        store.set('installationFolder', installationFolder)
    }

    return store.get('installationFolder', null)
}

const wowDefaultPath = () => {
    return new Promise((resolve, reject) => {
        if (process.platform !== 'win32') {
            return resolve(null)
        }

        // Fallback to null if env !== prod
        if (process.env.NODE_ENV !== 'production') {
            return resolve(null)
        }

        regedit.setExternalVBSLocation('resources/node_modules/regedit/vbs')

        const key = 'HKLM\\SOFTWARE\\WOW6432Node\\Blizzard Entertainment\\World of Warcraft'

        regedit.list(key, (err, res) => {
            if (err) {
                return reject(err)
            }

            resolve(path.join(res[key].values.InstallPath.value, '..'))
        })
    })
}

export { initWowPath, wowDefaultPath }
