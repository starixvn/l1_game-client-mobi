// Create the XHR object.
const createCORSRequest = (method, url) => {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {
    // XHR for Chrome/Firefox/Opera/Safari.
    xhr.open(method, url, true);
  } else {
    // CORS not supported.
    xhr = null;
  }
  return xhr;
};

// Make the actual CORS request.
const makeCorsRequest = (url, callback, alsoExecuteError) => {
  // This is a sample server that supports CORS.
  var xhr = createCORSRequest("GET", url);
  if (!xhr) {
    console.log("CORS not supported");
    return;
  }

  // Response handlers.
  xhr.onload = function () {
    callback(JSON.parse(xhr.responseText));
  };

  xhr.onerror = function () {
    console.log("Woops, there was an error making the request.");
    if (alsoExecuteError) {
      callback();
    }
  };

  xhr.send();
};

export { makeCorsRequest as get }
