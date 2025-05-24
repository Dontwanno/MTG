from enum import Enum

# define trigger enum
class Trigger(Enum):
    SPELL_CAST = 1
    CREATURE_ENTER = 2
    CREATURE_LEAVE = 3
    ATTACK = 4
    BLOCK = 5
    DAMAGE = 6
    DEATH = 7
    LIFE_GAIN = 8
    LIFE_LOSS = 9

# define ability enum
class AbilityType(Enum):
    PROWESS = 1
    DEATHTOUCH = 2
    DEFENDER = 3
    DOUBLE_STRIKE = 4
    ENCHANT = 5
    EQUIP = 6
    FIRST_STRIKE = 7
    FLASH = 8
    FLYING = 9
    HASTE = 10
    HEXPROOF = 11
    INDESTRUCTIBLE = 12
    INTIMIDATE = 13
    LANDWALK = 14
    LIFELINK = 15
    PROTECTION = 16
    REACH = 17
    SHROUD = 18
    TRAMPLE = 19
    VIGILANCE = 20

# define card type enum
class CardType(Enum):
    CREATURE = 1
    LAND = 2
    ENCHANTMENT = 3
    ARTIFACT = 4
    PLANESWALKER = 5
    INSTANT = 6
    SORCERY = 7

class Card():
    def __init__(self, name, cost):
        self.name = name
        self.cost = cost



class Permanent(Card):
    def __init__(self, name, cost):
        super().__init__(name, cost)
        self.card_type = None
        self.abilities = []
        self.tapped = False

    def tap(self):
        self.tapped = True

    def untap(self):
        self.tapped = False

    def __str__(self):
        return f"{self.name} ({self.card_type})"

    def __repr__(self):
        return f"{self.name} ({self.card_type})"

class Creature(Permanent):
    def __init__(self, name, power, toughness, cost):
        super().__init__(name, cost)
        self.basepower = power
        self.basetoughness = toughness
        self.power_counter = 0
        self.toughness_counter = 0
        self.temp_power_counter = 0
        self.temp_toughness_counter = 0
        self.card_type = CardType.CREATURE
        self.abilities = []

    @property
    def power(self):
        return self.basepower + self.power_counter + self.temp_power_counter
    @property
    def toughness(self):
        return self.basetoughness + self.toughness_counter + self.temp_toughness_counter

    def __str__(self):
        return f"{self.name} ({self.power}/{self.toughness})"

    def __repr__(self):
        return f"{self.name} ({self.power}/{self.toughness})"

    def add_ability(self, ability):
        self.abilities.append(ability)
        ability.owner = self

    def remove_ability(self, type: AbilityType):
        for ability in self.abilities:
            if ability.AbilityType == type:
                ability.remove()
                self.abilities.remove(ability)
                break
        else:
            print(f"Ability {type} not found.")

class Ability():
    def __init__(self):
        self.owner = None

    def remove(self):
        del self

    def __str__(self):
        return self.__class__.__name__

class Prowess(Ability):
    def __init__(self, trigger_sender, multiplier=1):
        super().__init__()
        self.multiplier = multiplier
        self.trigger_sender = trigger_sender
        self.trigger_sender.connect(self.on_spell_cast, sender=Trigger.SPELL_CAST)
        self.AbilityType = AbilityType.PROWESS

    def on_spell_cast(self, sender):
        self.owner.temp_power_counter += self.multiplier
        self.owner.temp_toughness_counter += self.multiplier

    def remove(self):
        self.trigger_sender.disconnect(self.on_spell_cast, sender=Trigger.SPELL_CAST)
        del self


from blinker import signal

trigger_sender = signal('trigger_sender')

class Player():
    def __init__(self, name):
        self.name = name
        self.lands = []
        self.battlefield = []
        self.graveyard = []
        self.library = []
        self.hand = []
        self.mana  = {"R": 0, "G": 0, "B": 0, "U": 0, "W": 0, "X": 0}
        self.played_land = False

    def cast(self, played_card: Card):
        if played_card.cost:
            for color, amount in played_card.cost.items():
                if self.mana[color] < amount:
                    print(f"Not enough mana to cast {played_card.name}.")
                    return
                self.mana[color] -= amount
        self.hand.remove(played_card)
        played_card.cast(self)

        print(f"{self.name} casts {card.name}.")

me = Player("Me")
card = Creature("testcreature", 1, 1, {"R": 1})
me.hand.append(card)
me.mana["R"] = 1
me.cast(card)
print(me.permanents, me.mana)
