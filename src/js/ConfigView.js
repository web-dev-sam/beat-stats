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

class ConfigView {

    saving = false;
    playerData = null;


    /**
     * Bind event listeners
     */
    bindEvents() {
        const me = this;

        // Save button
        document.querySelectorAll(".btn-save").forEach(e => e.addEventListener("click", () => me.save()));
    }


    /**
     * Save everything to the configuration
     * @async
     */
    save() {
        const me = this;
        const btnSave = document.querySelectorAll(".btn-save");
        document.querySelector(`label.error`).innerText = "";
        return new Promise(async resolve => {

            // Don't save again if we're already saving
            if (me.saving) {
                resolve();
                return;
            }

            // We are now saving
            me.saving = true;
            btnSave.forEach(e => e.innerText = `Saving...`);

            // Check for valid input
            const valid = await me.checkForValidInput();
            if (!valid) {
                me.saving = false;
                btnSave.forEach(e => e.innerText = `Save`);
                resolve();
                return;
            }

            if (me.hasUserChanged()) {
                console.log("Scoresaber Id changed!");
                Configuration.setDefaults("broadcaster", me.formData.scoresaberId);
                me.showFormData(me.formData.scoresaberId);
                me.saving = false;
                btnSave.forEach(e => e.innerText = `Save`);
                resolve();
                return;
            }

            // Save the config
            Configuration.set("broadcaster", me.formData);

            // We are no longer saving
            btnSave.forEach(e => e.innerText = `Saved`);
            setTimeout(() => {
                me.saving = false;
                btnSave.forEach(e => e.innerText = `Save`);
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
            document.querySelector(`[bsconfig="scoresaberId"] + label.error`).innerText = scoreSaberValid.error;
            return false;
        }

        // Check accSaber id
        const checkedSettings = Array.from(document.querySelectorAll(`.statistics input:checked`));
        const checkedSettingsIds = checkedSettings.map(el => el.getAttribute("bsconfig"));
        const accSaberSettings = ["ap", "topApPlay", "avgAccSaberAcc"];
        if (checkedSettingsIds.length > 0 && accSaberSettings.some(setting => checkedSettingsIds.includes(setting))) {
            const accSaberValid = await this.checkAccSaberId(this.formData);
            if (accSaberValid.error) {
                document.querySelector(`[bsconfig="scoresaberId"] + label.error`).innerText = accSaberValid.error;
                return false;
            }
        }

        // Check if there are maximum of 8 data panels
        if (checkedSettings.length > 8) {
            document.querySelector(`.stats-label.error`).innerText = "You can only select up to 8 statistic panels!";
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
     * Check if the accSaberId is valid
     * @param {object} data - The form data
     * @async
     */
    checkAccSaberId(data) {
        const me = this;
        return new Promise((resolve, reject) => {
            const accsaber = new AccSaber(data.scoresaberId);
            accsaber
                .getPlayerData()
                .then(playerData => {
                    if (playerData.errorCode != null) {
                        resolve({ error: playerData.message });
                        return;
                    }
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
        document.querySelectorAll("[bsconfig]").forEach(function (elem) {
            const key = elem.getAttribute("bsconfig");
            const func = elem.getAttribute("bsaction");
            const value = actionHandler[func](elem);
            data[key] = value;

            if (key === "scoresaberId" && data[key]) {
                const match = data[key].match(/\d+/g);
                if (match[0])
                    data[key] = match[0]
            }

            if (key === "blur" && data[key] === "") {
                data[key] = Configuration.STRUCTURE.broadcaster.data.blur;
            }
        });
        return data;
    }


    /**
     * Show all config data to the form
     */
    showFormData(scoreSaberId) {
        const data = demoDefaults[scoreSaberId]? demoDefaults[scoreSaberId] : Configuration.get("broadcaster");
        //console.log(demoDefaults[scoreSaberId], data);
        if (!data)
            return;

        document.querySelectorAll("[bsconfig]").forEach(function (elem) {
            const key = elem.getAttribute("bsconfig");
            const func = elem.getAttribute("bsaction");
            actionHandler[func](elem, data[key]);
        });

        if (demoDefaults[scoreSaberId]) {
            document.querySelector("#suggestion-info").classList.remove("hidden");
        }
        
        if (data.scoresaberId && !scoreSaberId) {
            document.querySelectorAll(".container__item").forEach(elem => elem.classList.remove("hidden"));
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
})
