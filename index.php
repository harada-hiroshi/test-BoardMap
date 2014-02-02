<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no">

    <!-- Run in full-screen mode. -->
    <meta name="apple-mobile-web-app-capable" content="yes">

    <!-- Make the status bar black with white text. -->
    <meta name="apple-mobile-web-app-status-bar-style" content="black">

    <!-- Customize home screen title. -->
    <meta name="apple-mobile-web-app-title" content="Web App">

    <!-- Disable phone number detection. -->
    <meta name="format-detection" content="telephone=no">

    <!-- Set viewport. -->
    <meta name="viewport" content="initial-scale=1">

    <!-- Prevent text size adjustment on orientation change. -->
    <style>html { -webkit-text-size-adjust: 100%; }</style>


    <!-- Icons -->

    <!-- iOS 7 iPad (retina) -->
    <link href="/static/images/apple-touch-icon-152x152.png"
          sizes="152x152"
          rel="apple-touch-icon">

    <!-- iOS 6 iPad (retina) -->
    <link href="/static/images/apple-touch-icon-144x144.png"
          sizes="144x144"
          rel="apple-touch-icon">

    <!-- iOS 7 iPhone (retina) -->
    <link href="/static/images/apple-touch-icon-120x120.png"
          sizes="120x120"
          rel="apple-touch-icon">

    <!-- iOS 6 iPhone (retina) -->
    <link href="/static/images/apple-touch-icon-114x114.png"
          sizes="114x114"
          rel="apple-touch-icon">

    <!-- iOS 7 iPad -->
    <link href="/static/images/apple-touch-icon-76x76.png"
          sizes="76x76"
          rel="apple-touch-icon">

    <!-- iOS 6 iPad -->
    <link href="/static/images/apple-touch-icon-72x72.png"
          sizes="72x72"
          rel="apple-touch-icon">

    <!-- iOS 6 iPhone -->
    <link href="/static/images/apple-touch-icon-57x57.png"
          sizes="57x57"
          rel="apple-touch-icon">

    <!-- Startup images -->

    <!-- iOS 6 & 7 iPad (retina, portrait) -->
    <link href="/static/images/apple-touch-startup-image-1536x2008.png"
          media="(device-width: 768px) and (device-height: 1024px)
                 and (orientation: portrait)
                 and (-webkit-device-pixel-ratio: 2)"
          rel="apple-touch-startup-image">

    <!-- iOS 6 & 7 iPad (retina, landscape) -->
    <link href="/static/images/apple-touch-startup-image-1496x2048.png"
          media="(device-width: 768px) and (device-height: 1024px)
                 and (orientation: landscape)
                 and (-webkit-device-pixel-ratio: 2)"
          rel="apple-touch-startup-image">

    <!-- iOS 6 iPad (portrait) -->
    <link href="/static/images/apple-touch-startup-image-768x1004.png"
          media="(device-width: 768px) and (device-height: 1024px)
                 and (orientation: portrait)
                 and (-webkit-device-pixel-ratio: 1)"
          rel="apple-touch-startup-image">

    <!-- iOS 6 iPad (landscape) -->
    <link href="/static/images/apple-touch-startup-image-748x1024.png"
          media="(device-width: 768px) and (device-height: 1024px)
                 and (orientation: landscape)
                 and (-webkit-device-pixel-ratio: 1)"
          rel="apple-touch-startup-image">

    <!-- iOS 6 & 7 iPhone 5 -->
    <link href="/static/images/apple-touch-startup-image-640x1096.png"
          media="(device-width: 320px) and (device-height: 568px)
                 and (-webkit-device-pixel-ratio: 2)"
          rel="apple-touch-startup-image">

    <!-- iOS 6 & 7 iPhone (retina) -->
    <link href="/static/images/apple-touch-startup-image-640x920.png"
          media="(device-width: 320px) and (device-height: 480px)
                 and (-webkit-device-pixel-ratio: 2)"
          rel="apple-touch-startup-image">

    <!-- iOS 6 iPhone -->
    <link href="/static/images/apple-touch-startup-image-320x460.png"
          media="(device-width: 320px) and (device-height: 480px)
                 and (-webkit-device-pixel-ratio: 1)"
          rel="apple-touch-startup-image">


    <title>MAP</title>
    <link href="./js/button.css" rel="stylesheet" media="all" type="text/css" />
    <link href="js/map_style.css" rel="stylesheet" media="all" type="text/css" />

    <script type="text/javascript" src="js/jquery-1.6.4.min.js"></script>
    <script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?sensor=false"></script>
    <script type="text/javascript" src="js/jquery.m_map_data_manager.js"></script>
    <script type="text/javascript" src="js/date.js"></script>
    <script type="text/javascript" src="js/map-overlay.js"></script>
    <script type="text/javascript" src="js/map_main.js"></script>
</head>
<body>
<div id="header">
<a href="javascript:void(0);" onclick="show_float_panel('search')" class="btn">検　索</a>
<!--<a href="javascript:void(0);" onclick="show_info()" class="btn ">吹出し表示</a>-->
<a href="javascript:void(0);" onclick="move_loc()" class="btn">現在地</a>
<a href="javascript:void(0);" onclick="show_float_panel('bookmark')" class="btn">マーク</a>
</div>
	<div id="float_panel">
        <a href="javascript:void(0);" onclick="hide_float_panel()" class="btn close">閉じる</a>
        <div id="search">
            <ul>
                <li> <span class="label">行政区</span>
                    <span id="move_area_distince"></span>
                </li>
                <li><span class="label">住所で検索</span>
                    <input name="move_area_address" class="input_text_slm" type="text" id="move_area_address" value=""/>
                    <a href="javascript:void(0);" onclick="move_area_address()" class="btn ">移動</a>
                </li>
                <li>
                    <label>ステータス
                        <select id="move_area_status">
                            <option value="open">未貼付け</option>
                            <option value="close">終了</option>
                        </select>
                    </label>
                </li>
            </ul>
        </div>
        <div id="bookmark">
            <div id="bookmark_list"></div>
            <hr/>
            <a href="javascript:void(0);" onclick="clear_book_mark()" class="btn center">クリアー</a>
        </div>
    </div>
	<div id="map_wrap" >
	<div id="map_canvas" ></div>
	</div>


<div id="load_lock"><img src="js/loading.gif" />検索中</div>
</body>
</html>
