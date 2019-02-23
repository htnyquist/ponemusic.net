import '../css/common.scss';

document.addEventListener("DOMContentLoaded", function() {
    const leads = [
        "So much pony",
        "Looking for that one forgotten song?",
        "Looking for the top stuff? Check the albums!",
        "3000 artists, 2000 hours of music!",
        "Enough content to survive G5!",
        "Keep making music, we'll keep adding it!",
        "A fresh new release every 6 month",
        "Party like it's 2012 again",
        "Because Youtube only goes so far",
        "Everlasting nostalgia stash",
        "We love FLACs",
        "Way too many Winter Wrap Up remixes",
        "Try a random folder, get hidden gems (or not!)",
        "Now with 20% more covert art!",
        "May contain traces of Bandcamp, pony.fm, and Soundclouds",
        "600 GB of music? That's an academy record!",
        "Find something you like? Support your favorite artists!",
    ];

    let lead = document.getElementById('title-lead');
    lead.innerText = leads[Math.floor(Math.random()*leads.length)];
});