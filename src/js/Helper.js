window.$ = require('jquery');

const twitch = window.Twitch;

$.fn.extend({
    chkd: function (value) {
        if (value !== undefined)
            return this.prop('checked', value);
        return this.is(':checked');
    }
});


/**
 * Beautifies a big number
 *   entry:  24227470163
 *   output: 24 227 470 163
 */
function beautifyBigNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}


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
    beautifyBigNumber,
    hookOnGlobalConfigChanged,
    hookOnAuthorized,
    hookOnContextChanged,
}