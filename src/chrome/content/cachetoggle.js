CacheToggle = {
  
  initialize: function() {
    // Application.console.log('CacheToggle: initialized');
    this.diskCache = Application.prefs.get("browser.cache.disk.enable", true);
    this.memCache = Application.prefs.get("browser.cache.memory.enable", true);
    this.memCache.value = this.diskCache.value;
    this.switch_control = document.getElementById('ctSwitch');
    this.switch_control.setOn(this.diskCache.value);
    this.boundToggle = function(event) {CacheToggle.toggle(event);};
    this.boundUpdate = function(){CacheToggle.update();};
    this.switch_control.addEventListener('change',this.boundToggle, false);
    this.diskCache.events.addListener("change", this.boundUpdate, false);
  },
  
  clearCache: function() {
    var cacheClass = Components.classes["@mozilla.org/network/cache-service;1"];
    var cacheService = cacheClass.getService(Components.interfaces.nsICacheService);
    cacheService.evictEntries(Components.interfaces.nsICache.STORE_ON_DISK);
    cacheService.evictEntries(Components.interfaces.nsICache.STORE_IN_MEMORY);
  },
  
  toggle: function(event) {
    if (event.target.isOn == false) {
      this.clearCache();
    }
    this.memCache.value = this.diskCache.value = event.target.isOn;
    // Application.console.log('CacheToggle: browser cache is enabled: ' + this.memCache.value);
  },
  
  update: function(event) {
    this.switch_control.removeEventListener('change',this.boundToggle, false);
    this.switch_control.setOn(this.diskCache.value);
    this.switch_control.addEventListener('change',this.boundToggle, false);
  },
  
  destroy: function() {
    this.switch_control.removeEventListener('change',this.boundToggle, false);
    this.diskCache.events.removeListener("change", this.boundUpdate);
    // Application.console.log('CacheToggle: destroyed');
  }

};

window.addEventListener("load", function(){CacheToggle.initialize();}, false);
window.addEventListener("unload", function(){CacheToggle.destroy();}, false);


