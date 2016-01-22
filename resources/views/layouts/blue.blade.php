@extends('layouts.plane')

@section('body')
<div class="page-wrap">
    <header>
        <div class="container">
            <div class="header_logo">
                <a href="/">
                    <img src="{{asset('assets/images/logos/icon_x64.png')}}" />
                    <span>OpenRCT2</span>
                </a>
            </div>
            <div class="uppermenu">
                <!--<a href="{{ url ('forums/login') }}">Existing user? Sign in</a>
                <a href="{{ url ('forums/register') }}" class="darklink">Sign up</a>-->
                <!--
                <a href="{{ url ('forums/profile/2-runelaenen') }}" style="imglink"><img src="https://secure.gravatar.com/avatar/6c5c4bc50fd2cd167dcf59d972d201ae?d=https%3A%2F%2Fopenrct2.org%2Fforums%2Fuploads%2Fset_resources_2%2F84c1e40ea0e759e3f1505eb1788ddf3c_default_photo.png"> RuneLaenen</a>
                -->
            </div>
            <nav>
                <ul>
                    <li{{{ (Request::is('/') ? ' class=active' : '') }}}><a href="{{ url('') }}">Home</a></li>
                    <li{{{ (Request::is('downloads*') ? ' class=active' : '') }}}><a href="{{ url('downloads') }}">Downloads</a></li>
                    <li{{{ (Request::is('features') ? ' class=active' : '') }}}><a href="{{ url('features') }}">Features</a></li>
                    <li><a href="{{ url ('forums') }}">Forums</a></li>
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
                Copyright © {{ date('Y') }} OpenRCT2.org. <a href="mailto:mail@openrct2.org">Email webmaster</a>. <a href="https://github.com/JarnoVgr/OpenRCT2.org" target="_blank">Website on GitHub</a>.
        </div>
</footer>
@stop