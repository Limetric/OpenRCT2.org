@extends('layouts.plane')

@section('body')
<div class="page-wrap">
    <header>
        <div class="container fclear">
            <a href="/" class="fleft">
                <img src="{{asset('assets/images/logos/icon_x64.png')}}" />
                <span>OpenRCT2</span>
            </a>
            <nav class="fright">
                <ul>
                    <li{{{ (Request::is('/') ? ' class=active' : '') }}}><a href="{{ url('') }}">Home</a></li>
                    <li{{{ (Request::is('downloads*') ? ' class=active' : '') }}}><a href="{{ url('downloads') }}">Downloads</a></li>
                    <li{{{ (Request::is('features') ? ' class=active' : '') }}}><a href="{{ url('features') }}">Features</a></li>
                    <li><a href="{{ url ('forums') }}">Forums</a></li>
                    <li><a href="https://gitter.im/OpenRCT2/OpenRCT2/non-dev" target="_blank">Chat</a></li>
                </ul>
            </nav>
        </div>
    </header>
    <div class="container">
@yield('section')
    </div>
</div>
<footer>
        <div class="container">
                Copyright © {{ date('Y') }} OpenRCT2.org. <a href="mailto:mail@openrct2.org">Email webmaster</a>. <a href="https://github.com/OpenRCT2/OpenRCT2" target="_blank">OpenRCT2 on GitHub</a>. <a href="https://github.com/JarnoVgr/OpenRCT2.org" target="_blank">Website on GitHub</a>.
        </div>
</footer>
@stop