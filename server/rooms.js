class Rooms {
    constructor() {
        this._rooms = new Map();
    }

    createRoom(user, anime, episode, source, password) {
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
            source: source || "",
            owner: user,
            seek: 0,
            users: [user],
            password: password || "",
            created: new Date(),
            lastPause: new Date().getTime()
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

    hasRoom(roomId) {
        return this._rooms.has(roomId)
    }

    /**
     * 
     * @param {String} userId Snowflake of the user's DiscordID
     * @returns {Array<Rooms>}
     */
    getUsersRooms(userId) {
        let rooms = []
        this._rooms.forEach(r => {
            if (r.users.find(u => u.id == userId))
                rooms.push(r)
        })
        return rooms
    }

    addUser(roomId, user) {
        let room = this.getRoom(roomId)
        if (!room || room.users.find(u => u.id == user.id)) return
        room.users.push(user)
    }

    remUser(roomId, user) {
        let room = this.getRoom(roomId)
        if (!room) return
        let i = room.users.findIndex(u => u.id == user.id)
        if (i == -1) return
        room.users.splice(i, 1)
        
    }

    size() {
        return this._rooms.size
    }

    checkRooms() {
        let today = new Date()
        let deleted = []
        let _r = this;
        this._rooms.forEach((r, k) => {
            if (today - r.created < 1000 * 60 * 60 * 6) return;
            deleted.push(_r.id)
            _r.deleteRoom(k)
        })
        return deleted
    }
}

module.exports = Rooms