class User {
    constructor() {
        this.subscriptions = [];
    }
    subscribe(streamingService) {
        if (this.subscriptions.findIndex(subs => subs.streamingService === streamingService) >= 0) {
            throw new Error("User has already subscribed at this Streaming service");
        }
        const subscription = new Subscription(streamingService);
        this.subscriptions.push(subscription);
        return subscription;
    }
}
class Subscription {
    constructor(streamingService) {
        this.streamingService = streamingService;
    }
    watch(showName) {
        const views = this.streamingService.viewsByShowNames.get(showName);
        if (views === undefined) {
            throw new Error("There is no such show.");
        }
        this.streamingService.viewsByShowNames.set(showName, views + 1);
    }
    getRecommendationTrending() {
        const mostViewedShowsOfYear = this.streamingService.getMostViewedShowsOfYear(new Date().getFullYear());
        mostViewedShowsOfYear.sort((a, b) => b.getDuration() - a.getDuration());
        return mostViewedShowsOfYear[Math.floor(Math.random() * mostViewedShowsOfYear.length)];
    }
    getRecommendationByGenre(genre) {
        const mostViewedShowsOfYear = this.streamingService.getMostViewedShowsOfGenre(genre);
        mostViewedShowsOfYear.sort((a, b) => b.getDuration() - a.getDuration());
        return mostViewedShowsOfYear[Math.floor(Math.random() * mostViewedShowsOfYear.length)];
    }
}
class StreamingService {
    constructor(name, shows) {
        this.name = name;
        this.shows = shows;
        this.viewsByShowNames = new Map([...shows].map((show) => [show.name, 0]));
    }
    addShow(show) {
        if (this.shows.findIndex(currentShow => currentShow === show) >= 0) {
            throw new Error("There are no duplicates in the list of streaming shows.");
        }
        this.shows.push(show);
        this.viewsByShowNames.set(show.name, 0);
    }
    calcMostViewedShows(currentShows) {
        const mostViewedShows = currentShows.map(show => [show, this.viewsByShowNames.get(show.name)]);
        mostViewedShows.sort((a, b) => b[1] - a[1]);
        const retShows = mostViewedShows.map(([value]) => value);
        return retShows.length > 10 ? retShows.slice(0, 10) : retShows;
    }
    getMostViewedShowsOfYear(year) {
        const currentYearShows = this.shows.filter(({ releaseDate }) => releaseDate.getFullYear() === year);
        return this.calcMostViewedShows(currentYearShows);
    }
    getMostViewedShowsOfGenre(genre) {
        const currentGenreShows = this.shows.filter(({ genre: showGenre }) => showGenre === genre);
        return this.calcMostViewedShows(currentGenreShows);
    }
}
class Show {
    constructor(name, genre, releaseDate) {
        this.name = name;
        this.genre = genre;
        this.releaseDate = releaseDate;
    }
}
class Movie extends Show {
    getDuration() {
        return Date.now() - +this.releaseDate;
    }
}
class Episode extends Show {
    getDuration() {
        return Date.now() - +this.releaseDate;
    }
}
class Series extends Show {
    constructor(name, genre, releaseDate, episodes) {
        super(name, genre, releaseDate);
        this.episodes = episodes;
    }
    getDuration() {
        return Date.now() - +this.releaseDate;
    }
}
var Genre;
(function (Genre) {
    Genre[Genre["DRAMA"] = 0] = "DRAMA";
    Genre[Genre["HORROR"] = 1] = "HORROR";
    Genre[Genre["THRILLER"] = 2] = "THRILLER";
    Genre[Genre["COMEDY"] = 3] = "COMEDY";
    Genre[Genre["CRIME"] = 4] = "CRIME";
    Genre[Genre["MUSIC"] = 5] = "MUSIC";
    Genre[Genre["ADVENTURE"] = 6] = "ADVENTURE";
    Genre[Genre["HISTORY"] = 7] = "HISTORY";
    Genre[Genre["WAR"] = 8] = "WAR";
    Genre[Genre["ACTION"] = 9] = "ACTION";
})(Genre || (Genre = {}));
const netflixShows = [
    new Movie('The Shawshank Redemption', Genre.DRAMA, new Date('2022-01-05')),
    new Movie('Valkyrie', Genre.DRAMA, new Date('2008-03-20')),
    new Movie('City of God', Genre.DRAMA, new Date('2002-10-10')),
    new Movie('Peter Faiman', Genre.ADVENTURE, new Date('2008-03-20')),
];
const megogoShows = [
    new Movie('Beetlejuice', Genre.COMEDY, new Date('1988-08-29')),
    new Movie('The Cotton Club', Genre.CRIME, new Date('1984-11-29')),
    new Series('GoT', Genre.DRAMA, new Date('2010-01-30'), [
        new Episode('1', Genre.DRAMA, new Date('2010-01-10')),
        new Episode('2', Genre.DRAMA, new Date('2010-01-20')),
    ])
];
const netflix = new StreamingService('NETFLIX', netflixShows);
const megogo = new StreamingService('MEGOGO', megogoShows);
console.log(netflix.getMostViewedShowsOfGenre(Genre.DRAMA));
console.log(netflix.getMostViewedShowsOfYear(2008));
const user = new User();
const showToAdd = new Movie('Memento', Genre.THRILLER, new Date('2000-01-01'));
netflix.addShow(showToAdd);
const netflixSub = user.subscribe(netflix);
netflixSub.watch(netflixShows[1].name);
netflixSub.watch(netflixShows[1].name);
netflixSub.watch(netflixShows[0].name);
netflixSub.watch(netflixShows[0].name);
netflixSub.watch(netflixShows[0].name);
console.log(netflix.viewsByShowNames);
console.log(netflixSub.getRecommendationTrending());
console.log(netflixSub.getRecommendationByGenre(Genre.DRAMA));
console.log(netflixSub.getRecommendationByGenre(Genre.THRILLER));
