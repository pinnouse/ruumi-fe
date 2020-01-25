class Rooms {
    constructor() {
        this._rooms = new Map();
    }

    createRoom(user, anime, episode) {
        //https://stackoverflow.com/questions/6860853/generate-random-string-for-div-id
        var S4 = function() {
            return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        };
        let r = S4()+S4()+'_'+S4();
        while (this._rooms.has(r)) {
            r = S4()+S4()+'_'+S4();
        }
        this._rooms.set(r, {
            id: r,
            anime: anime,
            episode: episode || 0,
            owner: user,
            seek: 0,
            users: [user],
            messages: []
        })
        return r;
    }

    deleteRoom(roomID) {
        if (this._rooms.has(roomID))
            this._rooms.delete(roomID)
    }

    getRoom(roomID) {
        return this._rooms.has(roomID) ? this._rooms.get(roomID) : false
    }
}

module.exports = Rooms