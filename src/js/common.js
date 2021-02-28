import '../css/common.scss';

document.addEventListener("DOMContentLoaded", function() {
    const leads = [
        "So much pony",
        "Looking for that one forgotten song?",
        "Looking for the top stuff? Check the albums!",
        "Over 2000 hours of music!",
        "Party like it's 2012 again",
        "Everlasting nostalgia stash",
        "We love FLACs",
        "Way too many Winter Wrap Up remixes",
        "Try a random folder, get hidden gems (or not!)",
        "Now with 20% more covert art!",
        "900 GB of pony music? That's an academy record!",
        "Hard drive sold separately",
        "Find something you like? Support your favorite artists!",
        "Ten More Years!",
        "Now with G5 songs!",
    ];

    let lead = document.getElementById('title-lead');
    lead.innerText = leads[Math.floor(Math.random()*leads.length)];
});
