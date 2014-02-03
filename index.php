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
                <option value="open">未貼付の物</option>
                <option value="close">貼付完了</option>
            </select>
        </li>
    </ul>
<a href="javascript:void(0);" onclick="show_float_panel('search')" class="btn">一括選択</a>
<!--<a href="javascript:void(0);" onclick="show_info()" class="btn ">吹出し表示</a>-->
<a href="javascript:void(0);" onclick="move_loc()" class="btn">現在地</a>
<a href="javascript:void(0);" onclick="show_float_panel('bookmark')" class="btn">★マークリスト</a>
<a href="javascript:void(0);" onclick="show_float_panel('info')" class="btn">説 明</a>
</div>
  <div id="float_panel">
        <a href="javascript:void(0);" onclick="hide_float_panel()" class="btn close">閉じる</a>
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
            <div id="bookmark_list"></div>
            <hr/>
            <a href="javascript:void(0);" onclick="clear_book_mark()" class="btn center">クリアー</a>
        </div>
        <div id="info">
            <div id="info_area">
            <p>使い方</p>
                <h5>行政区を選択</h5>
                <p>表示したい掲示板のある区を選択すると、その区の掲示板の位置が表示されます。<br/>表示出来るのは1つの区だけです。<br/>
                    複数の行政区を、まとめて表示したい場合は「一括選択」を選んで下さい。
                </p>
                <h5>ステータス</h5>
                <p>「未貼付の物」と「貼付完了」の掲示板の表示を切り替えます<br/>通常は「未貼付の物」でOKです。</p>
                <h5>一括選択</h5>
                <p>複数の行政区を、まとめて表示したい場合に使用します。<br/>表示したい区をチェックして、リスト下部の「表示」を押すと、表示されます。<br/>
                    あまり多いと表示に時間がかかったり、スマホの場合はフリーズするかもです。<br/>
                    5区以内を推奨します。
                </p>
                <h5>現在地</h5>
                <p>現在地に移動します。GPSをオンにして下さい。</p>
                <h5>マークリスト</h5>
                   <p>地図上に表示された、掲示板の位置をタップすると、住所等が書かれた吹き出しが表示されます。<br/>
                       吹き出し下の「マーク」ボタンをタップすると、その掲示板が緑色でマークされます。<br/>
                       マークした掲示板は「マークリスト」で一覧表示されます。<br/>
                       使い道は現場でポスターを貼った時にその場でマークして、作業終了後に「マークリスト」を見て、一括で報告するって感じです。
                </p>
            </div>

        </div>
    </div>
  <div id="map_wrap" >
  <div id="map_canvas" ></div>
  </div>
<div id="load_lock"><img src="js/loading.gif" />検索中</div>
</body>
</html>
