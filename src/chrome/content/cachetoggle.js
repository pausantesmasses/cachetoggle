(function(){

  var cacheClass = Components.classes["@mozilla.org/network/cache-service;1"];
  var cacheService = cacheClass.getService(Components.interfaces.nsICacheService);

  var CacheToggle = {

    initialize: function() {
      // Application.console.log('CacheToggle: initialized');
      this.diskCache         = Application.prefs.get("browser.cache.disk.enable", true);
      this.memCache          = Application.prefs.get("browser.cache.memory.enable", true);
      this.showTextLabel     = Application.prefs.get("extensions.cachetoggle.textLabel");
      this.clearCacheWhenOff = Application.prefs.get("extensions.cachetoggle.clearCacheWhenOff");

      this.label                     = document.getElementById("ctLabel");
      this.switchControl             = document.getElementById("ctSwitch");
      this.textLabelMenuItem         = document.getElementById("ctToggleTextLabelMenuItem");
      this.clearCacheWhenOffMenuItem = document.getElementById("ctClearCacheWhenOffMenuItem");

      this.memCache.value = this.diskCache.value;

      this.label.style.display = this.showTextLabel.value ? "" : "none";
      this.switchControl.setOn(this.diskCache.value);
      this.textLabelMenuItem.setAttribute("checked", this.showTextLabel.value);
      this.clearCacheWhenOffMenuItem.setAttribute("checked", this.clearCacheWhenOff.value);

      this.boundToggle = function(event){ CacheToggle.toggle(event); };
      this.boundUpdate = function(){ CacheToggle.updateSwitchControl(); };

      this.switchControl.addEventListener("change",this.boundToggle, false);
      this.diskCache.events.addListener("change", this.boundUpdate, false);
      this.textLabelMenuItem.addEventListener("command", function(event){ CacheToggle.toggleTextLabel(); }, false);
      this.clearCacheWhenOffMenuItem.addEventListener("command", function(event){ CacheToggle.setClearCacheWhenOff(); }, false);
    },
    
    setCacheTo: function(value) {
      this.memCache.value = this.diskCache.value = this.diskCache.value = Boolean(value);
    },

    clearCache: function() {
      cacheService.evictEntries(Components.interfaces.nsICache.STORE_IN_MEMORY);
      cacheService.evictEntries(Components.interfaces.nsICache.STORE_ON_DISK);
      Application.console.log('CacheToggle: evicted cache entries');
    },

    toggle: function(event) {
      if (this.clearCacheWhenOff.value && event.target.isOn == false) {
        this.clearCache();
      }
      this.setCacheTo(event.target.isOn);
      // Application.console.log('CacheToggle: browser cache is enabled: ' + this.diskCache.value);
    },

    toggleTextLabel: function() {
      this.showTextLabel.value = !this.showTextLabel.value;
      this.label.style.display = this.showTextLabel.value ? "" : "none";
    },

    setClearCacheWhenOff: function() {
      this.clearCacheWhenOff.value = !this.clearCacheWhenOff.value;
    },

    updateSwitchControl: function() {
      this.switchControl.removeEventListener("change",this.boundToggle, false);
      this.switchControl.setOn(this.diskCache.value);
      this.switchControl.addEventListener("change",this.boundToggle, false);
    },

    destroy: function() {
      this.switchControl.removeEventListener("change",this.boundToggle, false);
      this.diskCache.events.removeListener("change", this.boundUpdate);
      // Application.console.log('CacheToggle: destroyed');
    }

  };

  window.addEventListener("load", function(){CacheToggle.initialize();}, false);
  window.addEventListener("unload", function(){CacheToggle.destroy();}, false);

})();