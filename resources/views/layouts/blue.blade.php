@extends('layouts.plane')

@section('body')
<header>
  <div class="container">
    <div class="header_logo">
      <a href="/">
        <img src="{{asset('assets/images/logos/icon_x64.png')}}" />
        <span>OpenRCT2</span>
      </a>
    </div>
    <nav>
      <ul>
        <li><a href="{{ url ('') }}">Home</a></li>
        <li><a href="{{ url ('downloads') }}">Downloads</a></li>
        <li><a href="{{ url ('forums') }}">Forums</a></li>
        <li><a href="{{ url ('coastercloud') }}">CoasterCloud</a></li>
      </ul>
    </nav>
  </div>
</header>
<div class="container">
  @yield('section')
</div>

@stop
