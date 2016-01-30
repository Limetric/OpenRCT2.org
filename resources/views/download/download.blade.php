@extends('layouts.normalPage')
@section('title',(isset($latest) ? 'Latest': 'Download') .' '. $download->version .'-'. $download->gitBranch . (!isset($latest) ? ' build '. $download->gitHashShort : ' download') .' - OpenRCT2 project')
@section('description','Download OpenRCT2 '. $download->version .'-'. $download->gitBranch .' build '. $download->gitHashShort .' of the OpenRCT2 project. The open-source adaption of RollerCoaster Tycoon 2.')
@section('page')
<h1>{{ isset($latest) ? 'Latest' : 'Download' }} OpenRCT2 {{ $download->version .'-'. $download->gitBranch . (!isset($latest) ? ' build '. $download->gitHashShort : ' download') }}</h1>
<p>Status &amp; Branch: <span class="buildStatus {{ $download->status }}">{{ $download->gitBranch }}</span><br>
Based on commit hash: <a href="https://github.com/OpenRCT2/OpenRCT2/commit/{{ $download->gitHash }}" target="_blank" title="View commit on GitHub" rel="nofollow">{{ $download->gitHash }}</a><br>
Available since: {{ $download->addedTime }} ({{ Carbon::createFromTimeStamp(strtotime($download->addedTime))->diffForHumans() }})</p>
<h2>Available downloads</h2>
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
            <td class="author">
@if(isset($commit['author']))
                <img alt="{{ $commit['author']['login'] }}'s avatar" title="{{ $commit['author']['login'] }}" src="{{ $commit['author']['avatar_url'] }}" style="width:40px;height:40px;">
@endif
            </td>
            <td class="message">{{ $commit['commit']['message'] }}</td>
        </tr>
@endforeach
    	</tbody>
    </table>
@endif
@stop