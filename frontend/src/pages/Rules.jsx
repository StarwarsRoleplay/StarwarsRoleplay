import React, { useState } from 'react';

const INGAME_RULES = [
    {
        section: "Definitions",
        rules: [
            "IC (In Character): Everything that happens within the Star Wars Roleplay game world and relates to roleplay.",
            "OOC (Out of Character): Everything that happens outside the roleplay context or concerns topics unrelated to in-character gameplay."
        ]
    },
    {
        section: "§1 Scope",
        rules: [
            "§1.1 These rules apply to the Roblox experience “Star Wars Roleplay”.",
            "§1.2 By joining and playing Star Wars Roleplay, every player agrees to these rules.",
            "§1.4 The server team reserves the right to make changes to these rules or their scope at any time without prior notice.",
            "§1.5 Every player is responsible for staying informed about possible rule changes.",
            "§1.6 Roblox’s Terms of Use and Community Standards also apply and will be enforced accordingly.",
            "§1.7 Every player, regardless of their status, must follow these rules. No one has immunity from the rules."
        ]
    },
    {
        section: "§2 General Conduct",
        rules: [
            "§2.1 A generally friendly and respectful tone is expected.",
            "§2.2 Insulting, racist, discriminatory, sexist, misogynistic, hateful, or exclusionary statements or actions of any kind are strictly prohibited.",
            "§2.3 Bullying or exploiting other users is strictly prohibited and may be forwarded to Roblox where appropriate.",
            "§2.4 Forcing or pressuring other users—for example to obtain private information—is strictly prohibited.",
            "§2.5 Harassing players because of their status, origin, gender, beliefs, or similar characteristics is strictly prohibited."
        ]
    },
    {
        section: "§3 OOC Talk & Metagaming",
        rules: [
            "§3.1 OOC talk, meaning discussing out-of-character topics or referencing the rulebook during active roleplay, is prohibited.",
            "§3.2 Contacting staff members in-game about OOC matters such as support tickets is prohibited.",
            "§3.2.1 Impersonating a staff member is strictly prohibited and may result in a permanent community ban.",
            "§3.3 Metagaming, meaning the use of OOC information for IC decisions or actions, is prohibited."
        ]
    },
    {
        section: "§4 Chat and Voice Chat",
        rules: [
            "§4.1 Advertising external Discord servers, communities, or similar content in text chat or voice chat is not permitted.",
            "§4.2 Spamming of any kind in text chat is prohibited.",
            "§4.3 Excessive use of voice changers and soundboards is prohibited."
        ]
    },
    {
        section: "§5 Hacking, Bug Abuse & Trolling",
        rules: [
            "§5.1 The use of hacks, cheats, exploit software, or similar unfair tools is strictly prohibited.",
            "§5.2 Intentionally abusing bugs or glitches to gain an unfair advantage is prohibited.",
            "§5.3 Bunny hopping is strictly prohibited.",
            "§5.4 Trolling, meaning intentionally disrupting normal roleplay without valid in-character reason, is prohibited."
        ]
    },
    {
        section: "§6 Clothing, Avatar Standards, and Symbols",
        rules: [
            "§6.1 Any clothing, symbols, insignia, flags, facial hair styles, or other depictions associated with glorifying real-world extremist ideologies or the Second World War are prohibited.",
            "§6.2 Any clothing, symbols, insignia, flags, or other depictions that violate §7 or Roblox’s policies are strictly prohibited.",
            "§6.3 Characters and avatars must follow a semi-realistic standard appropriate for the Star Wars setting."
        ]
    },
    {
        section: "§7 Politics and Religion",
        rules: [
            "§7 The Star Wars Roleplay experience is a politics-free and religion-free space.",
            "§7.1 Political symbols, slogans, songs, or other comparable depictions are prohibited.",
            "§7.2 Opinion-shaping or propaganda-like depictions, such as campaign posters or similar material of any real-world political group, are prohibited.",
            "§7.3 An exception may be made for neutral lore-appropriate fictional faction symbols that are part of the Star Wars setting and officially supported by the game."
        ]
    },
    {
        section: "§8 RDM",
        rules: [
            "§8.1 RDM (Random Deathmatch), meaning attacking or killing another player without valid roleplay reason, is prohibited.",
            "§8.2 Attacking or killing unarmed players is prohibited.",
            "§8.3 Exception: Civilians or other non-military characters who are actively wanted under a valid kill order (KOS) or who are armed and open fire may be engaged.",
            "§8.4 Mass RDM, meaning killing or attacking four or more players in direct succession without valid roleplay justification, is prohibited."
        ]
    },
    {
        section: "§9 Weapons & Combat Actions",
        rules: [
            "§9.1 Weapons may only be used when there is a clear and valid roleplay reason, such as self-defense or an active combat situation.",
            "§9.2 Restricted armories, depots, or similar raid objectives may only be robbed by factions or teams that are explicitly allowed to do so by server design.",
            "§9.3 A combat situation begins as soon as a shot is fired or a player is actively threatened in a serious and recognizable way."
        ]
    },
    {
        section: "§10 Raid Rules",
        rules: [
            "§10.1 A raid begins once the attacking player or faction leaves its spawn area and actively moves toward the target base, facility, or objective.",
            "§10.2 A raid is considered failed once the attacker has been killed, incapacitated, or imprisoned according to server mechanics.",
            "§10.3 Attackers may only engage defenders or other clearly involved armed personnel during a raid.",
            "§10.4 Spawn camping in front of faction buildings or division headquarters is prohibited."
        ]
    },
    {
        section: "§11 FailRP",
        rules: [
            "§11 FailRP, meaning unrealistic or immersion-breaking behavior during roleplay, is prohibited.",
            "§11.1 Violations of division-specific or faction-specific rules may also be treated as FailRP.",
            "§11.2 Talking after death is prohibited.",
            "§11.3 Unnecessary provocation may be treated as FailRP.",
            "§11.4 Your character’s life is your highest value. FearRP must be respected at all times."
        ]
    },
    {
        section: "§12 Hostage Situations",
        rules: [
            "§12.1 Approved hostile factions or criminal roles may take civilians, troopers, or other players hostage if supported by the game mode.",
            "§12.2 The survival of the hostages has the highest priority.",
            "§12.3 If the attacker is aiming at a hostage and the threat is immediate, defenders may not recklessly shoot through the hostage situation. Doing so may count as FailRP.",
            "§12.4 Hostage situations may only begin outside of protected spawn areas unless a server event explicitly states otherwise."
        ]
    },
    {
        section: "§13–§19 Miscellaneous",
        rules: [
            "§13 Combat logging or leaving the game to avoid roleplay consequences is prohibited.",
            "§14 Leaving while involved in a support case is prohibited.",
            "§15 Restricted base areas, military compounds, or equivalent secure zones count as protected territory and must be respected according to server design.",
            "§16 Weapon vendors or weapon purchase systems may only be used by the roles or factions explicitly permitted by the game.",
            "§19 Recording Duty: Every player should be able to provide evidence recordings for rule violations when requested. A recording of approximately one minute before the incident is strongly recommended."
        ]
    },
    {
        section: "§20 FearRP & §21 NLR",
        rules: [
            "§20.1 FearRP: Realistic fear for your character’s life must be roleplayed appropriately.",
            "§21.1 New Life Rule (NLR): After death, your character does not remember the final events leading up to that death."
        ]
    }
];

