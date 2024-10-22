document.addEventListener('corru_entered', ()=>{
    env.COMBAT_ACTORS.ricardo = {
        slug: "ricardo",
        name: "Ricardo",
        readoutActor: "ricardo",
        maxhp: 3763,
        hp: 3763,
        state: 'living',
        actions: ["punchin", "kickin", "ally_assemble", "dom", "windup"],
        windupActions: ["coupons"],
        portrait: `<img class="portrait" src="[[https://file.garden/Zvmp0XAo2CYmToHG/RicardoActor2.png]]">`,
        portraitUrl: 'https://file.garden/Zvmp0XAo2CYmToHG/RicardoActor2.png',
         reactions: 
         { evade: ["Uhah!", "Missed.", "Close!"],
         crit: ["For The Middle!"],
          crit_buff: ["Here you go lad!", "This should patch you up."], 
          miss: ["Damn it..", "Fuck!", "My hair coupons.."], 
          dead: ["Well Damn."],
         puncture: ["The Middle.. Will not forget this..!"], 
          regen: ["Bravo!", "Thats better."],
         destabilized: ["What.. is this.."],
          stun: ["MY HAIR COUPONS!!", "no.. NO!!"],
           laugh: ["Hahah!", "Bravo, Bravo!!", "Keep squirming for me, will ya?", "Ahahahaha!!"], 
           receive_hit: ["The middle will not forget this.", "The audacity.."], 
           receive_crit: ["Goddamn it!", "You motherfucker.."], 
           receive_puncture: ["You think thats enough to stop me? Cute."], 
           receive_buff: ["Ah, thank you my friend.", "The Middle will not forget this, friend!"], 
           receive_destabilized: ["Heh, this feels new."], 
           receive_rez: ["You really didn't have to do that, but okay!"], 
           receive_carapace: ["I feel Brand New!", "Im INVINCIBLE!"], 
           receive_repairs: ["What is this strange device?", "Thank you, strange drone."], 
           receive_fear: ["no.. no no NO..", "ENOUGH!!!", "That.. wouldn't happen.."],
           receive_redirection: ["More meatshields, the better."], 
        }, 
           initialStatusEffects: [["veng", 1]],
    }
    
    page.party.push({
        slug: "ricardo",
        name: "Ricardo",
        class: "The Middle's Big Brother",
        hp: 3763,
        combatActor: "ricardo"
    }),

env.STATUS_EFFECTS['veng'] = {
    slug: "veng",
    name: "Vengeance",
    help: "the middle never forgets.",
    infinite: true
},

env.STATUS_EFFECTS['test'] = { 
        slug: "test",
        name: "Test Of The Big Brother",
        outgoingToHit: 0.5,
        outgoingCrit: 0.5,
        beneficial: true,
        tickType: "onTurnEnd",
        help: "+50% hit%, +50% crit%",
        removes: ["weakened", "fear"],
        opposite: "fear"
},

env.STATUS_EFFECTS.ally_ethereal = {
    slug: "ally_ethereal",
    name: "Ethereal",
    help: "disappear on death",
    infinite: true,
    events: {
        onDeath: function() {
            setTimeout(()=>midCombatAllyRemove(this.status.affecting), 600)
        },
    }
},

env.ACTIONS['kickinhit'] = {
    slug: "kickinhit",
    name: "Kick",
    type: 'target',
    desc: "but heres the kicker",
    anim: "wobble",
    help: "StATS CAN BE FOUND ON KICKING ACTION",
    usage: {
        act: "%USER KICKS %TARGET",
        hit: "%TARGET GETS KICKED WITH RAW STRENGTH",
        crit: "%TARGET IS KNOCKED BACK",
        miss: "%TARGET IS NEARLY STRUCK",
    },
    accuracy: 0.7,
    crit: 0.1,
    amt: 2,
    exec: function(user, target) {
        return env.GENERIC_ACTIONS.singleTarget({
            action: this, 
            user, 
            target,
            critStatus: {
                name: 'stun',
                length: 1
            },
        })
    }
}

env.ACTIONS['kickin'] = {
    slug: "kickin",
    name: "Kicking",
    type: 'target',
    desc: "'deal immense physical trauma with kicks'",
    anim: "wobble",
    help: "70%C 3X -2HP 10%C 1T::STUN",
    usage: {
        act: "%USER PREPARES THEIR LEGS"
    },
    accuracy: 1,
    crit: 0,
    amt: 0,
    exec: function(user, target) {
        for(let i = 0; i < 3; i++){
            env.setTimeout(()=>{
                useAction(user, env.ACTIONS.kickinhit, target, {beingUsedAsync: true, reason: "kickin"})
             }, 500 * i)
        }
    }
},

env.ACTIONS['punchinhit'] = {
    slug: "punchinhit",
    name: "Punch",
    type: 'target',
    desc: "but heres the puncher",
    anim: "wobble",
    help: "STATS CAN BE FOUND ON PUNCHING ACTION",
    usage: {
        act: "%USER PUNCHES %TARGET",
        hit: "%TARGET IS BRUISED",
        crit: "%TARGET IS BRUISED BADLY",
        miss: "%TARGET IS NEARLY STRUCK",
    },
    accuracy: 0.5,
    crit: 0.05,
    amt: 3,
    exec: function(user, target) {
        return env.GENERIC_ACTIONS.singleTarget({
            action: this, 
            user, 
            target,
            hitStatus: {
                name: 'puncture',
                length: 2
            },

            critStatus: {
                name: 'rot',
                length: 2
            },
        })
    }
}

env.ACTIONS['punchin'] = {
    slug: "punchin",
    name: "Punching",
    type: 'target',
    desc: "'deal immense physical trauma with punches'",
    anim: "wobble",
    help: "50%C 3X -3HP 2T::PUNCTURE 5%C 2T::ROT",
    usage: {
        act: "%USER WINDS UP THEIR FISTS"
    },
    accuracy: 1,
    crit: 0,
    amt: 0,
    exec: function(user, target) {
        for(let i = 0; i < 3; i++){
            env.setTimeout(()=>{
                useAction(user, env.ACTIONS.punchinhit, target, {beingUsedAsync: true, reason: "punchin"})
             }, 500 * i)
        }
    }
},

env.ACTIONS['ally_assemble'] = {
    slug: "ally_assemble",
    name: "Assemble",
    type: 'special+summon',
    desc: "'grab and assemble henchmen from elsewhere'",
    help: "SUMMON::2 HENCHMEN (MAX:4-2)",
    anim: "heal",
    accuracy: 1,
    crit: 0,
    noRepeat: true,
    exec: function(user, target) {
        addStatus({target: user, status: "test", length: 2});
        actionMessage(user, "%USER ASSEMBLES HENCHMEN", target, 'none', 2000);
        play('dull', 0.8, 1);
        
        //try to center the dude
        if(user.team.members.length == 5) {
            let uI = user.team.members.findIndex(a => a.slug == user.slug)
            if(uI < 3) midCombatEnemyAdd('henchmena_ally', 'left')
            else if(uI >= 3) midCombatEnemyAdd('henchmenb_ally', 'right')
        } else {
            midCombatEnemyAdd('henchmena_ally', 'left')
            midCombatEnemyAdd('henchmenb_ally', 'right')
        }

        setTimeout(()=>advanceTurn(user), 1000)
    },
    disableIf: (actor) => {return actor.team.members.length >=4}
},

env.ACTIONS['dom'] = {
        slug: "dom",
        name: "Domineer",
        type: 'self',
        desc: "'use fists as strong shield'",
        help: "SELF::+60 BP",
        anim: "cloak-barrier",
        autohit: true,
        crit: 0,
        amt: 60,
        usage: {
            act: "%USER USES THEIR FISTS AS A SHIELD"
        },
        exec: function(user, target) {
            addStatus({target: user, status: "test", length: 2});
            return env.GENERIC_ACTIONS.singleTarget({
                benefical: true,
                type: 'barrier',
                action: this, 
                user, 
                target: user,
                hitSfx: {
                    name: 'guard',
                    rate: 0.9
                },
            })
        },
        disableIf: (actor) => {return actor.team.members.length >= 2}
    },
    
    env.COMBAT_ACTORS.henchmena_ally = {
        slug: "henchmena_ally",
        name: "Sturdy Little Brother Of The Middle",
        readoutActor: "henchmena_ally",
        maxhp: 18,
        hp: 18,
        state: 'living',
        actions: ["solarplex", "skullcrush", "write"],
        portrait: `<img class="portrait" src="[[https://file.garden/Zvmp0XAo2CYmToHG/sturdyactorr.png]]">`,
        portraitUrl: 'https://file.garden/Zvmp0XAo2CYmToHG/sturdyactorr.png',
        reactions: {}, //silent bro
        initialStatusEffects: [["veng", 1], ["ally_ethereal", 1]],
    },

    env.COMBAT_ACTORS.henchmenb_ally = {
        slug: "henchmenb_ally",
        name: "Stern Little Brother Of The Middle",
        readoutActor: "henchmenb_ally",
        maxhp: 16,
        hp: 16,
        state: 'living',
        actions: ["solarplex", "skullcrush", "write"],
        portrait: `<img class="portrait" src="[[https://file.garden/Zvmp0XAo2CYmToHG/sturdyactorr.png]]">`,
        portraitUrl: 'https://file.garden/Zvmp0XAo2CYmToHG/sturdyactorr.png',
        reactions: {}, //silent bro
        initialStatusEffects: [["veng", 1], ["ally_ethereal", 1]],
    },

    env.ACTIONS['write'] = {
        slug: "write",
        name: "Ready To Write",
        type: 'self',
        desc: "'use fists as a shield'",
        help: "SELF::+4 BP",
        anim: "cloak-barrier",
        autohit: true,
        crit: 0,
        amt: 4,
        usage: {
            act: "%USER USES THEIR FISTS AS A SHIELD"
        },
        exec: function(user, target) {
            return env.GENERIC_ACTIONS.singleTarget({
                benefical: true,
                type: 'barrier',
                action: this, 
                user,
                target: user,
                hitSfx: {
                    name: 'guard',
                    rate: 0.9
                },
            })
        }
    },

env.ACTIONS['solarplex'] = {
        slug: "solarplex",
        name: "Right in the Solar Plexus",
        type: 'target',
        desc: "'send your fist flying at target's head';'chance for immense physical trauma'",
        anim: "basic-attack",
        help: "60% -4HP, 10%C x2 +1T:STUN",
        usage: {
            act: "%USER CHARGES THEIR FIST AT %TARGET'S HEAD",
            crit: "%TARGET IS LEFT REELING",
            hit: "%TARGET IS STRUCK",
            miss: "%TARGET EVADES"
        },
        accuracy: 0.6,
        crit: 0.1,
        amt: 4,
        exec: function(user, target) {
            return env.GENERIC_ACTIONS.singleTarget({
                action: this, 
                user, 
                target,
                critStatus: {
                    name: 'stun',
                    length: 1
                }
            })
        }
    },

    env.ACTIONS['skullbursthit'] = {
        slug: "skullbursthit",
        name: "Skull Burst Hit",
        type: 'target',
        desc: "but heres the puncher",
        anim: "wobble",
        help: "STATS CAN BE FOUND ON SKULL BURSTING ACTION",
        usage: {
            act: "%USER PUNCHES %TARGET",
            hit: "%TARGET IS BRUISED",
            crit: "%TARGET HAS THEIR SKULL HURTING BADLY",
            miss: "%TARGET IS NEARLY STRUCK",
        },
        accuracy: 0.5,
        crit: 0.05,
        amt: 2,
        exec: function(user, target) {
            return env.GENERIC_ACTIONS.singleTarget({
                action: this, 
                user, 
                target,
                critStatus: {
                    name: 'stun',
                    length: 1
                },
            })
        }
    },
    
    env.ACTIONS['skullburst'] = {
        slug: "skullburst",
        name: "Skull Bursting",
        type: 'target',
        desc: "'deal immense physical trauma with punches'",
        anim: "wobble",
        help: "50%C x2 -2HP 5%C -4HP 1T::STUN",
        usage: {
            act: "%USER WINDS UP THEIR FISTS"
        },
        accuracy: 1,
        crit: 0,
        amt: 0,
        exec: function(user, target) {
            for(let i = 0; i < 2; i++){
                env.setTimeout(()=>{
                    useAction(user, env.ACTIONS.skullbursthit, target, {beingUsedAsync: true, reason: "skullburst"})
                 }, 400 * i)
            }
        }
    },

    env.ACTIONS['skullcrushhit'] = {
        slug: "skullcrushhit",
        name: "Skull Crush Hit",
        type: 'target',
        desc: "but heres the puncher",
        anim: "wobble",
        help: "STATS CAN BE FOUND ON SKULL CRUSHING ACTION",
        usage: {
            act: "%USER PUNCHES %TARGET",
            hit: "%TARGET IS BRUISED",
            crit: "%TARGET HAS THEIR SKULL HURTING BADLY",
            miss: "%TARGET IS NEARLY STRUCK",
        },
        accuracy: 0.5,
        crit: 0.05,
        amt: 2,
        exec: function(user, target) {
            return env.GENERIC_ACTIONS.singleTarget({
                action: this, 
                user, 
                target,
                critStatus: {
                    name: 'stun',
                    length: 1
                },
            })
        }
    },
    
    env.ACTIONS['skullcrush'] = {
        slug: "skullcrush",
        name: "Skull Crushing",
        type: 'target',
        desc: "'deal immense physical trauma with punches'",
        anim: "wobble",
        help: "50%C x2 -2HP 5%C -4HP 1T::STUN",
        usage: {
            act: "%USER WINDS UP THEIR FISTS"
        },
        accuracy: 1,
        crit: 0,
        amt: 0,
        exec: function(user, target) {
            for(let i = 0; i < 2; i++){
                env.setTimeout(()=>{
                    useAction(user, env.ACTIONS.skullcrushhit, target, {beingUsedAsync: true, reason: "skullcrush"})
                 },400 * i)
            }
        }
    },

    env.ACTIONS['coupons'] = {
        slug: "coupons",
        name: "MY HAIR COUPOOOOOOOOOOONS!!!",
        type: 'support+target',
        desc: "'charge up a punch and then slam the ground with it';'creating powerful shockwave'",
        help: "ALL TARGETS:: 80%C -5HP 5T::PUNCTURE",
        anim: "wobble",
        accuracy: 0.8,
        crit: 0,
        amt: 5,
        usage: {
            act: "%USER CHARGES AND SLAMS THEIR FIST ON THE GROUND",
            miss: "%TARGET DODGES JUST IN TIME"
        },
        exec: function(user, target, beingUsedAsync) {
            addStatus({target: user, status: "test", length: 3});
            removeStatus(user, "windup")
            
            actions = actions.filter(actionSlug=>{
                let action = env.ACTIONS[actionSlug]
                if(
                    action.type.includes("summon") ||
                    action.type.includes("nomimic") ||
                    action.slug.includes("incoherent")
                ) return false;
                
                return true
            })

            let action = this
            if(user.sprite) user.sprite.classList.add("basic-attack")
            env.GENERIC_ACTIONS.teamWave({
                team: user.enemyTeam,
                extraDelay: 1,
                exec: (actor, i) => {
                    let baseDelay = ((env.ADVANCE_RATE * 2.0) * i)
                    if(actor.slug == user.slug) return
                    env.GENERIC_ACTIONS.singleTarget({
                        action, 
                        user, 
                        target: actor,
                        hitSfx: {
                            name: 'crit',
                            rate: 1
                        },
                        hitExec: ({target})=>{
                            addStatus({target, origin: user, status: "puncture", length: 5})
                        }                
                    })
                },
                advanceAfterExec: true, beingUsedAsync, user,
            })
        }
    }
})