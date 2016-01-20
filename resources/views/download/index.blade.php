@extends('layouts.sidebarPageWithHeader')
@section('title','Download OpenRCT2')

@section('specialHeader')
<h2 class="blue">Download OpenRCT2</h2>
@stop
@section('sidebar')
<p>Please bear in mind OpenRCT2 is in early beta stage. Crashes and bugs are
    common. If a build is not working, try an older one. You can report bugs
    on <a href="https://github.com/OpenRCT2/OpenRCT2/issues">GitHub</a> or on
    the <a href="/community/category/4/comments-bugs-feedback">forums</a>.
</p>
<p>An installation of RollerCoaster Tycoon 2 is required in order to play
    OpenRCT2. RCT2, with expansions, is cheap nowadays and can be bought from
    <a href="https://www.g2a.com/r/openrct2" target="_blank">G2A</a>,
    <a href="http://www.gog.com/game/rollercoaster_tycoon_2" target="_blank">GOG</a>
    and <a href="http://store.steampowered.com/app/285330/" target="_blank">Steam</a>.
    Alternatively, you can play the full game for free by
    <a href="/download-demo">installing this demo</a>.
</p>

@stop
@section('page')
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
            <td class="name"><a href="/download/{{ $download->downloadId }}">{{ $download->version }} build {{ $download->downloadId }}</a></td>
            <td class="age">{{ Carbon::createFromTimeStamp(strtotime($download->addedTime))->diffForHumans() }}</td>
        </tr>
    @endforeach
    </tbody>
</table>
@stop
