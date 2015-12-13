<!DOCTYPE html>
<html lang="en-GB" dir="ltr">
<head>
	<meta charset="utf-8"/>
	<title>@yield('title', "OpenRCT2")</title>
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
  <meta property="og:image" content="https://openrct2.org/forums/uploads/monthly_2015_11/Icon(512).png.d902a335ac235dba2f77eeb6aeec9591.png">
  <meta property="og:title" content="OpenRCT2">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://openrct2.org/">
  <meta property="og:site_name" content="OpenRCT2">
  <meta property="og:locale" content="en_GB">
  <meta name="theme-color" content="#71abed">

  <link rel="stylesheet" href="{{asset('assets/stylesheets/reset.css')}}" />
  <link rel="stylesheet" href="{{asset('assets/stylesheets/styles.css')}}" />
  <link href='https://fonts.googleapis.com/css?family=PT+Sans:300,400,700|Oswald:400' rel='stylesheet' type='text/css'>
  
</head>
<body>

	@yield('body')

  <script>
  /*
  	(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  	(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  	m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  	})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  	ga('create', 'UA-3293028-58', 'openrct2.org');
  	ga('require', 'linkid');
  	ga('send', 'pageview');
    */
  </script>


  <a data-controller="plugins.baseBackToTop" rel="nofollow" href="#top" id="back-to-top" title="Back to top">
  	<i class="fa fa-angle-up"></i>
  </a>

	</body>
</html>
</body>
</html>
