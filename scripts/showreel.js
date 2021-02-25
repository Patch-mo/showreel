// Create a WaveSurfer instance
let wavesurfer;

// Init on DOM ready
document.addEventListener('DOMContentLoaded', function () {
    wavesurfer = WaveSurfer.create({
        container: '#waveform',
        waveColor: '#F7F7F5',
        progressColor: '##46413B',
        cursorColor: '#46413B',
        backgroundColor: '#BEBBB6',
        barWidth: 3,
        barRadius: 3,
        cursorWidth: 1,
        height: 120,
        barGap: 2,
    });
});

// Bind controls
document.addEventListener('DOMContentLoaded', function () {
    let playPause = document.querySelector('#playPause');
    playPause.addEventListener('click', function () {
        wavesurfer.playPause();
    });

    // Toggle play/pause text
    wavesurfer.on('play', function () {
        document.querySelector('#play').style.display = 'none';
        document.querySelector('#pause').style.display = '';
    });
    wavesurfer.on('pause', function () {
        document.querySelector('#play').style.display = '';
        document.querySelector('#pause').style.display = 'none';
    });

    // The playlist links
    let links = document.querySelectorAll('#playlist .list-group-item');
    let currentTrack = 0;

    // // Load a track by index and highlight the corresponding link
    // let setCurrentSong = function (index) {
    //     links[currentTrack].classList.remove('active');
    //     currentTrack = index;
    //     links[currentTrack].classList.add('active');
    //     wavesurfer.load(links[currentTrack].dataset.wav);
    // };

    let setCurrentSong = function (index) {
        // Bug fix 1 of 2
        wavesurfer.pause();

        //set playlist styles
        links[currentTrack].classList.remove('active');
        currentTrack = index;
        links[currentTrack].classList.add('active');

        var trackName = links[currentTrack].dataset.wav;

        var audioFile = `audio/${trackName}.mp3`;

        var waveFile = `json/${trackName}.json`;

        // Bug fix 2 of 2
        wavesurfer.load(audioFile);

        //load peaks from json file
        fetch(waveFile)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('HTTP error ' + response.status);
                }
                return response.json();
            })
            .then((peaks) => {
                console.log('loaded peaks! sample_rate: ' + peaks.sample_rate);

                // load peaks into wavesurfer.js
                wavesurfer.load(audioFile, peaks.data);
            })
            .catch((e) => {
                console.error('error', e);
            });
    };

    // Load the track on click
    Array.prototype.forEach.call(links, function (link, index) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            setCurrentSong(index);
        });
    });

    // Play on audio load
    wavesurfer.on('ready', function () {
        wavesurfer.play();
    });

    wavesurfer.on('error', function (e) {
        console.warn(e);
    });

    // Go to the next track on finish
    wavesurfer.on('finish', function () {
        setCurrentSong((currentTrack + 1) % links.length);
    });

    // Load the first track
    setCurrentSong(currentTrack);
});
