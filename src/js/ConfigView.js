/**
 * I was in a rush and accidentally signed up for a configuration service. I didn't notice until they 
 * started sending me daily text messages telling me the time and date of my death. At first, I thought
 * it was a prank but then I noticed that the date kept getting closer and closer. I'm not sure what to do next. 
 * I had a similar experience with my cable company. I wanted to switch from cable internet to DSL but they wouldn't
 * let me until I paid the final invoice. So I just kept paying it every month for years and years. They didn't 
 * send me any invoices so I had no idea what was going on. The end result is that I'm now paying $50/month for a
 * DSL line that isn't even hooked up to anything. I don't know if you can help with this, but if you can please
 * contact my cable company and tell them to cancel my account or whatever it takes to get rid of them. I'm not sure 
 * how much longer I can keep this up without going insane. I've been dealing with this company for years now and 
 * they're not giving up. I just want to pay my bill and be done with them but they won't let me. They keep sending 
 * me letters and calling me on the phone and it's driving me crazy. I just want to move on with my life, but they won't let me. 
 * I think I might have to go back to school just so I can get away from all this madness.
 * 
 * Thank you GitHub Copilot for helping me out writing this beautiful short story. I don't know if anyone is going to read this or if this 
 * is useful to anyone and not a waste of my time. I should probably stop writing this and continue and not procrastinate.
 */

const {
    $,
    hookOnGlobalConfigChanged,
    hookOnAuthorized,
    hookOnContextChanged
} = require('./Helper.js');
const ScoreSaber = require('./ScoreSaber.js');
const Configuration = require('./Configuration.js');
const demoDefaults = require('./DemoDefaults.js');

class ConfigView {

    saving = false;
    playerData = null;


    /**
     * Bind event listeners
     */
    bindEvents() {
        const me = this;

        // Save button
        $(".btn-save").on("click", () => me.save());
    }


    /**
     * Save everything to the configuration
     * @async
     */
    save() {
        const me = this;
        $(`label.error`).text("")
        return new Promise(async (resolve, reject) => {

            // Don't save again if we're already saving
            if (me.saving) {
                resolve();
                return;
            }

            // We are now saving
            me.saving = true;
            $(".btn-save").html(`Saving...`);

            // Check for valid input
            const valid = await me.checkForValidInput();
            if (!valid) {
                me.saving = false;
                $(".btn-save").html("Save");
                resolve();
                return;
            }

            if (me.hasUserChanged()) {
                //console.log("Scoresaber Id changed!");
                Configuration.setDefaults("broadcaster", me.formData.scoresaberId);
                me.showFormData(me.formData.scoresaberId);
                me.saving = false;
                $(".btn-save").html("Save");
                resolve();
                return;
            }

            // Save the config
            Configuration.set("broadcaster", me.formData);

            // We are no longer saving
            $(".btn-save").html("Saved");
            setTimeout(() => {
                me.saving = false;
                $(".btn-save").html("Save");
            }, 1500);
            resolve();
        });
    }


    /**
     * Has the user changed the scoresaber id?
     */
    hasUserChanged() {
        const data = Configuration.get("broadcaster");
        if (!data) 
            return true;

        const formData = this.getFormData();
        if (data.scoresaberId !== formData.scoresaberId) 
            return true;
            
        return false;
    }


    /**
     * Check if the form is valid
     * @async
     */
    async checkForValidInput() {

        // Get form data
        this.formData = this.getFormData();

        // Check scoresaber id
        const scoreSaberValid = await this.checkScoreSaberId(this.formData);
        if (scoreSaberValid.error) {
            $(`[bsconfig="scoresaberId"] + label.error`).text(scoreSaberValid.error);
            return false;
        }
        
        return true;
    }


    /**
     * Check if the scoreSaberId is valid
     * @param {object} data - The form data
     * @async
     */
    checkScoreSaberId(data) {
        const me = this;
        return new Promise((resolve, reject) => {
            const scoresaber = new ScoreSaber(data.scoresaberId);
            scoresaber
                .getPlayerData()
                .then(playerData => {
                    me.playerData = playerData;
                    resolve({});
                })
                .catch(error => resolve({ error }))
                .finally(_ => resolve({}));
        });
    }


    /**
     * Get all config data from the form
     */
    getFormData() {
        const data = {};
        $("[bsconfig]").each(function () {
            const key = $(this).attr("bsconfig");
            const func = $(this).attr("bsaction");
            const value = $(this)[func]();
            data[key] = value;

            if (key === "scoresaberId" && data[key]) {
                const match = data[key].match(/\d+/g);
                if (match[0])
                    data[key] = match[0]
            }
        });
        return data;
    }


    /**
     * Show all config data to the form
     */
    showFormData(scoreSaberId) {
        const data = scoreSaberId? demoDefaults[scoreSaberId] : Configuration.get("broadcaster");
        if (!data)
            return;

        $("[bsconfig]").each(function () {
            const key = $(this).attr("bsconfig");
            const func = $(this).attr("bsaction");
            $(this)[func](data[key]);
        });
        
        if (data.scoresaberId && !scoreSaberId) {
            $(".container__item").removeClass("hidden");
        }
    }


}



hookOnAuthorized()
hookOnContextChanged()
hookOnGlobalConfigChanged(_ => {
    const configView = new ConfigView();
    configView.showFormData();
    configView.bindEvents();

    // Uncomment this to empty the config (like for new users)
    //Configuration.empty();

    console.log()
})
