<!-- Use this layout to build a normal page with a sidebar. -->
@extends('layouts.blue')
@section('section')
@yield('specialHeader')
<div class="section">
    <div class="col span_8_of_12 ">
        @yield('page')
    </div>
    <div class="col span_4_of_12 ">
        @section('sidebar')
            This is a sidebar. Please overwrite this in your page.
        @show
    </div>
</div>
@stop
