if (typeof Blob.prototype.arrayBuffer !== "function") {
  Blob.prototype.arrayBuffer = function() {
    const file = this;
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = function(e) {
        resolve(e.target.result);
      };
      reader.onloadend = function(e) {};
      reader.onerror = function(e) {
        reject(e.target.error);
      }
      reader.readAsArrayBuffer(file);
    });
  }
}

if (typeof Blob.prototype.text !== "function") {
  Blob.prototype.text = function() {
    const file = this;
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = function(e) {
        resolve(e.target.result);
      };
      reader.onloadend = function(e) {};
      reader.onerror = function(e) {
        reject(e.target.error);
      }
      reader.readAsText(file);
    });
  }
}