const COMMUNITY_RULES = [
    {
        section: "§1 Scope",
        rules: [
            "§1.1 These rules apply to all Discord servers and forums operated by SWRP.",
            "§1.2 This includes, but is not limited to, the official Star Wars Roleplay Discord server.",
            "§1.3 By joining and using any of the above-mentioned servers, every user agrees to these general rules.",
            "§1.4 The server team reserves the right to make changes to these rules or their scope at any time without prior notice. Changes will also be announced on the Discord server and take effect from the moment of announcement.",
            "§1.5 Every user is responsible for staying informed about possible rule changes.",
            "§1.6 Discord’s Terms of Service and Community Guidelines also apply and will be enforced accordingly.",
            "§1.7 Every user, regardless of their role or status, must follow these rules. No one has immunity from the rules, including staff members."
        ]
    },
    {
        section: "§2 Advertising & Spam",
        rules: [
            "§2.1 Advertising external Discord servers, communities, projects, or similar content is not allowed without explicit permission from the COO or higher.",
            "§2.2 Spamming of any kind is prohibited. This includes, among other things, the unnecessary repetition of messages or the excessive posting of emojis, GIFs, images, or similar content."
        ]
    },
    {
        section: "§3 General Conduct",
        rules: [
            "§3.1 A generally friendly and respectful tone is expected at all times. Disruptive or intentionally provocative behavior is not tolerated.",
            "§3.2 Disruptive behavior or loud background noise in voice channels should be avoided whenever possible.",
            "§3.3 Insulting, racist, discriminatory, sexist, misogynistic, hateful, or exclusionary statements or actions of any kind are strictly prohibited.",
            "§3.4 Bullying, harassment, or taking advantage of other users is strictly prohibited and may, where applicable, result in legal consequences.",
            "§3.5 Coercion or pressuring others—for example to obtain private information or to force someone into doing something they do not want to do—is also strictly prohibited and may, where applicable, result in legal consequences."
        ]
    },
    {
        section: "§4 Youth Protection and NSFW (18+) Content",
        rules: [
            "§4.1 Uploading or sharing adult, explicit, or otherwise age-inappropriate content (NSFW 18+) in text or voice channels within the scope of these rules is strictly prohibited and will be punished accordingly.",
            "§4.2 The distribution, publication, or creation of child sexual abuse material is strictly prohibited and will be reported to the proper authorities without exception."
        ]
    },
    {
        section: "§5 Soundboards and Voice Changers",
        rules: [
            "§5.1 Excessive use of soundboards or voice changers in voice channels is prohibited."
        ]
    },
    {
        section: "§6 Religion and Politics",
        rules: [
            "§6.1 The Star Wars Roleplay community is intended to be a religion-free and politics-free space. Conversations and debates about these topics should therefore be kept to an absolute minimum.",
            "§6.2 Users with politically promotional profile pictures, usernames, or similar identifying elements may be asked to change them to something neutral. This is based on the server’s house rules within the scope of these regulations."
        ]
    },
    {
        section: "§7 Privacy and Personal Data",
        rules: [
            "§7.1 Sharing or distributing private personal data—such as full names, addresses, phone numbers, private photos, or similar information—about yourself or others is strictly prohibited and will be punished accordingly."
        ]
    },
    {
        section: "§8 Voice Channels",
        rules: [
            "§8.1 Constantly switching voice channels (“channel hopping”) is prohibited.",
            "§8.2 Abusing the “Move Members” permission to repeatedly move users around without reason is prohibited."
        ]
    },
    {
        section: "§9 Contacting Staff",
        rules: [
            "§9.1 Unnecessarily pinging staff members (@name) is prohibited and may result in a timeout.",
            "§9.2 Direct messaging staff members (DMs) regarding regular server matters is prohibited, may be ignored, and may also result in a timeout."
        ]
    },
    {
        section: "§10 Support & Verification",
        rules: [
            "§10.1 In order to open a support ticket, every player must first verify themselves through the designated verification channel. This is necessary to ensure a smooth process and to make support possible at all.",
            "§10.2 All users are instructed to report rule violations directly and secure evidence through video recordings or screenshots whenever possible.",
            "§10.3 The proportionality of a report should always be considered. Minor arguments or simple questions that could be answered in the appropriate channels do not require a support ticket."
        ]
    },
    {
        section: "§11 Usernames, Profile Pictures, and Banners",
        rules: [
            "§11.1 Offensive, misleading, or otherwise inappropriate usernames, profile pictures, or profile banners—especially those violating §3.3, §3.4, or §6—are prohibited. Every user is expected to change such content on their own when joining the server."
        ]
    },
    {
        section: "§12 Sanctions",
        rules: [
            "§12.1 Users who violate these rules may be punished with a warning, temporary punishment, or a temporary/permanent community ban.",
            "§12.2 The staff team reserves the right to issue punishments at its own discretion based on the severity of the rule violation."
        ]
    },
    {
        section: "§13 Duty to Report",
        rules: [
            "§13.1 Every user is required to report violations of these rules to the moderation or administration team without delay. Knowingly failing to report a serious violation may itself be treated as a rule violation."
        ]
    }
];

