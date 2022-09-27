fetch('http://localhost/pluginfile.php/24/mod_resource/content/1/test.json')
    .then(res => res.blob()) // Gets the response and returns it as a blob
    .then(blob => {
        // Here's where you get access to the blob
        // And you can use it for whatever you want
        // Like calling ref().put(blob)

        // Here, I use it to make an image appear on the page
        let objectURL = URL.createObjectURL(blob);
        let myImage = new Image();
        myImage.src = objectURL;
        document.getElementById('myImg').appendChild(myImage)
    });

function getJSONP(url, success) {

    var ud = '_' + +new Date,
        script = document.createElement('script'),
        head = document.getElementsByTagName('head')[0]
            || document.documentElement;

    window[ud] = function (data) {
        head.removeChild(script);
        success && success(data);
    };

    script.src = url.replace('callback=?', 'callback=' + ud);
    head.appendChild(script);

}