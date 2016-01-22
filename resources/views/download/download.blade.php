@extends('layouts.normalPage')
@section('title','Download OpenRCT2')

@section('page')
<h2 class="blue">{{ $download->version }} build {{ $download->gitHashShort }}</h2>

Status &amp; Branch: <span class="buildStatus {{ $download->status }}">{{ $download->gitBranch }}</span><br>
Based on commit hash: {{ $download->gitHash }}<br>
Available since: {{ $download->addedTime }} ({{ Carbon::createFromTimeStamp(strtotime($download->addedTime))->diffForHumans() }})<br>

<h2>Download OpenRCT2 {{ $download->version }} build {{ $download->downloadId }}</h2>
<table class="downloadsTable">
    <thead>
        <tr>
            <td>Platform &amp; Type</td>
            <td>Download</td>
            <td>File size</td>
        </tr>
    </thead>
    <tbody>
        @foreach ($downloadsBuilds as $build)

            <tr>
                <td class="buildPlatform">{{ $build->flavourName }}</td>
                <td class="buildDownload"><a href="{{$serverURL}}{{ $build->filePath }}/{{ $build->fileName }}">{{ $build->fileName }}</a> <small class="hash">{{ $build->fileHash }}</small></td>
                <td class="buildSize">{{ Helpers::formatBytes($build->fileSize) }}</td>
            </tr>
        @endforeach
    </tbody>
</table>
@if(isset($commits))
    <h2>Changes in this build</h2>
    <table class="changesTable">
    	<thead>
    		<tr>
    			<td class="author">Author</td>
    			<td class="message">Message</td>
    		</tr>
    	</thead>
    	<tbody>

                @foreach ($commits as $commit)
                    <tr class="commit">
        				<td class="author"><img alt="{{ $commit['committer']['login'] }}'s avatar" title="{{ $commit['author']['login'] }}" src="{{ $commit['author']['avatar_url'] }}" style="width:40px;height:40px;"></td>
        				<td class="message">{{ $commit['commit']['message'] }}</td>
        			</tr>
                @endforeach

    	</tbody>
    </table>
@endif
@stop
