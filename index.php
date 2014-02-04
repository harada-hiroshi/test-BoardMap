<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="target-densitydpi=device-dpi, width=device-width, user-scalable=no,initial-scale=1.0,maximum-scale=1.0, minimum-scale=1.0" />

    <title>MAP</title>
    <link href="js/button.css" rel="stylesheet" media="all" type="text/css" />
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
    <ul>
        <li class="distince">
            <span id="move_area_distince"></span>
        </li>
        <li class="status">
            <select id="move_area_status">
                <option value="open">未貼付</option>
                <option value="close">貼付完了</option>
            </select>
        </li>
    </ul>
<!--<a href="javascript:void(0);" onclick="show_float_panel('search')" class="btn">一括選択</a>-->
<!--<a href="javascript:void(0);" onclick="show_info()" class="btn ">吹出し表示</a>-->
<a href="javascript:void(0);" onclick="move_loc()" class="btn">付近の掲示板を表示</a>
<a href="javascript:void(0);" onclick="show_float_panel('bookmark')" class="btn">MarkList</a>

<a href="javascript:void(0);" onclick="show_float_panel('info')" class="btn">説明</a>
<!--<a href="info.html" target="_blank" class="btn">説明</a>-->
</div>
  <div id="float_panel">
        <a href="javascript:void(0);" onclick="hide_float_panel()" class="btn close">Close</a>
        <div id="search">
            <ul>
                <!--todo::「住所で検索」は廃止。（住所検索しても、緯度経度から掲示場所を取得するAPIが無い為、表示しても意味が無い）-->
                <!--<li><span class="label">住所で検索</span>
                    <input name="move_area_address" class="input_text_slm" type="text" id="move_area_address" value=""/>
                    <a href="javascript:void(0);" onclick="move_area_address()" class="btn ">移動</a>
                </li>-->
                <li>
                    <div id="area_list"></div>

                </li>
            </ul>
        </div>
        <div id="bookmark">
            <textarea name="bookmark_list_txte" id="bookmark_list_txte" cols="45" rows="20"></textarea>
            <!--<div id="bookmark_list">

            </div>-->
            <hr/>
            <a href="javascript:void(0);" onclick="clear_book_mark()" class="btn center">クリアー</a>
        </div>
        <div id="info">
            <iframe id="info_area" src="info.html" ></iframe>
        </div>
    </div>
  <div id="map_wrap" >
  <div id="map_canvas" ></div>
  </div>
<div id="load_lock"><img src="js/loading.gif" />検索中</div>
</body>
</html>
