# Enchantify Discord Bot

Enchantify: A Minecraft Enchantment Assistant. Keep track of enchantments, view compatibility with gear, and calculate enchantments costs – solving your Minecraft enchanting complexities.

**Invite Link:** https://discord.com/api/oauth2/authorize?client_id=1197698797048967178&permissions=2147552256&scope=bot

## Table of Contents

- [Commands](#commands)
  - [Enchantment](#enchantment)
  - [Enchantments](#enchantments)
  - [Forge](#forge)
  - [Invite](#invite)
  - [Price](#price)
  - [Register](#register)
  - [Remove-All](#remove-all)
  - [Remove](#remove)
- [Installation](#installation)

## Commands

### `/enchantment`

#### Description
Add or update an enchantment in your enchantment library.

#### Usage
```bash
/enchantment <enchantment> <level> <price> <gear>
```

#### Parameters
- `<enchantment>` - The enchantment name.
- `<level>` - The enchantment level.
- `<price>` - The price of the enchantment in emeralds.
- `<gear> (optional)` - The gear types that the enchantment is compatible with, entered as a comma separated list.

#### Example
```bash
/enchantment Protection IV 35 Helmet,Chest,Legs,Boots
```

---

### `/enchantments`

#### Description
Lists all enchantments with optional parameters.

#### Usage
```bash
/enchantments <gear> <organize>
```

#### Parameters
- `<gear> (optional)` - The gear type to filter by.
- `<organize> (optional)` - Whether or not to organize the enchantments by gear type.

#### Example
```bash
/enchantments Helmet
```

---

### `/forge`

#### Description
Calculates the amount of emeralds, books, and anvils it costs to forge an enchanted book. Cost calculations are based on the level of the `<enchantment>?` parameter from your enchantment library.

#### Usage
```bash
/forge <enchantment> <level>
```

#### Parameters
- `<enchantment>` - The enchantment name.
- `<level>` - The enchantment level that you want to end up with.

#### Example (Modded Minecraft)
```bash
/forge Protection VIII
```

---

### `/invite`

#### Description
Sends the Enchantify Discord invite link to the Discord channel.

#### Usage
```bash
/invite
```

---

### `/price`

#### Description
Gets the price of an enchantment from your enchantment library.

#### Usage
```bash
/price <enchantment>
```

#### Parameters
- `<enchantment>` - The name of the enchantment that you want to see the price of.

#### Example
```bash
/price Protection
```

---

### `/register`

#### Description
Manually registers your server in the Enchantify database. This command will/should be executed a single time.

**Note:** This command is only required if your Discord server is not automatically added to the Enchantify database when the bot joins your server. 

#### Usage
```bash
/register
```

---

### `/remove-all`

#### Description
Removes all enchantments from your enchantment library.

**Note:** This command can only be executed by server admins.

#### Usage
```bash
/remove-all
```

---

### `/remove`

#### Description
Removes a single enchantment from your enchantment libary.

#### Usage
```bash
/remove <enchantment>
```

#### Parameters
- `<enchantment>` - The name of the enchantment that you want to remove.

#### Example
```bash
/remove Protection
```

## Installation

Clone the repository:

```bash
git clone https://github.com/CShatto99/Enchantify.git
# or
gh repo clone CShatto99/Enchantify
```

Install the dependencies:

```bash
npm install
```

In the root of the project, rename `.env.example` to `.env` and fill out the empty environment variables.

Run the development server:

```bash
npm run dev
```

## Creating Issues

If you encounter any issues or have suggestions for improvement, feel free to create a new issue on this repository using [this link](https://github.com/CShatto99/Enchantify/issues/new).

When creating an issue, please provide detailed information about the problem or enhancement request, including steps to reproduce the issue if applicable. This will help in addressing and resolving the matter more efficiently.
