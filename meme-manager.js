class MemeManager {
    constructor() {
        this.initializeMemes();
        this.initializeCaptions();
        this.initializeLocalStorage();
    }

    initializeLocalStorage() {
        this.dbName = 'MemeGameDB';
        this.dbVersion = 1;
        this.db = null;
        this.initDB();
    }

    async initDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('memes')) {
                    const store = db.createObjectStore('memes', { keyPath: 'id', autoIncrement: true });
                    store.createIndex('pack', 'pack', { unique: false });
                    store.createIndex('filename', 'filename', { unique: false });
                }
            };
        });
    }

    async saveLocalMeme(file, pack, description) {
        if (!this.db) {
            await this.initDB();
        }

        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const memeData = {
                    filename: file.name,
                    type: file.type.startsWith('image/') ? 'image' : 'video',
                    data: e.target.result,
                    pack: pack,
                    alt: description || file.name,
                    size: file.size,
                    lastModified: file.lastModified,
                    isLocal: true
                };

                const transaction = this.db.transaction(['memes'], 'readwrite');
                const store = transaction.objectStore('memes');
                const request = store.add(memeData);

                request.onsuccess = () => {
                    // Add to memory cache
                    if (!this.memePacks[pack]) {
                        this.memePacks[pack] = [];
                    }
                    
                    const meme = {
                        type: memeData.type,
                        url: memeData.data,
                        alt: memeData.alt,
                        isLocal: true,
                        id: request.result
                    };
                    
                    this.memePacks[pack].push(meme);
                    resolve(meme);
                };

                request.onerror = () => reject(request.error);
            };

            reader.onerror = () => reject(reader.error);
            reader.readAsDataURL(file);
        });
    }

    async loadLocalMemes() {
        if (!this.db) {
            await this.initDB();
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['memes'], 'readonly');
            const store = transaction.objectStore('memes');
            const request = store.getAll();

            request.onsuccess = () => {
                const localMemes = request.result;
                
                // Group by pack and add to memory cache
                localMemes.forEach(memeData => {
                    if (!this.memePacks[memeData.pack]) {
                        this.memePacks[memeData.pack] = [];
                    }
                    
                    const meme = {
                        type: memeData.type,
                        url: memeData.data,
                        alt: memeData.alt,
                        isLocal: true,
                        id: memeData.id
                    };
                    
                    this.memePacks[memeData.pack].push(meme);
                });
                
                resolve(localMemes);
            };

            request.onerror = () => reject(request.error);
        });
    }

    async deleteLocalMeme(memeId) {
        if (!this.db) {
            await this.initDB();
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['memes'], 'readwrite');
            const store = transaction.objectStore('memes');
            const request = store.delete(memeId);

            request.onsuccess = () => {
                // Remove from memory cache
                Object.keys(this.memePacks).forEach(pack => {
                    this.memePacks[pack] = this.memePacks[pack].filter(meme => meme.id !== memeId);
                });
                resolve();
            };

            request.onerror = () => reject(request.error);
        });
    }

    async getLocalMemeStats() {
        if (!this.db) {
            await this.initDB();
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['memes'], 'readonly');
            const store = transaction.objectStore('memes');
            const request = store.getAll();

            request.onsuccess = () => {
                const memes = request.result;
                const stats = {
                    total: memes.length,
                    totalSize: memes.reduce((sum, meme) => sum + (meme.size || 0), 0),
                    byPack: {}
                };

                memes.forEach(meme => {
                    if (!stats.byPack[meme.pack]) {
                        stats.byPack[meme.pack] = { count: 0, size: 0 };
                    }
                    stats.byPack[meme.pack].count++;
                    stats.byPack[meme.pack].size += meme.size || 0;
                });

                resolve(stats);
            };

            request.onerror = () => reject(request.error);
        });
    }

    initializeMemes() {
        this.memePacks = {
            classic: [
                {
                    type: 'image',
                    url: '/Disney_Pixar_style_movie_poster_for__dumb_kids___Colorful__adventurous__family_friendly__high_qualit_2360a75014f528.jpg',
                    alt: 'Disney Pixar style "Dumb Kids" movie poster'
                },
                {
                    type: 'image',
                    url: '/Disney_Pixar_style_movie_poster_for__pipe_valves_and_fittings___Colorful__adventurous__family_friend_c4ece2f9502978.jpg',
                    alt: 'Disney Pixar style "Pipe Valves and Fittings" movie poster'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/1bij.jpg',
                    alt: 'Drake pointing meme'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/2zo1ki.jpg',
                    alt: 'Expanding brain meme'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/1g8my4.jpg',
                    alt: 'Distracted boyfriend meme'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/26am.jpg',
                    alt: 'Futurama Fry meme'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/1otk96.jpg',
                    alt: 'Soldier protecting sleeping child meme'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/4t0m5.jpg',
                    alt: 'Leonardo DiCaprio cheers meme'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/61kujr.jpg',
                    alt: 'Stonks meme'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/23ls.jpg',
                    alt: 'The Most Interesting Man In The World'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/1ur9b0.jpg',
                    alt: 'Roll Safe Think About It'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/8p0ka.jpg',
                    alt: 'Hide the pain Harold'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/1tl71a.jpg',
                    alt: 'Arthur Fist'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/1c1uej.jpg',
                    alt: 'One Does Not Simply'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/y6yk4.jpg',
                    alt: 'Bad Luck Brian'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/21aqbc.jpg',
                    alt: 'Mocking SpongeBob'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/1w7pnt.jpg',
                    alt: 'Waiting Skeleton'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/1e7ql7.jpg',
                    alt: 'Scroll of Truth'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/5dmhjd.jpg',
                    alt: 'Bernie I am once again asking'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/61kujr.jpg',
                    alt: 'Bernie Sanders pointing'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/5c7lwq.jpg',
                    alt: 'Woman yelling at cat template'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/7kqizh.jpg',
                    alt: 'Confused math lady'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/6ggp0l.jpg',
                    alt: 'Success kid fist pump'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/5jeqyh.jpg',
                    alt: 'Panik calm panik meme'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/61nqn6.jpg',
                    alt: 'Two buttons choice'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/4acd7j.jpg',
                    alt: 'Exit ramp driving'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/3si4.jpg',
                    alt: 'Dos Equis interesting man'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/4q29.jpg',
                    alt: 'Ancient aliens guy'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/2rnmjp.jpg',
                    alt: 'Monkey looking away'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/3oqj4n.jpg',
                    alt: 'Surprised Tom face'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/1h7in3.jpg',
                    alt: 'Dabbing squidward'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/5t47l0.jpg',
                    alt: 'Gigachad vs virgin'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/2wifvo.jpg',
                    alt: 'Flex tape fix everything'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/39u469.jpg',
                    alt: 'Pointing spiderman'
                }
            ],
            trending: [
                {
                    type: 'image',
                    url: '/Disney_Pixar_style_movie_poster_for__dumb_kids___Colorful__adventurous__family_friendly__high_qualit_2360a75014f528.jpg',
                    alt: 'Disney Pixar style "Dumb Kids" movie poster'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/61kujr.jpg',
                    alt: 'Stonks meme'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/3oevdk.jpg',
                    alt: 'Woman yelling at cat meme'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/3lmzyx.jpg',
                    alt: 'This is fine dog meme'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/2fm6x.jpg',
                    alt: 'Surprised Pikachu meme'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/4clla.jpg',
                    alt: 'Always Has Been meme'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/5jeamx.jpg',
                    alt: 'Trade Offer meme'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/392xtu.jpg',
                    alt: 'Change My Mind meme'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/65939f.jpg',
                    alt: 'Will Smith slap meme'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/6i7zv1.jpg',
                    alt: 'Minions banana meme'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/4p47dh.jpg',
                    alt: 'Among Us suspicious'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/7jwp45.jpg',
                    alt: 'Giga Chad meme'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/6oj3pk.jpg',
                    alt: 'NFT monkey'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/5o4rq8.jpg',
                    alt: 'Big Chungus'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/4hqhjz.jpg',
                    alt: 'COVID mask meme'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/5vz3mp.jpg',
                    alt: 'Sigma male grindset'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/6njq58.jpg',
                    alt: 'Metaverse meme'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/6g8s4j.jpg',
                    alt: 'Ohio vs Florida man'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/7q2cp8.jpg',
                    alt: 'Backrooms level 0'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/5ul9ch.jpg',
                    alt: 'NFT right click save'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/6b4v2j.jpg',
                    alt: 'Ratio Twitter moment'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/5vgf0w.jpg',
                    alt: 'Sus impostor among us'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/6ywd5.jpg',
                    alt: 'Doge bonk bat'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/5c8s5e.jpg',
                    alt: 'Drip goku ultra instinct'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/7l8nco.jpg',
                    alt: 'Gigachad sigma male'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/6p0rxz.jpg',
                    alt: 'Morbin time morbius'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/61owb4.jpg',
                    alt: 'Brain expanding galaxy'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/7jkqhd.jpg',
                    alt: 'Friday night funkin'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/5wg4a8.jpg',
                    alt: 'Social credit score'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/6h9qbb.jpg',
                    alt: 'Breaking bad reaction'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/7m3u9l.jpg',
                    alt: 'Morbius sweep'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/5oj6mk.jpg',
                    alt: 'Sussy baka'
                }
            ],
            animals: [
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/2fm6x.jpg',
                    alt: 'Surprised Pikachu meme'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/9ehk.jpg',
                    alt: 'Unimpressed cat meme'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/4j5wi.jpg',
                    alt: 'Doge meme'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/3lmzyx.jpg',
                    alt: 'This is fine dog meme'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/1ur9b0.jpg',
                    alt: 'Roll safe thinking meme'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/5o32tt.jpg',
                    alt: 'Monkey Puppet meme'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/1ihzfe.jpg',
                    alt: 'Disaster Girl meme'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/30b1gx.jpg',
                    alt: 'Drake reaction meme'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/6ktgw8.jpg',
                    alt: 'Crying cat meme'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/213w6.jpg',
                    alt: 'Evil Kermit'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/1yxkcp.jpg',
                    alt: 'Bongo Cat'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/5o4rq8.jpg',
                    alt: 'Big Chungus bunny'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/5lmj5h.jpg',
                    alt: 'Cat at computer'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/6h9qn9.jpg',
                    alt: 'Wholesome seal'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/3y68h.jpg',
                    alt: 'Angry cat keyboard'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/5gu3ap.jpg',
                    alt: 'Hamster eating banana'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/5n3et4.jpg',
                    alt: 'Dancing lobster'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/6qxw9k.jpg',
                    alt: 'Concerned bird'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/6z8w1k.jpg',
                    alt: 'Grumpy cat disapproves'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/5nq8jh.jpg',
                    alt: 'Dramatic chipmunk'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/4y2nrd.jpg',
                    alt: 'Screaming goat'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/2o9h6d.jpg',
                    alt: 'Penguin awkward moment'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/35n3q1.jpg',
                    alt: 'Dancing parrot'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/6wxrl3.jpg',
                    alt: 'Shiba inu side eye'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/4lg92h.jpg',
                    alt: 'Elephant never forgets'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/2xrq8m.jpg',
                    alt: 'Raccoon trash panda'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/53j2od.jpg',
                    alt: 'Owl wisdom face'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/1z8ej.jpg',
                    alt: 'Sloth slow motion'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/4eqd7k.jpg',
                    alt: 'Angry bird red'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/6m3slt.jpg',
                    alt: 'Fox smug face'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/2lohpj.jpg',
                    alt: 'Bear fishing salmon'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/7kqmt8.jpg',
                    alt: 'Surprised otter'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/4z2p8k.jpg',
                    alt: 'Confused deer headlights'
                }
            ],
            reactions: [
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/30b1gx.jpg',
                    alt: 'Drake reaction meme'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/3oevdk.jpg',
                    alt: 'Woman yelling at cat meme'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/4t0m5.jpg',
                    alt: 'Leonardo DiCaprio cheers meme'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/26am.jpg',
                    alt: 'Futurama Fry meme'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/2fm6x.jpg',
                    alt: 'Surprised Pikachu meme'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/1g8my4.jpg',
                    alt: 'Distracted boyfriend meme'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/392xtu.jpg',
                    alt: 'Change My Mind meme'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/2kbz8z.jpg',
                    alt: 'Face palm'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/8p0ka.jpg',
                    alt: 'Hide the pain Harold'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/3vzej.jpg',
                    alt: 'Awkward penguin'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/6c25p.jpg',
                    alt: 'Confused Mr. Krabs'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/23pqd.jpg',
                    alt: 'Skeptical baby'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/34kz8w.jpg',
                    alt: 'Screaming cowboy'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/1tl71a.jpg',
                    alt: 'Arthur fist anger'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/2l7a.jpg',
                    alt: 'Philosoraptor thinking'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/1yxkcp.jpg',
                    alt: 'Happy reaction'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/5dmhjd.jpg',
                    alt: 'Bernie Sanders pointing'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/5xr8fl.jpg',
                    alt: 'Crying wojak sad'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/4hlg7r.jpg',
                    alt: 'Chad yes meme'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/3p8j9s.jpg',
                    alt: 'Pepe frog smug'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/2cwpb7.jpg',
                    alt: 'Thinking emoji discord'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/6lhwny.jpg',
                    alt: 'Skull emoji laughing'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/4dzhzs.jpg',
                    alt: 'Gigachad nod approval'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/39o7k8.jpg',
                    alt: 'Surprised kirby'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/2q7qn4.jpg',
                    alt: 'Sweating towel guy'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/4wucx2.jpg',
                    alt: 'Thumbs up skeleton'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/5n7lb3.jpg',
                    alt: 'Crying laughing emoji'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/3xh8qz.jpg',
                    alt: 'Mind blown explosion'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/2bp5qn.jpg',
                    alt: 'Angry NPC face'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/6k8pwl.jpg',
                    alt: 'Yikes reaction face'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/4ozq8h.jpg',
                    alt: 'Cringe reaction image'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/7p2qol.jpg',
                    alt: 'Based reaction chad'
                }
            ],
            office: [
                {
                    type: 'image',
                    url: '/Disney_Pixar_style_movie_poster_for__pipe_valves_and_fittings___Colorful__adventurous__family_friend_c4ece2f9502978.jpg',
                    alt: 'Disney Pixar style "Pipe Valves and Fittings" movie poster'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/3lmzyx.jpg',
                    alt: 'This is fine dog meme'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/26am.jpg',
                    alt: 'Futurama Fry meme'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/1otk96.jpg',
                    alt: 'Soldier protecting sleeping child meme'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/61kujr.jpg',
                    alt: 'Stonks meme'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/1ur9b0.jpg',
                    alt: 'Roll Safe Think About It'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/392xtu.jpg',
                    alt: 'Change My Mind meme'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/1w7pnt.jpg',
                    alt: 'Waiting skeleton at desk'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/2o5o8w.jpg',
                    alt: 'Office space printer destruction'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/1e7ql7.jpg',
                    alt: 'Meeting that could be email'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/8p0ka.jpg',
                    alt: 'Pretending to work Harold'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/5lmj5h.jpg',
                    alt: 'Cat working from home'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/4hqhjz.jpg',
                    alt: 'Zoom meeting struggles'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/6c25p.jpg',
                    alt: 'Confused about new software'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/2kbz8z.jpg',
                    alt: 'When the printer jams'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/5jeamx.jpg',
                    alt: 'Offering overtime for pizza party'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/6njq58.jpg',
                    alt: 'Mandatory team building'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/5m8g7j.jpg',
                    alt: 'Working from home vs office'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/2whb8j.jpg',
                    alt: 'Coffee addiction Monday'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/6ch2kp.jpg',
                    alt: 'Micromanager boss watching'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/4sp6z8.jpg',
                    alt: 'Reply all email chaos'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/7nq4wp.jpg',
                    alt: 'Slack notification anxiety'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/3z8p4d.jpg',
                    alt: 'Meeting that could be email'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/5jt6kh.jpg',
                    alt: 'Expense report nightmare'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/2q8kld.jpg',
                    alt: 'Printer jam Monday morning'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/3z8p4d.jpg',
                    alt: 'Meeting that could be email'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/6hy3ms.jpg',
                    alt: 'Team building exercise cringe'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/4pq7gn.jpg',
                    alt: 'Mandatory fun corporate'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/7m2qrx.jpg',
                    alt: 'Zoom meeting mute fail'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/3rw8kt.jpg',
                    alt: 'IT ticket urgent priority'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/5h9dqz.jpg',
                    alt: 'Deadline approaching panic'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/4b6ht2.jpg',
                    alt: 'Office kitchen etiquette'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/6z4kmd.jpg',
                    alt: 'Performance review anxiety'
                }
            ],
            gaming: [
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/2fm6x.jpg',
                    alt: 'Surprised Pikachu meme'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/1ur9b0.jpg',
                    alt: 'Roll safe thinking meme'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/3lmzyx.jpg',
                    alt: 'This is fine dog meme'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/26am.jpg',
                    alt: 'Futurama Fry meme'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/2zo1ki.jpg',
                    alt: 'Expanding brain meme'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/5jeamx.jpg',
                    alt: 'Trade Offer meme'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/4clla.jpg',
                    alt: 'Always Has Been meme'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/4p47dh.jpg',
                    alt: 'Among Us suspicious'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/6h9qn9.jpg',
                    alt: 'When you finally beat the boss'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/5gu3ap.jpg',
                    alt: 'Getting carried by teammates'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/1tl71a.jpg',
                    alt: 'When someone steals your kill'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/6ktgw8.jpg',
                    alt: 'Losing streak sadness'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/4j5wi.jpg',
                    alt: 'Such skill very gaming'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/7jwp45.jpg',
                    alt: 'Chad gamer'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/21aqbc.jpg',
                    alt: 'Toxic player mockery'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/6qxw9k.jpg',
                    alt: 'When your internet lags'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/5n3et4.jpg',
                    alt: 'Victory dance'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/5tn8gh.jpg',
                    alt: 'Rage quit controller throw'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/3y8kp2.jpg',
                    alt: 'Speedrun world record'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/6w4n2l.jpg',
                    alt: 'Pay to win microtransactions'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/4sm6rj.jpg',
                    alt: 'Tutorial skip veteran'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/7h3qkz.jpg',
                    alt: 'Dark souls you died'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/2xr4pl.jpg',
                    alt: 'Camping sniper noob'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/5pw8kf.jpg',
                    alt: 'RNG luck random'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/4gt9ch.jpg',
                    alt: 'Toxic teammate blame'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/6m8qyh.jpg',
                    alt: 'Boss fight impossible'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/3vz8kl.jpg',
                    alt: 'Loot box gambling'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/7q3nhf.jpg',
                    alt: 'Grind fest endless'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/4y9mwz.jpg',
                    alt: 'Achievement unlock rare'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/5k4pgm.jpg',
                    alt: 'Noob vs pro skill'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/6h8qwr.jpg',
                    alt: 'Server lag connection'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/3m9pqz.jpg',
                    alt: 'Game breaking bug'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/7k2ngh.jpg',
                    alt: 'Battle royale last circle'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/4z6hjp.jpg',
                    alt: 'Character creation hours'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/6w9qkm.jpg',
                    alt: 'Loading screen eternity'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/5h2nqp.jpg',
                    alt: 'Competitive ranked anxiety'
                },
                {
                    type: 'image',
                    url: 'https://i.imgflip.com/7m4gwh.jpg',
                    alt: 'Esports professional dream'
                }
            ]
        };

        // Set default meme pack
        this.currentMemePack = 'classic';
        this.memes = this.memePacks[this.currentMemePack];
    }

    initializeCaptions() {
        this.captionPool = [
            "When your project gets the Disney treatment",
            "That moment when even Pixar makes your life story",
            "When corporate tries to make everything fun",
            "Me explaining why my hobby deserves a movie",
            "When someone turns your random idea into art",
            "That feeling when your job becomes a kids' movie",
            "When your boring life gets the animation upgrade",
            "Me trying to make mundane things exciting",
            "When even pipe fittings get better marketing than you",
            "That moment when everything becomes content",
            "When you finally understand the assignment",
            "Me trying to be productive on Monday",
            "That moment when everything makes sense",
            "When someone asks if I'm okay",
            "Me pretending I know what's going on",
            "When you realize it's already December",
            "Trying to adult like...",
            "When you see your bank account",
            "Me avoiding responsibilities",
            "When someone says they don't like pizza",
            "My brain at 3 AM",
            "When you finish all your homework",
            "Me trying to save money",
            "When you find the perfect parking spot",
            "My social battery after one conversation",
            "When you remember you have snacks at home",
            "Me explaining why I need 47 browser tabs open",
            "When you finally fix the bug",
            "My patience during rush hour",
            "When someone asks what I did this weekend",
            "Me trying to wake up before noon",
            "When you get a text from your mom",
            "My motivation on Sunday night",
            "When you realize you're an adult now",
            "Me trying to understand cryptocurrency",
            "When someone says 'We need to talk'",
            "My life goals vs reality",
            "When you find matching socks",
            "Me pretending to listen in meetings",
            "When you accidentally open the front camera",
            "When the Wi-Fi actually works",
            "Me at 2 AM ordering food delivery",
            "When your favorite show gets cancelled",
            "Trying to look busy at work",
            "When someone spoils your favorite movie",
            "My energy levels throughout the day",
            "When you see someone wearing socks with sandals",
            "Me trying to parallel park",
            "When you find money in old jeans",
            "My relationship with exercise",
            "When someone says 'It's not that deep'",
            "Me trying to remember where I put my keys",
            "When you realize you left your phone at home",
            "My cooking skills in action",
            "When someone asks about my weekend plans",
            "Me trying to be healthy for 5 minutes",
            "When you see your ex with someone new",
            "My attention span during online meetings",
            "When someone says they're 'almost ready'",
            "Me trying to save space on my phone",
            "When you accidentally like someone's old photo",
            "My confidence vs my actual abilities",
            "When someone borrows your charger",
            "Me trying to remember a funny story",
            "When you realize you're talking to yourself",
            "My plans vs what actually happens",
            "When someone says 'Let's just wing it'",
            "Me trying to be spontaneous",
            "When you see your reflection unexpectedly",
            "My productivity after lunch",
            "When someone asks for relationship advice",
            "Me trying to make small talk",
            "When you find a comfortable sleeping position",
            "My enthusiasm for Monday mornings",
            "When someone says 'Money doesn't buy happiness'",
            "Me trying to remember someone's name",
            "When you realize you've been singing wrong lyrics",
            "My reaction to early morning meetings",
            "When someone says 'No offense, but...'",
            "Me trying to look professional on video calls",
            "When you see someone slip on ice",
            "My organizational skills in practice",
            "When someone asks if I've watched that show",
            "Me trying to be mysterious",
            "When you realize you're becoming your parents",
            "My patience with slow internet",
            "When someone says 'It could be worse'",
            "Me trying to act surprised at my own party",
            "When you see someone you know in public",
            "My reaction to receiving compliments",
            "When someone asks about my five-year plan",
            "Me trying to stay awake during lectures",
            "When you realize you're the problem",
            "My dancing skills at weddings",
            "When someone says 'Just be yourself'",
            "Me trying to convince myself to exercise",
            "When you see your high school classmates succeeding",
            "My response to 'How was your day?'",
            "When someone says 'We should hang out soon'",
            "Me trying to be environmentally conscious",
            "When you realize you're out of coffee",
            "My multitasking abilities in action",
            "When someone asks if I'm free this weekend",
            "Me trying to remember what I came into this room for",
            "When you see someone using Internet Explorer",
            "My reaction to surprise social events",
            "When someone says 'That's so random'",
            "Me trying to take a good selfie",
            "When you realize you've been procrastinating again",
            "My enthusiasm for group projects",
            "When someone asks about my hobbies",
            "Me trying to eat healthy for a whole week",
            "When you see your crush online but they don't reply",
            "My reaction to Monday morning emails",
            "When someone says 'Let's agree to disagree'",
            "Me trying to remember if I locked the door",
            "When you realize you've been wearing your shirt inside out",
            "My confidence when parallel parking",
            "When someone asks what my biggest weakness is",
            "Me trying to stay positive",
            "When you see a spider in your room",
            "My reaction to 'Can we talk?'",
            "When someone says 'It's not you, it's me'",
            "Me trying to be fashionable",
            "When you realize you've been mispronouncing a word",
            "My patience with technology",
            "When someone asks about my career goals",
            "Me trying to make friends as an adult",
            "When you see your teacher outside of school",
            "My reaction to unexpected compliments",
            "When someone says 'You're so lucky'",
            "Me trying to be more organized",
            "When you realize you forgot someone's birthday",
            "My enthusiasm for cleaning",
            "When someone asks if I'm stressed",
            "Me trying to be more social",
            "When you see someone wearing the same outfit",
            "My reaction to 'We need to cut the budget'",
            "When someone says 'That's not how I would do it'",
            "Me trying to look interested in sports",
            "When you realize you're becoming predictable",
            "My patience with group chats",
            "When someone asks about my love life",
            "That awkward moment when you wave back at someone waving behind you",
            "When you're the only one who didn't get the joke",
            "Me trying to act natural after doing something embarrassing",
            "When you realize you've been overthinking everything",
            "My face when someone says 'It's easy'",
            "When you accidentally unmute yourself during a meeting",
            "Me pretending to understand the plot of Inception",
            "When you see your weird search history in front of others",
            "My reaction when someone calls me an adult",
            "When you find out your favorite restaurant closed",
            "Me trying to pretend I understand modern art",
            "When you accidentally reveal you've been stalking their Instagram",
            "My brain trying to remember where I parked",
            "When you realize you've been using the wrong formula",
            "My reaction to 'We should definitely do this more often'",
            "When someone says they actually enjoy Mondays",
            "Me trying to act natural when someone catches me singing",
            "When you realize you've been overthinking a simple question",
            "My reaction to 'It's not about the money'",
            "When someone says they prefer books over movies",
            "Me trying to look professional while eating a messy sandwich",
            "When you accidentally reveal you've been using the wrong formula in Excel",
            "My reaction to 'Some assembly required'",
            "When someone asks me to explain TikTok dances",
            "Me trying to look cool while struggling with technology",
            "When you realize you've been the third wheel all along",
            "My face when someone says they love pineapple on pizza",
            "When you accidentally send a text to the wrong person",
            "Me trying to pretend I understand cryptocurrency",
            "When you realize you've been using the wrong entrance",
            "My reaction to 'Let's split the check evenly'",
            "When someone says they don't need Google Maps",
            "Me trying to act like I planned to be this late",
            "When you see someone from high school who looks exactly the same",
            "My face when the elevator stops at every floor",
            "When you realize you've been overthinking your outfit choice",
            "Me trying to act like I meant to do that",
            "When you accidentally send a voice message instead of text",
            "My reaction to finding out someone has never seen your favorite movie",
            "When you accidentally send a voice message instead of text",
            "My reaction to finding out someone has never seen your favorite movie",
            "When you realize you've been overthinking a simple problem",
            "Me trying to explain why I have 47 browser tabs open",
            "When you see someone wearing Crocs unironically",
            "My brain at 3 AM making important life decisions",
            "When you finally understand a meme format",
            "Me pretending to be interested in small talk",
            "When you realize you're becoming your parents",
            "My reaction to 'Do you have a moment to talk?'",
            "When you find out your coworker makes more than you",
            "Me trying to look busy during the last hour of work",
            "When someone says they don't use social media",
            "My patience with people who walk slowly in hallways",
            "When you realize you've been mispronouncing someone's name",
            "Me trying to act natural after an awkward silence",
            "When you see your ex at the grocery store",
            "My reaction to 'Can you work this weekend?'",
            "When someone spoils a movie you haven't seen yet",
            "Me trying to remember if I locked my car",
            "When you realize you've been overthinking everything",
            "My face when someone says they prefer Internet Explorer",
            "When you accidentally like someone's old Instagram post",
            "Me trying to explain cryptocurrency to my parents",
            "When you see someone using a flip phone in 2024",
            "My reaction to 'This meeting could have been an email'",
            "When you realize you've been singing the wrong lyrics",
            "Me trying to parallel park with people watching",
            "When someone asks what you did during quarantine",
            "My energy levels before and after coffee",
            "When you see someone not wearing a mask in 2020",
            "Me trying to understand Gen Z slang",
            "When you realize you're the oldest person in the room",
            "My reaction to 'Back in my day...'",
            "When someone says they don't tip",
            "Me trying to explain why I need so many streaming services",
            "When you see someone double-dipping at a party",
            "My face when the WiFi goes out during a video call",
            "When you realize you've been putting the USB in upside down",
            "Me trying to act surprised at my own surprise party",
            "When someone says they prefer pineapple on pizza",
            "My reaction to 'Let's just agree to disagree'",
            "When you see someone texting while driving",
            "Me trying to remember where I put my glasses",
            "When you realize you've been overthinking a text message",
            "My patience with people who don't use turn signals",
            "When someone says they love Mondays",
            "Me trying to look professional on a video call",
            "When you see someone cutting in line",
            "My reaction to 'Can I speak to your manager?'",
            "When you realize you've been procrastinating for hours",
            "Me trying to act like I understand modern art",
            "When someone says they don't believe in tipping",
            "My face when I see my screen time report",
            "When you realize you've been using the wrong formula",
            "Me trying to explain why I need 47 apps on my phone",
            "When someone says they prefer books over movies",
            "My reaction to 'It's not about the money'",
            "When you see someone wearing socks with sandals",
            "Me trying to remember why I walked into this room",
            "When you realize you've been overthinking your outfit",
            "My patience with people who chew loudly",
            "When someone says they don't need GPS",
            "Me trying to act like I meant to do that",
            "When you see someone not returning their shopping cart",
            "My reaction to 'Some assembly required'",
            "When you realize you've been using the wrong entrance",
            "Me trying to explain why I collect random things",
            "When someone says they actually enjoy traffic",
            "My face when I realize I've been on mute the whole time",
            "When you see someone not washing their hands",
            "Me trying to act natural when I see my crush",
            "When you realize you've been overthinking a simple question",
            "My reaction to 'Let's just wing it'",
            "When someone says they prefer cold pizza",
            "Me trying to remember if I turned off the stove",
            "When you see someone talking loudly on speakerphone",
            "My patience with people who don't pick up after their pets",
            "When you realize you've been singing in the wrong key",
            "Me trying to act like I understand the stock market",
            "When someone says they don't like chocolate",
            "My reaction to 'Money doesn't buy happiness'",
            "When you see someone double-parking",
            "Me trying to remember the lyrics to my favorite song",
            "When you realize you've been overthinking social media posts",
            "My face when I see someone not wearing a seatbelt",
            "When someone says they prefer warm soda",
            "Me trying to act professional while eating a messy lunch",
            "When you see someone littering",
            "My reaction to 'It's just a phase'",
            "When you realize you've been using the wrong password",
            "Me trying to explain why I have trust issues",
            "When someone says they don't like music",
            "My patience with people who don't hold elevators",
            "When you see someone not tipping their server",
            "Me trying to act like I remember their name",
            "When you realize you've been overthinking everything again",
            "My reaction to 'Calm down'",
            "When someone says they prefer dial-up internet",
            "Me trying to remember where I parked my car",
            "When you see someone using Internet Explorer voluntarily",
            "My face when I realize I've been breathing manually",
            "When someone says they don't believe in evolution",
            "Me trying to act like I understand quantum physics",
            "When you realize you've been blinking manually too",
            "My reaction to 'Everything happens for a reason'",
            "When someone says they prefer Windows Vista",
            "Me trying to explain why I hoard memes"
        ];
    }

    getRandomMeme() {
        return this.memes[Math.floor(Math.random() * this.memes.length)];
    }

    generateCaptionsForPlayers(players, judgeId) {
        const playerCaptions = {};
        
        players.forEach(player => {
            if (player.id !== judgeId) {
                playerCaptions[player.id] = [];
                const availableCaptions = [...this.captionPool];
                
                // Randomly select 3 unique captions for this player
                for (let i = 0; i < 3; i++) {
                    const randomIndex = Math.floor(Math.random() * availableCaptions.length);
                    playerCaptions[player.id].push(availableCaptions[randomIndex]);
                    // Remove selected caption to ensure uniqueness for this player
                    availableCaptions.splice(randomIndex, 1);
                }
            }
        });

        return playerCaptions;
    }

    setMemePack(packName) {
        if (this.memePacks[packName]) {
            this.currentMemePack = packName;
            this.memes = this.memePacks[packName];
        }
    }

    addMeme(packName, meme) {
        if (!this.memePacks[packName]) {
            this.memePacks[packName] = [];
        }
        this.memePacks[packName].push(meme);
        
        // Save to localStorage
        this.saveCustomContent();
    }

    deleteMeme(pack, index) {
        if (this.memePacks[pack] && this.memePacks[pack][index]) {
            const meme = this.memePacks[pack][index];
            
            // If it's a local meme, delete from IndexedDB
            if (meme.isLocal && meme.id) {
                this.deleteLocalMeme(meme.id);
            }
            
            this.memePacks[pack].splice(index, 1);
            
            // Update current memes if this pack is selected
            if (this.currentMemePack === pack) {
                this.memes = this.memePacks[pack];
            }
            
            // Save to localStorage
            this.saveCustomContent();
        }
    }

    addCaption(caption) {
        this.captionPool.push(caption);
        this.saveCustomContent();
    }

    deleteCaption(index) {
        if (this.captionPool[index]) {
            this.captionPool.splice(index, 1);
            this.saveCustomContent();
        }
    }

    saveCustomContent() {
        const customContent = {
            memePacks: this.memePacks,
            captionPool: this.captionPool
        };
        localStorage.setItem('customGameContent', JSON.stringify(customContent));
    }

    async loadCustomContent() {
        const saved = localStorage.getItem('customGameContent');
        if (saved) {
            try {
                const customContent = JSON.parse(saved);
                if (customContent.memePacks) {
                    this.memePacks = { ...this.memePacks, ...customContent.memePacks };
                }
                if (customContent.captionPool) {
                    this.captionPool = customContent.captionPool;
                }
            } catch (error) {
                console.error('Error loading custom content:', error);
            }
        }
        
        // Load local memes from IndexedDB
        try {
            await this.loadLocalMemes();
        } catch (error) {
            console.error('Error loading local memes:', error);
        }
    }
}