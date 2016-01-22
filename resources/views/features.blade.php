@extends('layouts.normalPageWithHeader')
@section('title','Features')

@section('specialHeader')
<div class="features_slider">
</div>
@stop

@section('page')
<h1>OpenRCT2 Features</h1>
<h2>0.0.4 (develop branch)</h2>
<ul>
    <li>Feature: Add displaying of frames per second (FPS).</li>
    <li>Feature: Changing the number of trains no longer requires retesting.</li>
    <li>Feature: Add SI units as a new measurement system for distance / speed.</li>
    <li>Feature: Update alternative font selection mechanism for all platforms.</li>
    <li>Feature: Allow enabling / disabling of different notifications.</li>
    <li>Fix: [#2126] Ferris Wheels set to "backward rotation" stop working (original bug)</li>
    <li>Fix: [#2449] Turning off Day/Night Circle while it is night doesn't reset back to day</li>
</ul>
<h2>0.0.3.1-beta (2015-12-04)</h2>
<ul>
    <li>Fix: [#2407] save game prompt delay is not reset on start scenario</li>
    <li>Fix: [#2415] day / night cycle did not update colours during gameplay</li>
    <li>Fix: [#2425] new campaign for ride shows invalid list when over 40 rides</li>
    <li>Fix: [#2417] peep direction assertion somtimes during pathfinding</li>
    <li>Fix: [#2158] video freeze when window is maximised, minimised and then restored</li>
    <li>Fix: [#2434] dropdown menus linger when toolbars are hidden</li>
</ul>
<h2>0.0.3-beta (2015-11-30)</h2>
<ul>
    <li>Feature: Adding extra title sequences.</li>
    <li>Feature: Title sequences can be edited in-game.</li>
    <li>Feature: Uncapped FPS.</li>
    <li>Feature: Ride selection in the Editor can now be sorted on track type or vehicle type.</li>
    <li>Feature: Load/save window can be sorted on date.</li>
    <li>Feature: Sandbox now a menu toggle.</li>
    <li>Feature: Improved ability to disable clearance checks via menu toggle.</li>
    <li>Feature: Added ability to disable support limits via menu toggle.</li>
    <li>Feature: Cheat to clear the crash record of each ride.</li>
    <li>Feature: Cheat to set all rides to 10 minute inspections.</li>
    <li>Feature: Cheats for guest parameters like hunger, energy, nausea etc.</li>
    <li>Feature: Cheats for park parameters like guest generation, loan settings and switching to and from not using money.</li>
    <li>Feature: Cheats for showing vehicles from other track types and enabling all operating modes.</li>
    <li>Feature: Clear Scenery can now be used for sizes up to 64x64.</li>
    <li>Feature: The mountain tool can now be used for sizes up to 64x64.</li>
    <li>Feature: Built-in load/save window is now used for converting saved games to scenarios.</li>
    <li>Feature: Cooperative multiplayer (has some game-breaking bugs).</li>
    <li>Feature: Native Linux support.</li>
    <li>Feature: Console commands for fixing 'Name already in use' and banner count errors.</li>
    <li>Feature: Scenario and object descriptions are now translatable.</li>
    <li>Feature: UI stays responsive in pause mode.</li>
    <li>Feature: Marketing campaign can now be run for up to 12 weeks.</li>
    <li>Feature: Day/night cycle.</li>
    <li>Feature: Added ability to save (over last file) as opposed to save as.</li>
    <li>Feature: Custom user data path specified by command line argument.</li>
    <li>Feature: Full UTF-8 language support.</li>
    <li>Feature: TTF font integration for non-Latin languages.</li>
    <li>Feature: Added support for Traditional Chinese, Simplified Chinese, Korean, Russian, Finnish and Brazilian Portuguese.</li>
    <li>Feature: Added South Korean Won and Russian Rouble as currencies.</li>
    <li>Feature: Allow different date formats.</li>
    <li>Feature: Option to automatically pause the game on minimise from fullscreen.</li>
    <li>Feature: Option to automatically pause when Steam overlay is activated.</li>
    <li>Feature: Option to display all scrolling text banners as upper case (RCT1 style)</li>
    <li>Feature: Option to mute audio when game is not focused.</li>
    <li>Feature: Option to automatically place staff after hire.</li>
    <li>Feature: Option to enable 'mow grass' by default for handymen (RCT1 style)</li>
    <li>Feature: Option to ignore invalid checksums on loaded parks.</li>
    <li>Feature: Option to scale game display for better compatibility with high DPI screens.</li>
    <li>Alteration: Autosave is now measured in real-time rather than in-game date.</li>
    <li>Alteration: Hacked rides no longer have their reliability set to 0.</li>
    <li>Technical: DirectDraw, DirectInput, DirectPlay and DirectSound dependencies are no longer used.</li>
    <li>Removed: Six Flags branding and limitations.</li>
    <li>Removed: Infogrames disclaimer.</li>
    <li>Fix: When placing a track, the preview will now use the same orientation as the ghost.</li>
    <li>Fix: Grouping vehicles by track type no longer interferes with research.</li>
    <li>Fix: Fix corrupt map elements when loading a game.</li>
    <li>Fix: Fix corrupt peep counter when loading a game.</li>
    <li>Fix: Parks created in the Scenario Editor now select the standard staff uniform colours by default.</li>
    <li>Fix: Launched TD4 rides will now always use the RCT1 launch mode (that doesn't pass the station) (original bug).</li>
    <li>Fix: Guests will no longer ignore no entry signs if the tile contains more than one fence (original bug).</li>
    <li>Fix: Right-clicking a piece of launched lift will no longer crash the game (original bug).</li>
    <li>Fix: Fix bugs in calculation of Heartline Twister and Launched Freefall ratings (original bugs).</li>
    <li>Fix: Map window now displays the usable map size, not the technical one (original bug).</li>
    <li>Fix: TD4 River Rapids will now have the correct seat colour (original bug).</li>
    <li>Fix: Message sound will no longer play in the editor modes (original bug).</li>
    <li>Fix: Scenarios created with the Scenario Editor will now have the correct initial temperature for their climate (original bug).</li>
    <li>Fix: Financial information can no longer be accessed from the rides/attractions menu in parks that don't use money (original bug).</li>
    <li>Fix: The path tool and tracked-ride construction tool no longer interfere with one another in certain situations (original bug).</li>
    <li>Fix: Building a flat ride partially out of park boundaries will no longer trigger a misleading "too high for supports" message (original bug).</li>
    <li>Fix: On-ride photos are now factored into the calculations of a ride's income and profit per hour (original bug).</li>
</ul>
<h2>0.0.2-beta (2015-06-21)</h2>
<ul>
    <li>Feature: Intro sequence does not show by default.</li>
    <li>Feature: New title screen logo.</li>
    <li>Feature: New title sequence (RCT2 version also still available).</li>
    <li>Feature: Title sequence music can now be disabled or changed to the RollerCoaster Tycoon 1 theme music.</li>
    <li>Feature: In-game console.</li>
    <li>Feature: Improved settings window with tab interface.</li>
    <li>Feature: Ability to change language while in game.</li>
    <li>Feature: Text input is now an in-game window.</li>
    <li>Feature: Toggle between software and hardware video mode.</li>
    <li>Feature: Toggle between resizeable window and fullscreen.</li>
    <li>Feature: Windows now snap to the borders of other windows when dragging (snap radius configurable).</li>
    <li>Feature: Interface colour themes. (Presets for RCT1 and RCT2 are included by default).</li>
    <li>Feature: Re-introduce traffic lights for close / test / open as a theme option.</li>
    <li>Feature: Show day as well as the month and year.</li>
    <li>Feature: Show month before day (e.g. March 14th, year 15)</li>
    <li>Feature: Exit OpenRCT2 to desktop.</li>
    <li>Feature: Game configuration, cache, scores and screenshots now saved in user documents directory under OpenRCT2.</li>
    <li>Feature: Auto-saving with frequency option.</li>
    <li>Feature: Ability to change game speed via toolbar or (+ and - keys).</li>
    <li>Feature: Finance window accessible from toolbar (enabled in settings).</li>
    <li>Feature: Research and development / research funding now accessible as a stand alone window without the requirement of the finances window.</li>
    <li>Feature: Extra viewport windows.</li>
    <li>Feature: Park window viewport is resizable.</li>
    <li>Feature: Land, water and ownership tool sizes can now be increased to 64x64.</li>
    <li>Feature: Mountain tool available in play mode.</li>
    <li>Feature: Buy land and construction rights land tool window. (Currently only in-game).</li>
    <li>Feature: Place scenery as a random cluster available in play mode.</li>
    <li>Feature: Increased limits for maximum of circuits per roller coaster to 20 and people on mazes to 64</li>
    <li>Feature: Allow both types of powered launch (with and without passing the station) for every roller coaster that supported one type in RCT2.</li>
    <li>Feature: Allow testing of incomplete tracks.</li>
    <li>Feature: Cheats window (Ctrl-Alt-C) or by toolbar button (configurable).</li>
    <li>Feature: Cheats for almost every guest aspect (happiness, hunger, nausea tolerance, etc.)</li>
    <li>Feature: Cheat to allow maximum operating settings and lift hill speeds (410 km/h).</li>
    <li>Feature: Cheat to disable all breakdowns.</li>
    <li>Feature: Cheat to disable brakes failure.</li>
    <li>Feature: Cheat to fix all rides.</li>
    <li>Feature: Change available objects in-game (only available from console).</li>
    <li>Feature: Change research settings in-game (only available from console).</li>
    <li>Feature: (Random) map generator available in scenario editor, accessible via the view menu.</li>
    <li>Feature: RollerCoaster Tycoon 1 scenarios can now be opened in the scenario editor or by using the 'edit' command line action.</li>
    <li>Feature: The "have fun" objective can now be selected in the scenario editor.</li>
    <li>Feature: Twitch integration</li>
    <li>Fix: Litter bins now get full and require emptying by handymen.</li>
</ul>
@stop