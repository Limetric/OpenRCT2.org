@extends('layouts.normalPageWithHeader')
@section('title','Features - OpenRCT2 project')
@section('description','An overview of alterations made to OpenRCT2 when compared to RollerCoaster Tycoon 2.')

@section('specialHeader')
<div class="features_slider">
</div>
@stop

@section('page')
<h1>OpenRCT2 Features</h1>
<p>
OpenRCT2 features many changes compared to the original RollerCoaster Tycoon 2 game. A few of them are listed here.
</p>
<ul>
    <li>User Interface theming.</li>
    <li>Fast-forwarding gameplay.</li>
    <li>Multiplayer support.</li>
    <li>Multilingual. Improved translations.</li>
    <li>OpenGL hardware rendering.</li>
    <li>Various fixes and improvements for bugs in the original game.</li>
    <li>Native support for Linux and macOS.</li>
    <li>Added hacks and cheats.</li>
    <li>Auto-saving and giant screenshots.</li>
</ul>

<h1>Changes history</h1>
<p>An overview of all the changes between OpenRCT2 versions. It can also be used to compare against the features from RollerCoaster Tycoon 2. It is possible that this list isn't fully up-to-date.</p>
<h2>0.1.2 (in development)</h2>
<ul>
	<li>Feature: [#3510] Auto-append extension if none is specified.</li>
	<li>Feature: [#3994] Show bottom toolbar with map tooltip (theme option).</li>
	<li>Feature: [#5826] Add the show_limits command to show map data counts and limits.</li>
	<li>Feature: [#6078] Game now converts mp.dat to SC21.SC4 (Mega Park) automatically.</li>
	<li>Feature: [#6125] Path can now be placed in park entrances.</li>
	<li>Feature: [#6181] Map generator now allows adjusting random terrain and tree placement in Simplex Noise tab.</li>
	<li>Feature: [#6235] Add drawing debug option for showing visuals when and where blocks of the screen are painted.</li>
	<li>Feature: [#6290] Arabic translation (experimental).</li>
	<li>Feature: [#6292] Allow building queue lines in the Scenario Editor.</li>
	<li>Feature: [#6295] TrueType fonts are now rendered with light font hinting by default.</li>
	<li>Feature: [#6307] Arrows are now shown when placing park entrances.</li>
	<li>Feature: [#6324] Add command to deselect unused objects from the object selection.</li>
	<li>Feature: [#6325] Allow using g1.dat from RCT Classic.</li>
	<li>Feature: [#6353] Show custom RCT1 scenarios in New Scenario window.</li>
	<li>Feature: [#6411] Add command to remove the park fence.</li>
	<li>Feature: [#6414] Raise maximum launch speed of the Corkscrew RC back to 96 km/h (for RCT1 parity).</li>
	<li>Feature: [#6433] Turn 'unlock all prices' into a regular (non-cheat, persistent) option.</li>
	<li>Feature: [#6530] Land rights tool no longer blocks when a tile is not for purchase.</li>
	<li>Feature: Allow using object files from RCT Classic.</li>
	<li>Feature: Title sequences now testable in-game.</li>
	<li>Fix: [#816] In the map window, there are more peeps flickering than there are selected (original bug).</li>
	<li>Fix: [#1833, #4937, #6138] 'Too low!' warning when building rides and shops on the lowest land level (original bug).</li>
	<li>Fix: [#6199] Inverted Hairpin Coaster vehicle tab is not centred.</li>
	<li>Fix: [#4991] Inverted helices can be built on the Lay Down RC, but are not drawn.</li>
	<li>Fix: [#5417] Hacked Crooked House tracked rides do not dispatch vehicles.</li>
	<li>Fix: [#5445] Patrol area not imported from RCT1 saves and scenarios.</li>
	<li>Fix: [#5585] Inconsistent zooming with mouse wheel.</li>
	<li>Fix: [#5609] Vehicle switching may cause '0 cars per train' to be set.</li>
	<li>Fix: [#5741] Land rights indicators disappear when switching views.</li>
	<li>Fix: [#5788] Empty scenario names cause invisible entries in scenario list.</li>
	<li>Fix: [#6101] Rides remain in ride list window briefly after demolition.</li>
	<li>Fix: [#6115] Random title screen music not random on launch.</li>
	<li>Fix: [#6118, #6245, #6366] Tracked animated vehicles not animating.</li>
	<li>Fix: [#6133] Construction rights not shown after selecting buy mode.</li>
	<li>Fix: [#6188] Viewports not being clipped properly when zoomed out in OpenGL mode.</li>
	<li>Fix: [#6193] All rings in Space Rings use the same secondary colour.</li>
	<li>Fix: [#6196, #6223] Guest's energy underflows and never decreases.</li>
	<li>Fix: [#6198] You cannot cancel RCT1 directory selection.</li>
	<li>Fix: [#6202] Guests can break occupied benches (original bug).</li>
	<li>Fix: [#6251] Splash Boats renders flat-to-25-degree pieces in tunnels incorrectly.</li>
	<li>Fix: [#6261, #6344, #6520] Broken pathfinding after removing park entrances with the tile inspector</li>
	<li>Fix: [#6271] Wrong booster speed tooltip text.</li>
	<li>Fix: [#6308] Cannot create title sequence if title sequences folder does not exist.</li>
	<li>Fix: [#6318] Cannot sack staff that have not been placed</li>
	<li>Fix: [#6320] Crash when CSS1.DAT is absent.</li>
	<li>Fix: [#6331] Scenery costs nothing in track designs.</li>
	<li>Fix: [#6360] Off-by-one filenames when exporting all sprites.</li>
	<li>Fix: [#6358] HTTP requests can point to invalid URL string.</li>
	<li>Fix: [#6413] Maze previews only showing scenery.</li>
	<li>Fix: [#6423] Importing parks containing names with Polish characters.</li>
	<li>Fix: [#6423] Polish characters now correctly drawn when using the sprite font.</li>
	<li>Fix: [#6445] Guests' favourite ride improperly set when importing from RCT1 or AA.</li>
	<li>Fix: [#6452] Scenario text cut off when switching between 32 and 64-bit builds.</li>
	<li>Fix: [#6460] Crash when reading corrupt object files.</li>
	<li>Fix: [#6481] Can't take screenshots of parks with colons in the name.</li>
	<li>Fix: [#6593] Cannot hire entertainers when default scenery groups are not selected (original bug).</li>
	<li>Fix: Infinite loop when removing scenery elements with >127 base height.</li>
	<li>Fix: Ghosting of transparent map elements when the viewport is moved in OpenGL mode.</li>
	<li>Fix: Clear IME buffer after committing composed text.</li>
	<li>Fix: Title sequence editor now gracefully fails to preview a title sequence and lets the user know with an error message.</li>
	<li>Fix: When preset title sequence fails to load, the preset will forcibly be changed to the first sequence to successfully load.</li>
	<li>Improved: [#6186] Transparent menu items now draw properly in OpenGL mode.</li>
	<li>Improved: [#6218] Speed up game start up time by saving scenario index to file.</li>
	<li>Improved: [#6423] Polish is now rendered using the sprite font, rather than TTF.</li>
	<li>Improved: Load/save window now refreshes list if native file dialog is closed/cancelled.</li>
	<li>Improved: Major translation updates for Japanese and Polish.</li>
	<li>Improved: Added 24x24, 48x48, and 96x96 icon resolutions.</li>
	<li>Technical: [#6384] On macOS, address NSFileHandlingPanel deprecation by using NSModalResponse instead.</li>
</ul>
<h2>0.1.1 (2017-08-09)</h2>
<ul>
	<li>Feature: [#5815] Add cheat to ignore research status and access rides/scenery not yet invented.</li>
	<li>Feature: [#5857] Keyboard shortcut for clear scenery.</li>
	<li>Feature: [#5877] Allow up to 16 stations to be synchronised</li>
	<li>Feature: [#5970] The Bobsleigh Roller Coaster now supports on-ride photos.</li>
	<li>Feature: [#5991] Allow all tracked rides that can be tested without guests to the Track Designer</li>
	<li>Fix: [#2127, #2229, #5586] Mountain tool cost calculation</li>
	<li>Fix: [#3589] Crash due to invalid footpathEntry in path_paint</li>
	<li>Fix: [#3852] Constructing path not clearing scenery on server.</li>
	<li>Fix: [#4455] Crash in window_sign_invalidate due to original bug</li>
	<li>Fix: [#4715] Fix OpenGL rendering of water when zoomed. See #5890.</li>
	<li>Fix: [#4931] Crash in path_paint - footpathentry was null</li>
	<li>Fix: [#5629] Issue with tower ride modes approach to station - incorrect sum caused sawtooth in velocity</li>
	<li>Fix: [#5768] Prevent loading non-existent title sequences.</li>
	<li>Fix: [#5858] Crash when using custom ride with no colour presets.</li>
	<li>Fix: [#5865] Ride preview flickering on uneven terrain or mid air.</li>
	<li>Fix: [#5872] Incorrect OpenGL rendering of masked sprites</li>
	<li>Fix: [#5880] Leaving bumper cars without building causes assertion.</li>
	<li>Fix: [#5890] Fix zoomed OpenGL rendering of special sprites with primary and secondary colours.</li>
	<li>Fix: [#5912] Negative queue when moving entrance in paused state.</li>
	<li>Fix: [#5920] Placing guest spawn doesn't do anything every 3rd click</li>
	<li>Fix: [#5939] Crash when importing 'Six Flags Santa Fe'.</li>
	<li>Fix: [#5977] Custom music files not showing up in music list</li>
	<li>Fix: [#5981] Ride list doesn't update after using quick demolish.</li>
	<li>Fix: [#5984] Allow socket binding to same port after crash</li>
	<li>Fix: [#5998] Staff not getting paid / no loan interest.</li>
	<li>Fix: [#6026] 'Select ride to advertise' dropdown does not display all items.</li>
	<li>Fix: [#6052] Unable to place entrance/exit on certain ride types.</li>
	<li>Fix: [#6071] Quick demolish can delete protected ride.</li>
	<li>Fix: [#6111] Mute button always visible in editor.</li>
	<li>Fix: [#6113] Track preview shows incorrect highest drop height.</li>
	<li>Improved: [#2223] Change mountain tool to ignore higher surrounding tiles.</li>
	<li>Improved: [#4301] Leading and trailing whitespace in player name is now removed.</li>
	<li>Improved: [#5859] OpenGL rendering performance</li>
	<li>Improved: [#5863] Switching drawing engines no longer requires the application to restart.</li>
	<li>Improved: [#6003] Doors placed on tracks will now work with all vehicles</li>
	<li>Improved: [#6037] Autosaves are now stored in a subfolder</li>
	<li>Improved: The land tool buttons can now be held down to increase/decrease size.</li>
	<li>Improved: Dropdowns longer than 32 items overflow into columns.</li>
	<li>Improved: Ride Type option in ride window is now a dropdown.</li>
	<li>Improved: "About OpenRCT2" window redesigned, now contains OpenRCT2 info and access to changelog</li>
</ul>
<h2>0.1.0 (2017-07-12)</h2>
<ul>
	<li>Feature: [#1399 (partial), #5177] Add window that displays any missing/corrupt objects when loading a park</li>
	<li>Feature: [#5056] Add cheat to own all land.</li>
	<li>Feature: [#5133] Add option to display guest expenditure (as seen in RCTC).</li>
	<li>Feature: [#5196] Add cheat to disable ride ageing.</li>
	<li>Feature: [#5504] Group vehicles into ride groups</li>
	<li>Feature: [#5576] Add a persistent 'display real names of guests' setting.</li>
	<li>Feature: [#5611] Add support for Android</li>
	<li>Feature: [#5706] Add support for OpenBSD</li>
	<li>Feature: OpenRCT2 now starts up on the display it was last shown on.</li>
	<li>Feature: Park entrance fee can now be set to amounts up to £200.</li>
	<li>Improved: Construction rights can now be placed on park entrances.</li>
	<li>Improved: Mouse can now be dragged to select scenery when saving track designs</li>
	<li>Fix: [#259] Money making glitch involving swamps (original bug)</li>
	<li>Fix: [#441] Construction rights over entrance path erased (original bug)</li>
	<li>Fix: [#578] Ride ghosts show up in ride list during construction (original bug)</li>
	<li>Fix: [#597] 'Finish 5 roller coasters' goal not properly checked (original bug)</li>
	<li>Fix: [#667] Incorrect banner limit calculation (original bug)</li>
	<li>Fix: [#739] Crocodile Ride (Log Flume) never allows more than five boats (original bug)</li>
	<li>Fix: [#837] Can't move windows on title screen to where the toolbar would be (original bug)</li>
	<li>Fix: [#1705] Time Twister's Medieval entrance has incorrect scrolling (original bug)</li>
	<li>Fix: [#3178, #5456] Paths with non-ASCII characters not handled properly on macOS.</li>
	<li>Fix: [#3346] Crash when extra long train breaks down at the back</li>
	<li>Fix: [#3479] Building in pause mode creates too many floating numbers, crashing the game</li>
	<li>Fix: [#3565] Multiplayer server crash</li>
	<li>Fix: [#3681] Steel Twister rollercoaster always shows all track designs</li>
	<li>Fix: [#3846, #5749] Crash when testing coaster with a diagonal lift in block brake mode</li>
	<li>Fix: [#4054] Sorting rides by track type: Misleading research messages</li>
	<li>Fix: [#4055] Sort rides by track type: Sorting rule is not really clear (inconsistent?)</li>
	<li>Fix: [#4512] Invisible map edge tiles corrupted</li>
	<li>Fix: [#5009] Ride rating calculations can overflow</li>
	<li>Fix: [#5253] RCT1 park value conversion factor too high</li>
	<li>Fix: [#5400] New Ride window does not focus properly on newly invented ride.</li>
	<li>Fix: [#5489] Sprite index crash for car view on car ride.</li>
	<li>Fix: [#5730] Unable to uncheck 'No money' in the Scenario Editor.</li>
	<li>Fix: [#5750] Game freezes when ride queue linked list is corrupted.</li>
	<li>Fix: [#5819] Vertical multi-dimension coaster tunnels drawn incorrectly</li>
	<li>Fix: Non-invented vehicles can be used via track designs in select-by-track-type mode.</li>
	<li>Fix: Track components added by OpenRCT2 are now usable in older scenarios.</li>
	<li>Technical: [#5047] Add ride ratings tests</li>
	<li>Technical: [#5458] Begin offering headless build with reduced compile- and run-time dependencies</li>
	<li>Technical: [#5755] Title sequence wait periods use milliseconds</li>
	<li>Technical: Fix many desync sources</li>
	</li>
</ul>
<h2>0.0.7 (2017-05-03)</h2>
<ul>
	<li>Feature: [#1730] Keyboard shortcuts for track construction.</li>
	<li>Feature: [#2060, #5282] Heightmap loader</li>
	<li>Feature: [#5110] The tile inspector can now be used in multiplayer.</li>
	<li>Feature: [#5305] Add scenery eye dropper tool.</li>
	<li>Feature: [#5370] Ride operating mode can be set from the console.</li>
	<li>Feature: [#5415] Add mute toolbar button (as seen in RCT1 and Locomotion).</li>
	<li>Improved: [#5254] Scenario option changes are now synchronised over multiplayer.</li>
	<li>Improved: [#3288] Added server description and greeting textboxes to the start server menu.</li>
	<li>Improved: [#3502] Track previews display at higher zoom level for large layouts.</li>
	<li>Improved: [#5055] Implement 'quick demolish' for rides.</li>
	<li>Improved: [#5137] Removing all guests no longer closes the rides and removes the vehicles.</li>
	<li>Improved: [#5163] Minor tile inspector improvements and fixes.</li>
	<li>Improved: [#5222] Add Catalan language.</li>
	<li>Improved: [#5351] Giga Coaster and Steel Twister RC boosters now use the correct sprites.</li>
	<li>Improved: Looping RC and Corkscrew RC now use booster sprites from RCT1's CSG1.DAT if available.</li>
	<li>Improved: Scenario options are now synced in multiplayer.</li>
	<li>Improved: Remove duplicate ride penalty for closed rides.</li>
	<li>Improved: Make shortcut keys window larger and resizable.</li>
	<li>Removed: known_issues.txt no longer used, check issue tracker on GitHub.</li>
	<li>Fix: [#1992] Felicity Anderson Cheat can crash the game, as well as blocking queues.</li>
	<li>Fix: [#4493] Provide tooltip for disabled price field.</li>
	<li>Fix: [#4689] Object selection tabs sometimes flicker.</li>
	<li>Fix: [#4913] Server greeting displaying local setting.</li>
	<li>Fix: [#4972] Map window not updated properly when shrinking map from Map Generation window.</li>
	<li>Fix: [#5004] Peeps in parks imported from RCT1 show abnormalities.</li>
	<li>Fix: [#5014] Research not imported from RCT1 correctly.</li>
	<li>Fix: [#5032] Booster speed is not saved in TD6.</li>
	<li>Fix: [#5140] Headless server should save default users.json.</li>
	<li>Fix: [#5150] --openrct-data-path sets user data path instead of OpenRCT2 data path.</li>
	<li>Fix: [#5169] Parks containing packed objects fail to open.</li>
	<li>Fix: [#5199] "Force a breakdown" debugging tool isn't hidden in multiplayer.</li>
	<li>Fix: [#5188] Clicking on a Magic Carpet doesn't open the ride window.</li>
	<li>Fix: [#5218] Scale RCT1 park value objectives.</li>
	<li>Fix: [#5219] Game crashes when opening 'misc' tab in options.</li>
	<li>Fix: [#5238] RCT1 import: Rides are initially free when placing them.</li>
	<li>Fix: [#5252] Correct typo in Conger Eel Coaster description.</li>
	<li>Fix: [#5265] Queue line TVs not detected properly.</li>
	<li>Fix: [#5271] Keyboard shortcuts window isn't large enough (for some languages).</li>
	<li>Fix: [#5284] Mechanic is called to fix a ride that's outside his patrol area.</li>
	<li>Fix: [#5285] Intro always plays even if play_intro = false.</li>
	<li>Fix: [#5299] Scenario editor crash when placing peep spawn.</li>
	<li>Fix: [#5318] Using the bulldozer tool on under-construction paths results in unlimited free money.</li>
	<li>Fix: [#5325] Game crashes if encountering an invalid ride type during research.</li>
	<li>Fix: [#5345] Correct typos in descriptions for Top Spin and Splash Boats.</li>
	<li>Fix: [#5350] Steel Twister RC and Giga Coaster boosters are underpowered, Junior Roller Coaster boosters overpowered compared to RCTC.</li>
	<li>Fix: [#5357] "Assertion failed!" after guest with name 'Emma Garrell' exits/enters ride.</li>
	<li>Fix: Walls do not import from RCT1 correctly in pause mode.</li>
	<li>Fix: Extraneous window tabs show up on MacOS 10.12.</li>
	<li>Fix: Potential for integer overflow in ride length.</li>
	<li>Fix: Vehicles erroneously removed when removing all guests.</li>
	<li>Technical: INI configuration file now case-insensitive.</li>
	<li>Technical: Remove version build from msbuild and NSIS.</li>
</ul>
<h2>0.0.6 (2017-01-29)</h2>
<ul>
	<li>Feature: [#3355] Allow loading of parks from URLs.</li>
	<li>Feature: [#4673] Add paint Z clipping.</li>
	<li>Feature: [#4901] Allow entertainers' costume changes even in absence of required scenery.</li>
	<li>Feature: [#4916] FreeBSD support.</li>
	<li>Feature: [#4963] Add boosters (from RCT1 and RCTC).</li>
	<li>Feature: [#5113] Entertainers are now hired with a random costume.</li>
	<li>Improved: [#4847] Guest / staff pathfinding.</li>
	<li>Improved: [#4938] Checksum calculations speeded up.</li>
	<li>Improved: [#5007] Vehicles and functioning rides are now imported when loading SC4 / SV4 parks.</li>
	<li>Improved: Guests and staff are now imported when loading SC4 / SV4 parks.</li>
	<li>Fix: [#4571] Only start autosave timer after update or game command.</li>
	<li>Fix: [#4584] Junior Coaster diagonal flat-to-steep slopes not drawn.</li>
	<li>Fix: [#4929] Changing TTF language crashes game.</li>
	<li>Fix: [#4944] Game crashes upon selecting objects in scenario editor.</li>
	<li>Fix: [#4951] Scenarios are not recorded as completed from a saved game.</li>
	<li>Fix: [#4968] Completing a scenario does not save the name that is entered.</li>
	<li>Fix: [#4996] Objects unloaded after loading landscape.</li>
	<li>Fix: [#5003] Able to remove entrance/exit of unedittable rides (such as in Volcania).</li>
	<li>Fix: [#5096] Failure to open parks with out of bounds sprite coordinates.</li>
	<li>Fix: [#5114] Some entertainer costumes never select-able.</li>
</ul>
<h2>0.0.5 (2016-12-27)</h2>
<p>This is the first fully implemented version of OpenRCT2. RCT2.EXE is no longer required.</p>
<ul>
    <li>Feature: Ability to disable rendering of weather effects and gloom</li>
    <li>Feature: New view option: "See-Through Paths"</li>
    <li>Feature: Add cheat to reset date.</li>
    <li>Feature: Add OpenGL drawing engine.</li>
    <li>Feature: Implementation of the user-defined currency</li>
    <li>Feature: Extended tile inspector.</li>
    <li>Feature: Add ride console command for diagnostics and changing vehicle type.</li>
    <li>Feature: Allow selecting corners when using the mountain tool.</li>
    <li>Feature: Allow setting ownership of map edges.</li>
    <li>Feature: Allow up to 255 cars per train.</li>
    <li>Feature: Importing SV4 and SC4 files with rides.</li>
    <li>Feature: Filter Object Selection Window by "Selected only" and "Non-selected only"</li>
    <li>Feature: Allow raising terrain to 64 in-game units.</li>
    <li>Feature: Assymmetric-key-based authorisation and assignment storage.</li>
    <li>Feature: Add Norwegian translation.</li>
    <li>Feature: Add cheat to disable littering.</li>
    <li>Feature: Add Cheat to disable plant aging.</li>
    <li>Feature: Add Cheat that allows any track piece to use a chain lift.</li>
    <li>Feature: Add Console command to set vehicle friction.</li>
    <li>Feature: Add console command to set scenario initial cash.</li>
    <li>Feature: Objects are scanned from the user directory as well as the RCT2 directory.</li>
    <li>Feature: Objects directory is scanned recursively.</li>
    <li>Feature: Optionally zoom in towards the cursor rather than the screen centre.</li>
    <li>Change: The maximum height of Junior Roller Coasters is now 14 units, like it was in RCT1.</li>
    <li>Improved: Pathfinding algorithm.</li>
    <li>Improved: Performance and reliability of loading objects.</li>
    <li>Improved: Screenshots are now saved with the name of the park and the current date and time.</li>
    <li>Improved: More accurate frame rate calculation</li>
    <li>Improved: In-game file dialog now shows more formats (sv6, sc6, sv4, etc.)</li>
    <li>Improved: Joining multiplayer will not redownload custom objects</li>
    <li>Removed: BMP screenshots.</li>
    <li>Removed: Intamin and Phoenix easter eggs.</li>
    <li>Fix: [#933] On-ride photo price sometimes gets reset to £2 when using 'same price in whole park' (original bug).</li>
    <li>Fix: [#1038] Guest List is out of order.</li>
    <li>Fix: [#1238] Track place window does not fully adjust to custom colour scheme.</li>
    <li>Fix: [#2042] Guests entering queues are immediately annoyed when many entertainers are around (original bug).</li>
    <li>Fix: [#2081] Game hangs when track has infinite loop.</li>
    <li>Fix: [#2754] Dragging scrollview fails when scaled.</li>
    <li>Fix: [#3210] Scenery window scrolls too far.</li>
    <li>Fix: [#3282] Launched Freefall ride ratings are fixed for Downward Launch (original bug).</li>
    <li>Fix: [#3307] Ride music and sound has degraded since RCT2.</li>
    <li>Fix: [#3344] Build new ride window can be opened in scenario editor.</li>
    <li>Fix: [#3347] Ride windows are auto-positioned below the HUD when using RCT1 lights.</li>
    <li>Fix: [#3352] Assertion triggered while fixing surface tiles.</li>
    <li>Fix: [#3361] Missing Twister coaster piece.</li>
    <li>Fix: [#3418] Launched freefall restraints are drawn incorrectly when up (original bug).</li>
    <li>Fix: [#3451] Renaming staff is a guest command.</li>
    <li>Fix: [#3635] Inspecting sidewalk path crashes game.</li>
    <li>Fix: [#3735] Advertisement campaign window bug.</li>
    <li>Fix: [#3771] Crash when kicking player in multiplayer.</li>
    <li>Fix: [#3824] Segfault when passing invalid arguments to ride set type.</li>
    <li>Fix: [#3858] Tooltip shown when hovering over title logo.</li>
    <li>Fix: [#3915] Restore horizontal and vertical scrollbar behaviour from RCT2 when clicking on one of the scrollbars.</li>
    <li>Fix: Lay-down Roller Coasters from RCT1 saves are imported with an incorrect vehicle type (not reported).</li>
    <li>Fix: High lateral G-forces penalty applied too early (not reported).</li>
    <li>Technical: Multiplayer groups are now stored in JSON format.</li>
    <li>Technical: MinGW builds dropped support for Windows XP</li>
</ul>
<h2>0.0.4-beta (2016-04-15)</h2>
<ul>
    <li>Feature: Full native OSX .app support.</li>
    <li>Feature: Add displaying of frames per second (FPS).</li>
    <li>Feature: Changing the number of trains no longer requires retesting.</li>
    <li>Feature: Add SI units as a new measurement system for distance / speed.</li>
    <li>Feature: Update alternative font selection mechanism for all platforms.</li>
    <li>Feature: Allow enabling / disabling of different notifications.</li>
    <li>Feature: Add more columns and information to tile inspector.</li>
    <li>Feature: Add ability to remove and reorder elements in tile inspector.</li>
    <li>Feature: Integrate RCT1 style scenario select with optional unlock progression.</li>
    <li>Feature: Add graphics scaling and filtering.</li>
    <li>Feature: Add cheat: permanent marketing.</li>
    <li>Feature: Closed rides show number of guests currently on the ride in tooltip and on the ride window customer page.</li>
    <li>Feature: Scrolling the mouse wheel over any land tool preview box will increment or decrement the tool size.</li>
    <li>Feature: Additional property views added to the ride list window.</li>
    <li>Feature: Improved overall view centring for rides and shops.</li>
    <li>Feature: Add permission and group management in multiplayer.</li>
    <li>Feature: Add player windows with viewport and trace in multiplayer.</li>
    <li>Feature: Add ability to start a new scenario when starting a new server.</li>
    <li>Feature: Compress game data that is downloaded when connecting to a server.</li>
    <li>Feature: Support for using system load/save dialogs on Linux and OS X.</li>
    <li>Feature: OpenRCT2 now detects if the server is running a compatible version when attempting to connect to a multiplayer game.</li>
    <li>Feature: Ride information list can show more properties, like age and running cost.</li>
    <li>Feature: Added translations for Czech and Japanese.</li>
    <li>Feature: Added Hong Kong dollar, New Taiwan dollar and Chinese yuan as currencies.</li>
    <li>Feature: Weather cheat now allows for more types of weather.</li>
    <li>Feature: Use fontconfig on Linux and Objective-C APIs on OS X to detect fonts and provide a fallback if necessary.</li>
    <li>Feature: Ability to automatically open shops after placing them.</li>
    <li>Feature: Ability to change the default inspection interval for rides.</li>
    <li>Feature: Ability to disable lightning effect during a thunderstorm.</li>
    <li>Feature: Ability to set ownership of map edges.</li>
    <li>Feature: Display a chat hotkey when joining a server.</li>
    <li>Change: Server IP addresses are no longer shown in the server list.</li>
    <li>Change: Theme format changed from INI to JSON (INI format no longer supported).</li>
    <li>Change: Sound controls re-worked to control sound effects and ride music separately.</li>
    <li>Change: Use native line endings in config.ini.</li>
    <li>Change: Remove default audio device from audio device dropdown in Linux.</li>
    <li>Technical: lodepng dropped in return for libpng.</li>
    <li>Technical: SDL2 upgraded from 2.0.3 to 2.0.4.</li>
    <li>Technical: argparse dropped in return for bespoke command line parsing implementation.</li>
    <li>Technical: Integrated breakpad for (manual) crash reporting</li>
    <li>Improve: performance of rendering, particularly for highly populated parks.</li>
    <li>Improve: performance of loading parks.</li>
    <li>Improve: support for hacked parks.</li>
    <li>Removed: Anti-cheat code that detected money hack attempts.</li>
    <li>Fix: Dated autosave files are not created on OSX and Linux.</li>
    <li>Fix: Title sequence directories are not deleted when title sequence is deleted on OSX and Linux.</li>
    <li>Fix: Tile not highlighted when placing staff members.</li>
    <li>Fix: Various de-synchronisation issues in multiplayer.</li>
    <li>Fix: Cheats not supported in multiplayer.</li>
    <li>Fix: [#1333] Rides never become safe again after a crash.</li>
    <li>Fix: [#1742] Non-ascii characters in scenario details not showing correctly.</li>
    <li>Fix: [#2126] Ferris Wheels set to "backward rotation" stop working (original bug).</li>
    <li>Fix: [#2449] Turning off Day/Night Circle while it is night doesn't reset back to day.</li>
    <li>Fix: [#2477] When opening the built-in load/save dialog, the list is not properly sorted.</li>
    <li>Fix: [#2650] Server did not validate actions send from clients (caused error box and desynchronisation).</li>
    <li>Fix: [#2651] Ride was not removed when multiplayer client aborted ride construction.</li>
    <li>Fix: [#2654] Free transport rides can prevent guests from properly leaving the park.</li>
    <li>Fix: [#2657] Don't create copies of official objects due to bugged saves (original bug).</li>
    <li>Fix: [#2681] When lowering/raising land/water with clearance checks off, walls still get removed.</li>
    <li>Fix: [#2693] Multiplayer chat caret does not show true position.</li>
    <li>Fix: [#2704] OSX Command Key not read for keyboard shortcuts.</li>
    <li>Fix: [#2728] Closing a boat ride with passengers causes empty boats to leave the platform (original bug).</li>
    <li>Fix: [#2925] Screenshots don't show night filters.</li>
    <li>Fix: [#2941] Enter does not work on input box when on the title screen.</li>
    <li>Fix: [#2948] New Ride window incorrectly said there were track designs available when in multiplayer mode.</li>
    <li>Fix: [#2958] Unable to import RCT1 parks in the scenario editor using the load landscape dialog.</li>
    <li>Fix: [#3015] Walls in SC4/SV4 files are not imported correctly.</li>
    <li>Fix: [#3063] Search exe directory for SSL bundle as well as CWD.</li>
    <li>Fix: [#3120] Negative cash in finance window is not red.</li>
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
    <li>Feature: Ability to change game speed via toolbar or (+ and     <li>keys).</li>
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
