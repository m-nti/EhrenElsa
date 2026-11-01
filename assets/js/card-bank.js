/* Elsen — card bank.
   The supplied photos own their name, mood, caption and alt text in
   photos/captions.json. This file supplies bilingual fallback copy, rarity
   labels and explicitly imaginary, manually photo-matched play values.
   German and English arrays are index-aligned: index N in German is the same
   joke as index N in English, so a card keeps its idea when the language flips.
   Plain ES5, no imports, no exports: it only sets window.ELSA_CARD_BANK. */

(function () {
  "use strict";

  var lines = {
    de: [
      "Sie liegt so, als hätte sie das Sofa selbst entworfen.",
      "Der Blick sagt: du bist zu spät, und das mit Recht.",
      "Ein Ohr steht Wache, das andere hat schon Feierabend.",
      "Sie hat den Stock gefunden. Es ist jetzt ihrer.",
      "Im Vorgarten gilt sie als zuständig. Für alles.",
      "Nass bis auf die Haut, und keine Spur von Reue.",
      "Diese Pose hat sie vorher geübt. Man sieht es.",
      "Sie wartet, und zwar direkt vor dem leeren Napf.",
      "Ein Hund mit Plan, und der Plan heißt buddeln.",
      "Dem Ball gehört ihre ganze Aufmerksamkeit, dir die Hälfte.",
      "Sie sitzt so brav, dass man misstrauisch wird.",
      "Mitten im Laub, und überzeugt, dass es ihres ist.",
      "Der Mittagsschlaf hat sie mitten im Gedanken überfallen.",
      "Sie riecht etwas, das du beim besten Willen nicht riechst.",
      "Sie hört dir zu. Sie überlegt es sich noch.",
      "Das Fell glänzt, die Wiese klebt, alle sind zufrieden.",
      "Sie trägt einen Stein, als gehöre er ins Museum.",
      "Zwei Sekunden, bevor sie dich umrennt.",
      "Sie kennt den Weg und geht trotzdem woanders.",
      "Der Schwanz schreibt Sätze, die keiner übersetzen kann.",
      "Sonnenplatz besetzt, ein Ohr bleibt offen.",
      "So sieht sie aus, wenn sie recht behalten hat.",
      "Sie bewacht die Tür. Die Tür weiß es nur noch nicht.",
      "Nach dem Regen riecht sie nach nassem Hund und Stolz.",
      "Ein Spaziergang, mindestens. Das ist ihre Position.",
      "Sie gräbt mit dem Ernst einer Archäologin.",
      "Kopf schief, weil du einen Satz zu viel gesagt hast.",
      "Auf dieser Decke liegt sonst niemand. Nur sie.",
      "Sie schläft tief, aber die Ohren arbeiten weiter.",
      "Beim Anblick des Leckerlis ist die Welt wieder in Ordnung."
    ],
    en: [
      "She lies there as if she had designed the sofa herself.",
      "That look says you are late, and quite rightly so.",
      "One ear on guard, the other already clocked off.",
      "She found the stick. It belongs to her now.",
      "In the front garden she considers herself in charge. Of everything.",
      "Soaked to the skin and not a scrap of regret.",
      "She rehearsed this pose. It shows.",
      "She is waiting, right next to the empty bowl.",
      "A dog with a plan, and the plan is digging.",
      "The ball gets all of her attention. You get about half.",
      "She sits so nicely that it makes you suspicious.",
      "Right in the leaves and convinced they are hers.",
      "The nap caught up with her mid-thought.",
      "She can smell something you could not find if you tried.",
      "She is listening to you. She is still deciding.",
      "The coat is glossy, the meadow is stuck to it, everyone is happy.",
      "She carries a stone like it belongs behind glass.",
      "Two seconds before she knocks you over.",
      "She knows the way and is walking somewhere else.",
      "The tail is writing sentences nobody can translate.",
      "Sunny spot taken, one ear still open.",
      "This is the face of someone who has been right all along.",
      "She is guarding the door. The door does not know yet.",
      "After the rain she smells of wet dog and pride.",
      "One walk at least. That is her position.",
      "She digs with the seriousness of an archaeologist.",
      "Head tilted because you used one sentence too many.",
      "Nobody else is allowed on this blanket. Just her.",
      "Fast asleep, and the ears are still on shift.",
      "At the sight of the treat, all is well again."
    ]
  };

  var moods = {
    de: [
      "königlich gelangweilt",
      "hochalarmiert",
      "tiefenentspannt",
      "stur und munter",
      "unaufhaltsam",
      "prüfend",
      "hoffnungsvoll",
      "tropfnass",
      "beleidigt",
      "stolz",
      "wild entschlossen",
      "schläfrig",
      "treu dabei",
      "leicht überrascht"
    ],
    en: [
      "royally bored",
      "fully alarmed",
      "deeply relaxed",
      "stubbornly perky",
      "unstoppable",
      "assessing you",
      "hopeful",
      "soaking wet",
      "sulking",
      "proud",
      "wildly determined",
      "sleepy",
      "loyally present",
      "mildly shocked"
    ]
  };

  var names = {
    de: [
      "Sofa-Königin",
      "Chefermittlerin im Vorgarten",
      "Ministerin für Mittagsschlaf",
      "Amtliche Leckerli-Prüferin",
      "Leiterin der Ballbeschaffung",
      "Nachtwache mit zwei Ohren",
      "Ausgräberin erster Klasse",
      "Hausmeisterin des Flurs",
      "Sonderbeauftragte für Sonnenflecken",
      "Vorsteherin des Begrüßungskomitees",
      "Wildhüterin mit weichen Pfoten",
      "Meisterdetektivin im Gras",
      "Erste Dame am Futternapf",
      "Hüterin der verlorenen Socken",
      "Archivarin für Fundstücke",
      "Wanderführerin mit Umwegen",
      "Unwetterwarnung, Stufe Pfote",
      "Inspektorin für Tischhöhe",
      "Hofnärrin mit Fell",
      "Badegast des Jahres",
      "Pächterin des Schattenplatzes",
      "Gesandte für Kuscheleinheiten",
      "Hauptverdächtige, immer",
      "Wächterin der Keksdose"
    ],
    en: [
      "Sofa Queen",
      "Head Investigator, Front Garden",
      "Minister of Naps",
      "Official Treat Taster",
      "Head of Ball Procurement",
      "Night Watch, Both Ears",
      "Excavator, First Class",
      "Caretaker of the Hallway",
      "Special Envoy for Sunbeams",
      "Chair of the Welcome Committee",
      "Gamekeeper with Soft Paws",
      "Master Detective in the Grass",
      "First Lady of the Food Bowl",
      "Keeper of the Missing Socks",
      "Archivist of Found Objects",
      "Trail Guide, Detours Included",
      "Weather Warning, Paw Level",
      "Inspector of Table Height",
      "Court Jester in Fur",
      "Bather of the Year",
      "Tenant of the Shady Spot",
      "Envoy for Cuddle Duties",
      "Prime Suspect, Always",
      "Guardian of the Biscuit Tin"
    ]
  };

  // Scores are editorial jokes, not claims about Elsa's abilities. Labels and
  // values are matched to the visible pose in each supplied image.
  var photoTraits = {
    de: {
      "233A150F-1A63-408F-B8A6-6852E8CEC51B.jpg": [
        { key: "Schlafmodus", value: 10 }, { key: "Deckenbindung", value: 10 }, { key: "Blickkontakt", value: 1 }
      ],
      "elsa-01.jpg": [
        { key: "Blickkontakt", value: 10 }, { key: "Aufmerksamkeit", value: 9 }, { key: "Sofakomfort", value: 9 }
      ],
      "IMG_0018.jpeg": [
        { key: "Höhlenfaktor", value: 9 }, { key: "Spähblick", value: 8 }, { key: "Deckenbindung", value: 10 }
      ],
      "IMG_0132.jpeg": [
        { key: "Kuschelfaktor", value: 10 }, { key: "Deckenbindung", value: 10 }, { key: "Spähblick", value: 7 }
      ],
      "IMG_0155.jpeg": [
        { key: "Versteckspiel", value: 9 }, { key: "Kuschelmodus", value: 10 }, { key: "Wachsamkeit", value: 6 }
      ],
      "IMG_2092.jpeg": [
        { key: "Spähblick", value: 9 }, { key: "Deckenrand", value: 10 }, { key: "Geduld", value: 8 }
      ],
      "IMG_2225.JPG": [
        { key: "Pfoten-Parkplatz", value: 10 }, { key: "Ruhemodus", value: 9 }, { key: "Blickkontakt", value: 6 }
      ],
      "IMG_9319.jpeg": [
        { key: "Ein-Auge-Wache", value: 10 }, { key: "Schlafmodus", value: 9 }, { key: "Deckenbindung", value: 10 }
      ],
      "IMG_9454.jpeg": [
        { key: "Kissenversteck", value: 10 }, { key: "Blickkontakt", value: 8 }, { key: "Unauffälligkeit", value: 2 }
      ],
      "IMG_9949.jpeg": [
        { key: "Sonnenplatz", value: 10 }, { key: "Ruhemodus", value: 8 }, { key: "Blickkontakt", value: 7 }
      ]
    },
    en: {
      "233A150F-1A63-408F-B8A6-6852E8CEC51B.jpg": [
        { key: "Nap mode", value: 10 }, { key: "Duvet loyalty", value: 10 }, { key: "Eye contact", value: 1 }
      ],
      "elsa-01.jpg": [
        { key: "Eye contact", value: 10 }, { key: "Attention", value: 9 }, { key: "Sofa comfort", value: 9 }
      ],
      "IMG_0018.jpeg": [
        { key: "Cave factor", value: 9 }, { key: "Sneaky peek", value: 8 }, { key: "Duvet loyalty", value: 10 }
      ],
      "IMG_0132.jpeg": [
        { key: "Cuddle factor", value: 10 }, { key: "Duvet loyalty", value: 10 }, { key: "Sneaky peek", value: 7 }
      ],
      "IMG_0155.jpeg": [
        { key: "Hide-and-seek", value: 9 }, { key: "Cuddle mode", value: 10 }, { key: "One-eye watch", value: 6 }
      ],
      "IMG_2092.jpeg": [
        { key: "Sneaky peek", value: 9 }, { key: "Duvet edge", value: 10 }, { key: "Patience", value: 8 }
      ],
      "IMG_2225.JPG": [
        { key: "Paw parking", value: 10 }, { key: "Rest mode", value: 9 }, { key: "Eye contact", value: 6 }
      ],
      "IMG_9319.jpeg": [
        { key: "One-eye watch", value: 10 }, { key: "Nap mode", value: 9 }, { key: "Duvet loyalty", value: 10 }
      ],
      "IMG_9454.jpeg": [
        { key: "Cushion hideout", value: 10 }, { key: "Eye contact", value: 8 }, { key: "Stealth", value: 2 }
      ],
      "IMG_9949.jpeg": [
        { key: "Sunspot", value: 10 }, { key: "Rest mode", value: 8 }, { key: "Eye contact", value: 7 }
      ]
    }
  };

  var rarities = {
    common: {
      label: { de: "Häufig", en: "Common" }
    },
    rare: {
      label: { de: "Selten", en: "Rare" }
    },
    holo: {
      label: { de: "Holo-Pracht", en: "Holo glory" }
    }
  };

  window.ELSA_CARD_BANK = {
    de: {
      lines: lines.de,
      moods: moods.de,
      names: names.de,
      photoTraits: photoTraits.de,
      rarities: rarities
    },
    en: {
      lines: lines.en,
      moods: moods.en,
      names: names.en,
      photoTraits: photoTraits.en,
      rarities: rarities
    }
  };
})();