export default function Rules() {
    const [activeTab, setActiveTab] = useState('ingame');
    const [selectedSection, setSelectedSection] = useState(0);

    const data = activeTab === 'ingame' ? INGAME_RULES : COMMUNITY_RULES;

    return (
        <section className="w-full max-w-[1440px] mx-auto px-6 md:px-16 py-32 flex flex-col gap-16 bg-[#050505]">
            {/* Header */}
            <div className="flex flex-col gap-2 border-l-4 border-[#00f0ff] pl-6">
                <div className="font-mono text-[10px] font-medium text-[#00f0ff] uppercase tracking-[0.15em] mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#00f0ff] animate-pulse"></span>
                    HOLOCRON NETWORK
                </div>
                <h2 className="text-[32px] text-white font-bold uppercase leading-tight tracking-wider">
                    Galactic Regulations
                </h2>
                <p className="text-zinc-500 text-xs font-mono">ARCHIVE ACCESS // SECURE CONNECTION</p>
            </div>

            {/* Holocron Container */}
            <div className="flex flex-col lg:flex-row gap-8 min-h-[600px]">
                
                {/* Sidebar / Categories */}
                <div className="w-full lg:w-1/3 flex flex-col gap-4">
                    {/* Tabs */}
                    <div className="flex gap-2 border-b border-[#00f0ff]/20 pb-4">
                        <button 
                            onClick={() => { setActiveTab('ingame'); setSelectedSection(0); }}
                            className={`flex-1 py-2 font-mono text-xs uppercase tracking-wider border transition-all duration-300 ${activeTab === 'ingame' ? 'bg-[#00f0ff]/10 border-[#00f0ff] text-[#00f0ff]' : 'border-white/5 text-zinc-600 hover:text-white hover:border-white/20'}`}
                        >
                            In-Game Rules
                        </button>
                        <button 
                            onClick={() => { setActiveTab('community'); setSelectedSection(0); }}
                            className={`flex-1 py-2 font-mono text-xs uppercase tracking-wider border transition-all duration-300 ${activeTab === 'community' ? 'bg-[#00f0ff]/10 border-[#00f0ff] text-[#00f0ff]' : 'border-white/5 text-zinc-600 hover:text-white hover:border-white/20'}`}
                        >
                            Community Rules
                        </button>
                    </div>

                    {/* Section List */}
                    <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                        {data.map((item, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedSection(index)}
                                className={`w-full text-left p-4 bg-[#0a0a0a] border transition-all duration-300 flex items-center justify-between group ${selectedSection === index ? 'border-[#00f0ff]/50 bg-[#00f0ff]/5' : 'border-white/5 hover:border-[#00f0ff]/30'}`}
                                style={{
                                    clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)'
                                }}
                            >
                                <span className={`font-mono text-sm ${selectedSection === index ? 'text-[#00f0ff]' : 'text-white group-hover:text-[#00f0ff]'}`}>
                                    {item.section}
                                </span>
                                <span className={`text-xs font-mono ${selectedSection === index ? 'text-[#00f0ff]' : 'text-zinc-700'}`}>
                                    {String(index + 1).padStart(2, '0')}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Content Area (The "Projection") */}
                <div className="w-full lg:w-2/3 bg-[#0a0a0a] border border-[#00f0ff]/20 p-8 relative flex flex-col gap-6"
                     style={{
                         clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)',
                         backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,240,255,0.015) 0px, rgba(0,240,255,0.015) 1px, transparent 1px, transparent 2px)'
                     }}
                >
                    {/* Corner accents */}
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#00f0ff]"></div>
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#00f0ff]"></div>
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#00f0ff]"></div>
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#00f0ff]"></div>

                    {selectedSection !== null && data[selectedSection] ? (
                        <>
                            {/* Section Header */}
                            <div className="flex flex-col gap-1 border-b border-[#00f0ff]/10 pb-4">
                                <div className="font-mono text-[10px] text-[#00f0ff] uppercase tracking-[0.1em]">
                                    Data Block {String(selectedSection + 1).padStart(2, '0')}
                                </div>
                                <h3 className="text-xl text-white font-bold uppercase tracking-wide">
                                    {data[selectedSection].section}
                                </h3>
                            </div>

                            {/* Section Content */}
                            <div className="flex flex-col gap-4 text-zinc-400 text-sm font-sans leading-relaxed overflow-y-auto custom-scrollbar">
                                {data[selectedSection].rules.map((rule, idx) => (
                                    <div key={idx} className="flex gap-4 items-start">
                                        <span className="text-[#00f0ff] font-mono mt-1">▶</span>
                                        <p>{rule}</p>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center gap-4">
                            <div className="w-16 h-16 border-2 border-[#00f0ff]/30 rounded-full flex items-center justify-center animate-pulse">
                                <span className="text-[#00f0ff] text-2xl font-mono">!</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <h3 className="text-white font-bold uppercase tracking-wide">Select a Category</h3>
                                <p className="text-zinc-600 text-xs font-mono">Awaiting Holocron input...</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
