import '../css/common.scss';

document.addEventListener("DOMContentLoaded", function() {
    const leads = [
        "So much pony",
        "Looking for that one forgotten song?",
        "Looking for the top stuff? Check the albums!",
        "Over 2000 hours of music!",
        "Enough content to survive G5!",
        "Party like it's 2012 again",
        "Everlasting nostalgia stash",
        "We love FLACs",
        "Way too many Winter Wrap Up remixes",
        "Try a random folder, get hidden gems (or not!)",
        "Now with 20% more covert art!",
        "800 GB of music? That's an academy record!",
        "Hard drive sold separately",
        "Find something you like? Support your favorite artists!",
        "Ten More Years!",
    ];

    let lead = document.getElementById('title-lead');
    lead.innerText = leads[Math.floor(Math.random()*leads.length)];
});