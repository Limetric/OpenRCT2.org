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
            <td>SHA-256 Checksum</td>
            <td>File size</td>
        </tr>
    </thead>
    <tbody>
        @foreach ($downloadsBuilds as $build)
            <tr class="{{ $build->category }}" data-category="{{ $build->category }}">
                <td class="buildPlatform">{{ $build->flavourName }}</td>
                <td class="buildDownload" {!! (!empty($build->categoryReason) ? ' data-category-reason="'. $build->categoryReason .'"' : '') !!}><a href="{{$serverURL}}{{ $build->filePath }}/{{ $build->fileName }}">{{ $build->fileName }}</a></td>
                <td><acronym title="{{ $build->fileHash }}" class="hash">{{  str_limit($build->fileHash, $limit = 9, $end = '&hellip;') }}</acronym></td>
                <td class="buildSize">{{ Helpers::formatBytes($build->fileSize) }}</td>
            </tr>
        @endforeach
    </tbody>
    <script async src="//ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>
    <script>
        function defer(method) {
            if (window.jQuery)
                method();
            else
                setTimeout(function() {
                    defer(method);
                }, 50);
        }

        function escapeHtml(text) {
          return text
              .replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/"/g, "&quot;")
              .replace(/'/g, "&#039;");
        }

        //ToDo: Rewrite in plain JS so we don't have to include a lib for just 1 page
        defer(function() {
        $(document).ready(function() {
            $('table.downloadsTable tbody tr').each(function(idx) {
                var category = $(this).data('category');
                if (typeof(category) !== 'string')
                    return;

                var td = $(this).find('td.buildDownload');
                var reason = td.data('category-reason');
                if (typeof(reason) !== 'string' && category !== 'unstable')
                    return;

                if (typeof(reason) !== 'string' || reason === '')
                    reason = 'This build is unstable.';

                
                td.data('original-html', td.html());

                    
                td.html(escapeHtml(reason) +" <a class=\"unlockBuildLink\" href=\"javascript:void(0)\">Unlock download</a>.");
            });

            $('a.unlockBuildLink').click(function() {
                var td = $(this).closest('td.buildDownload');
                td.html(td.data('original-html'));
                var tr = td.closest('tr');
                tr.removeClass(tr.data('category'));
            });
        });
        });
    </script>
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
                <a href="https://github.com/{{ $commit['author']['login'] }}" target="_blank" title="View GitHub profile" rel="nofollow">{{ $commit['author']['login'] }}</a>
@endif
            </td>
            <td class="message">{{ $commit['commit']['message'] }}</td>
        </tr>
@endforeach
    	</tbody>
    </table>
@endif
@stop