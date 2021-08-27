
const twitch = window.Twitch;

function parseConfigStr(config, fallbackValues) {
    if (!config) {
        return fallbackValues
    }

    let configStr = config.content
    let valueCount = (configStr.match(/\|/g) || []).length + 1

    if (fallbackValues.length === valueCount) {
        return configStr.split('|')
    } else {
        return fallbackValues
    }
}

function hookOnGlobalConfigChanged(callback = null) {
    twitch.ext.configuration.onChanged(() => {
        let globalConfig = twitch.ext.configuration.global
        if (globalConfig) {
            console.log("WTF");
            callback()
        } else console.log("STUPID ZWICH")
    })
}


function hookOnAuthorized(callback = null) {
    twitch.ext.onAuthorized((userDetails) => {
        if (callback) {
            callback(userDetails)
        }
    })
}


function hookOnContextChanged(callback = null) {
    twitch.ext.onContext((context, changedKeys) => {
        if (callback) {
            callback(context, changedKeys)
        }
    })
}