@extends('layouts.sidebarPage')
@section('title','Download OpenRCT2')

@section('page')

<h2 class="blue">Download OpenRCT2</h2>
<div class="downloadButtons">
    <a href="/download/latest/{{ $latest['stable'] }}" class="fleft stable">
        Download Stable: {{ $latest['stable'] }}
    </a>
    <a href="/download/latest/develop" class="fright develop">
        Download Develop: {{ $latest['develop'] }}
    </a>
</div>

<table class="downloadsWaterfall">
    <thead>
        <tr>
            <td class="status"></td>
            <td class="name">Name</td>
            <td class="age">Age</td>
        </tr>
    </thead>
    <tbody>
    @foreach ($downloads as $download)
        <tr class="download">
            <td class="buildStatus {{ $download->status }}">{{ $download->gitBranch }}</td>
            <td class="name"><a href="/download/{{ $download->gitBranch }}/{{ $download->gitHashShort }}">{{ $download->version }} build {{ $download->gitHashShort }}</a></td>
            <td class="age">{{ Carbon::createFromTimeStamp(strtotime($download->addedTime))->diffForHumans() }}</td>
        </tr>
    @endforeach
    </tbody>
</table>

<h2 class="blue">OpenRCT2 Launcher for Windows</h2>
<div class="section">
    <div class="col span_7_of_12">
        <p>
            The OpenRCT2 Launcher makes playing OpenRCT2 very simple. Just open our
            launcher, wait a few seconds and be ready to play. Without the launcher,
            you would have to update your game files manually every time an update
            was made!
        </p><br />
        <p>
            The Launcher only works on Windows. If you want to play on Linux or
            OS X, scroll down to the Builds, which are now available for all platforms.
        </p><br />
        <center>
            <a href="https://openrct.net/OpenRCT2%20Launcher.application">Click
                here to download the OpenRCT2 Launcher</a>
        </center>
    </div>
    <div class="col span_5_of_12">
        <img src="/media/launcher_screenshot.png" style="max-width: 100%;" />
    </div>
</div>

@stop

@section('sidebar')
    <h2 class="orange">Note</h2>

    <p>Please bear in mind OpenRCT2 is in early beta stage. Crashes and bugs are
        common. If a build is not working, try an older one. You can report bugs
        on <a href="https://github.com/OpenRCT2/OpenRCT2/issues">GitHub</a> or on
        the <a href="/forums/forum/2-problems-bugs-and-feedback/">forums</a>.
    </p>
    <p>An installation of RollerCoaster Tycoon 2 is required in order to play
        OpenRCT2. RCT2, with expansions, is cheap nowadays and can be bought from
        <a href="https://www.g2a.com/r/openrct2" target="_blank">G2A</a>,
        <a href="http://www.gog.com/game/rollercoaster_tycoon_2" target="_blank">GOG</a>
        and <a href="http://store.steampowered.com/app/285330/" target="_blank">Steam</a>.
        Alternatively, you can play the full game for free by <a href="/download-demo">downloading this demo</a>.
    </p>

    <h2 class="blue">About OpenRCT2</h2>
    <p>
        OpenRCT2 is a free open source remake of RollerCoaster Tycoon 2. The
        developers have taken the original game, decompiled it and rewrote
        everything into a newer language.
        This allows developers to extend the gameplay, alter the game, or even port the game to other platforms.
        At this moment, the game is playable on Windows, Linux and OS X.
    </p>
@stop
