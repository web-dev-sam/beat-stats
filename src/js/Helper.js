window.$ = require('jquery');

const twitch = window.Twitch;

$.fn.extend({
    chkd: function (value) {
        if (value !== undefined)
            return this.prop('checked', value);
        return this.is(':checked');
    }
});

// #region Stupid Twitch API

function hookOnGlobalConfigChanged(callback = null) {
    twitch.ext.configuration.onChanged(() => {
        callback();
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
// #endregion

module.exports = {
    $,
    twitch,
    hookOnGlobalConfigChanged,
    hookOnAuthorized,
    hookOnContextChanged
}