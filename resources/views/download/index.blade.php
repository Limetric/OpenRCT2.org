@extends('layouts.sidebarPage')
@section('title','Downloads - OpenRCT2 project')
@section('description','Downloads for the open-source adaption of RollerCoaster Tycoon 2. Free to download.')
@section('page')
<h1>Downloads for OpenRCT2</h1>
<div class="downloadButtons fclear">
    @foreach ($flavours as $flavour)
    <a href="{{$serverURL}}{{ $flavour->latestDownload->filePath }}/{{ $flavour->latestDownload->fileName }}" class="fleft develop">
        <img src="/assets/images/icons/{{ $flavour->iconFileName }}">
        <div>{{ $flavour->prettyText }}</div>
        <small>{{ $flavour->latestDownload->version ."-". $flavour->latestDownload->gitBranch ."-". $flavour->latestDownload->gitHashShort }} ({{ Carbon::createFromTimeStamp(strtotime($flavour->latestDownload->addedTime))->diffForHumans() }})</small>
    </a>
    @endforeach
    <a href="/downloads/master/latest" class="fright stable">
        <div>Download {{ $stable->version }} stable</div>
        <small>{{ $stable->version ."-". $stable->gitBranch ."-". $stable->gitHashShort }} ({{ Carbon::createFromTimeStamp(strtotime($stable->addedTime))->diffForHumans() }})</small>
    </a>
</div>

<h2>Recent downloads</h2>
<table class="downloadsWaterfall">
    <thead>
        <tr>
            <td class="status">Branch</td>
            <td class="name">Details</td>
            <td class="age">Age</td>
        </tr>
    </thead>
    <tbody>
    @foreach ($downloads as $download)
        <tr class="download">
            <td class="buildStatus {{ $download->status }}">{{ $download->gitBranch }}</td>
            <td class="name"><a href="/downloads/{{ $download->gitBranch }}/{{ ($download->latestInBranch ? 'latest' : $download->gitHashShort) }}">{{ $download->version }} build {{ $download->gitHashShort }}</a></td>
            <td class="age">{{ Carbon::createFromTimeStamp(strtotime($download->addedTime))->diffForHumans() }}</td>
        </tr>
    @endforeach
    </tbody>
</table>
<h2>OpenRCT2 Launcher for Windows, Linux and OS X</h2>
<div class="section">
    <div class="col span_7_of_12">
        <p>
            The OpenRCT2 Launcher makes playing OpenRCT2 very simple. Just open our
            launcher, wait a few seconds and be ready to play. Without the launcher,
            you would have to update your game every time an update was made!
        </p>
        <p style="text-align: center;">
        	<a href="https://openrct.net/OpenRCT2%20Launcher.application">Download Launcher for Windows</a><br>
        	<a href="https://github.com/LRFLEW/OpenRCT2Launcher/releases/latest" target="_blank">Download cross-platform Launcher for OS X, Linux and Windows</a>
        </p>
    </div>
    <div class="col span_5_of_12">
        <img src="/media/launcher_screenshot.png" style="max-width: 100%;" />
    </div>
</div>

@stop

@section('sidebar')
    <h2 class="orange">Information</h2>

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
        Alternatively, <a href="/download-demo">this demo</a> can be used.
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