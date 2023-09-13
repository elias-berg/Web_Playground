# Eli's Web Playground

My personal web playground. A collection of random little web-related projects of various stages of completion.

## Getting Started

Make sure you have Node.js installed and run the base site with:
- `npm i`
- `npm run start`

Because this is a simple collection of projects, there's no real fancy Node logic...yet ;)

## Projects

### [Chex Quest](./ChexQuest/)

An exploration of the `<canvas>` element. I found some Chex Quest sprites online and wanted to see what went into making a simple game using the sprite sheets and web graphics APIs.

<details>
  <summary>To Do</summary>
  <ul>
    <li>Fix sideware running effect</li>
    <li>Add enemy sprites</li>
    <li>Add zorcher fire animations</li>
    <li>Add shump game engine</li>
  </ul>
</details>

### [Madison Hailstones](./MadisonHailstones/)

This was my from-the-ground-up rewrite of the entire [Madison GAA](https://www.madisonhailstones.com/) website. Unfortunately, it wasn't used for very long before the PRO took over and used a site like Wordpress instead.

The highlight of this project ended up being the Calendar that I wrote from scratch. It takes an input file indicating any recurring practices/events as well as one-off events and displays them. It's primitive, but could easily become its own project!

<details>
  <summary>To Do</summary>
  <ul>
    <li>Start custom component library around Calendar</li>
  </ul>
</details>

### [Super Mario Sunshine Checklist](./SuperMarioSunshine/)

This is a checklist I made for fun to track all of the shines and blue coins while I was playing through the game. I realized partway through, it makes for a great template as a starting place for a checklist-creation form. Otherwise, enjoy the aesthetics, that's pretty much all it's good for, unless you want to use it for your own playthrough!

<details>
  <summary>To Do</summary>
  <ul>
    <li>Add effect for 100% completion</li>
    <li>Look into storing data in browser local storage</li>
    <li>Start generic checklist project for other games</li>
  </ul>
</details>

### [Timelogger](./Timelogger/)

Back when I worked at Epic Systems, we had to log our time to the nearest 25-minute time chunk. It's an extremely tedious problem and the only solution coworkers were using was an in-house (but not very well known) app that would ask you every 30 minutes what you were working on for the past half hour. So I created that basic page and enhanced it over time to be *proactive* instead of reactive, where you log what you're about to work on, rather than recall what you previously worked on.

<details>
  <summary>To Do</summary>
  <ul>
    <li>Clean up and organize code</li>
    <li>Genericize terms</li>
    <li>Enhance reconciliation</li>
    <li>Use component library</li>
  </ul>
</details>

### [Piano Protégé](./PianoProtégé/)

What better way to learn music than to write a program that provides lessons on how to read music. This project, so far, is just a proof of concept for drawing a piano shape, playing sounds, and generating notes as if it were Guitar Hero. Eventually, I'd like to incorporate this into a richer site to provide lessons where users can use the keyboard instead of clicking.

<details>
  <summary>To Do</summary>
  <ul>
    <li>Add a "tolerance area" for note presses</li>
    <li>Sync note pressing with notes flying across the screen</li>
    <li>Add a scoreboard</li>
    <li>Add keyboard presses to register piano key presses</li>
  </ul>
</details>

### [Legoify](./Legoify/)

I though to myself, "how cool would it be to write some code that takes and image and outputs a LEGO version of that image?" This project is meant to play with images uploaded by a user and then play around with the image to output a pixellated version that could then be constructed with just LEGO bricks.

<details>
  <summary>To Do</summary>
  <ul>
    <li>Allow importing a custom image</li>
    <li>Allow different import image dimensions than 500x500</li>
    <li>Get official LEGO brick pieces and palette</li>
    <li>Restrict inputs to only official LEGO sizes</li>
  </ul>
</details>
