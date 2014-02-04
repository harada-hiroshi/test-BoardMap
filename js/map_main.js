//=============================================================================
// エントリーポイント
//=============================================================================
DEBUG_PROXY=true;
PROXY_URL="ba-simple-proxy.php";

API_KEY="2a78b1a65702832d27b817a908b42f227f8dc377";//todo::APIキー 最終はキーなしで取得出来る必要あり
CAT_URL="http://beta.shirasete.jp/projects/ieiri-poster/issue_categories.json";
ISSU_URL="http://beta.shirasete.jp/projects/ieiri-poster/issues.json";
ZOOM_LEVEL=15;
MAXZOOM=19;
MINZOOM=9;
DEFAULT_LAT=35.69623329057935;
DEFAULT_LNG=139.70226834829097;
var currentInfoWindow;

$(function() {
  initialize(DEFAULT_LAT,DEFAULT_LNG,MINZOOM);
});
//google.maps.event.addDomListener(window, 'load', initialize);//ロード時に初期化実行

//=============================================================================
// 初期化　コンストラクタ
//=============================================================================
var map;
var m_map_data_manager;
var geocoder;

function initialize(plat,plng,zoom) {
  //マップ・データオブジェクトの初期化
  var myOptions = {
    zoom: zoom,
    center: new google.maps.LatLng(plat,plng),
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    //disableDoubleClickZoom:true,//ダブルクリックによるズームと中央揃えを無効
    maxZoom:MAXZOOM,
    minZoom:MINZOOM,
        //Gmapのボタン位置
        mapTypeControl: false,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.BOTTOM_CENTER
        },
        panControl: false,
       /* panControlOptions: {
            position: google.maps.ControlPosition.TOP_RIGHT
        },*/
        zoomControl: true,
        zoomControlOptions: {
            style: google.maps.ZoomControlStyle.LARGE,
            position: google.maps.ControlPosition.LEFT_BOTTOM
        },
        scaleControl: false,
        /*scaleControlOptions: {
            position: google.maps.ControlPosition.TOP_LEFT
        },*/
        streetViewControl: true,
        streetViewControlOptions: {
            position: google.maps.ControlPosition.TOP_LEFT
        }
  };
  map = new google.maps.Map(document.getElementById('map_canvas'), myOptions);
  geocoder = new google.maps.Geocoder();//ジオコーダー
  $(document).m_map_data_manager({map:map});//データ管理OBJ
  m_map_data_manager=$(document).data('m_map_data_manager');


    //行政区選択リスト生成
    if(DEBUG_PROXY){
        $.getJSON(PROXY_URL,{'url':CAT_URL+'?key='+API_KEY},cb);
    }else{
        $.getJSON(CAT_URL,{'key':API_KEY},cb);
    }
    function cb(d){
        //行政区の移動 リスト版////////
        var opl=$('<ul/>');
        if(!d.issue_categories){return;}
        $.each(d.issue_categories,function(i,val){
            opl.append('<li><label><input type="checkbox" name="" value="'+val['id']+'" />'+val['name']+'</label></li>');
        });

        var acbtn=$('<hr/><a href="javascript:void(0);" onclick="()" class="btn center">表示</a>');
        acbtn.bind("click",function(eve){
            //選択した行政区のリストを生成し、行政区に該当する掲示板の問い合わせ
            var ids=[];
            $(':checked',opl).each(function(){
                ids.push($(this).val());
            });
            m_map_data_manager.map_data_clear();
            m_map_data_manager.set_category_ids(ids);
            m_map_data_manager.load_data();
        });

        $('#area_list').append(opl);
        $('#area_list').after(acbtn);


        //行政区の移動 プルダウン版////////
        var op=$('<select/>');
        if(!d.issue_categories){return;}
        var g=d.issue_categories;
        op.append('<option value="">地域を選択</option>');

        $.each(g,function(i,val){
            op.append('<option value="'+val['id']+'">'+val['name']+'</option>');
        });
        op.bind("change",function(eve){
            //行政区に該当する掲示板の問い合わせ
            var category_id=$('option:selected',this).val();
            if(category_id){
                m_map_data_manager.map_data_clear();
                m_map_data_manager.set_category_ids([category_id]);
                m_map_data_manager.load_data();
            };
        })
        $('#move_area_distince').empty().append(op);
    }

    //=============================================================================
    // イベントバインド
    //=============================================================================

    //ステータス変更
    $("#move_area_status").change(function(){
        m_map_data_manager.map_data_clear();
        m_map_data_manager.set_status($(this).val());
        m_map_data_manager.load_data();
    });
  //ウインドウリサイズ完了
  var timer = null;
  $(window).bind("resize",function(){
    if (timer){clearTimeout(timer);};
    timer = setTimeout(re_size_window_comp, 500);
  });

  //地図データ変更完了時処理
    $(document).bind("on_map_data_change_befor", function(){
        show_load_lock();//読み込み中画面の表示
    });
    $(document).bind("on_map_data_change_after", function(){
        hide_load_lock();//読み込み中画面の解除
        hide_float_panel();
    });

    //センター移動
    //google.maps.event.addListener(map, 'center_changed', function() {})

    //クリック
    google.maps.event.addListener(map, 'click', function() {
        //吹き出しを閉じる
        if(currentInfoWindow){
            currentInfoWindow.close();
        }
    })

  //ズーム変更
  google.maps.event.addListener(map, 'zoom_changed', function(){});
  //ドラッグ移動終了　
  google.maps.event.addListener(map, 'dragend',function(){
    //ドラッグ移動終了＞画面停止イベント ドラッグ終了後の「idle」にバインド
    google.maps.event.addListenerOnce(map, 'idle', function(){
      //map_dragend();
    });
  });
  //APP初期化完了時イベント
  google.maps.event.addListener(map, 'projection_changed', function(){
    google.maps.event.addListenerOnce(map, 'tilesloaded', function(){
            //
    });
  });

  ////コンテンツ初期化//////////////////////////////////////////
  //ウインドウ内地図リサイズ
  re_size_window_comp();

    //詳細表示ボックス選択
   // $("#show_info").eq(0).click();
}

//=============================================================================
// イベント処理
//=============================================================================
/**
 * ウインドウリサイズ完了
 */

function re_size_window_comp(){
  //パネル配置計算
  var rp=$("#right_wrap").position();
  var wh=$(window).height();
  var ww=$(window).width();
  var mp=$("#map_canvas").position();
    var rl=ww-($("#right_wrap").width());
  //var rl=ww-($("#right_wrap").width()+20);//20はスクロールバー分
  $("#right_wrap").css({left:rl});
  $("#map_canvas").css({width:rl,height:wh-mp.top});
  google.maps.event.trigger(map, 'resize');
}





//=============================================================================
// ボタン操作用
//=============================================================================

/*
 * エリアの移動（住所）
 */
function move_area_address(){
  var addre=$("#move_area_address").val();
   if(!geocoder){alert("geocoderエラー");return;}
    geocoder.geocode({ 'address': addre}, function(res, st)
    {
        if (st == google.maps.GeocoderStatus.OK) {
      var location = res[0].geometry.location;
      map.panTo(location);
      hide_float_panel();
    }else if(st ==google.maps.GeocoderStatus.INVALID_REQUEST||st ==google.maps.GeocoderStatus.ZERO_RESULTS){
      alert("入力した住所では場所が特定出来ませんでした。\n入力した住所に間違いが無いか確認して下さい。\nまた市区町村は必ず入れて下さい。");
    }else{
      alert("サーバーに接続出来ません。時間をあけてから検索してみて下さい："+st);
    }
  });

}
/**
 * GPSで現在地に移動
 */
function move_loc(){
    show_load_lock();
    navigator.geolocation.getCurrentPosition(function(pos) {
        map.panTo(new google.maps.LatLng(pos.coords.latitude,pos.coords.longitude));
        hide_load_lock();
        m_map_data_manager.map_data_clear();
        m_map_data_manager.set_location([pos.coords.latitude,pos.coords.longitude]);
        m_map_data_manager.load_nearby_data();

    }, function(e) {
        alert("error: " + e.message  );
        hide_load_lock();
    },
        {enableHighAccuracy:true,timeout:15000}
    );
}
/**
 * 詳細の表示
var tlg_show_info=false;
function show_info(){
    tlg_show_info=!tlg_show_info;
    m_map_data_manager.set_show_info(tlg_show_info);
}*/
/**
 * フロートパネルの表示・非表示
 */
function hide_float_panel(){
    $("#float_panel").hide();

}
/**
 * パネルの表示
 * @param type
 */
function show_float_panel(type){
    $("#float_panel > div").hide();
    $("#float_panel").show();
    //$("#"+type).show();
    switch (type){
        case "search":
            $("#search").show();
            break;
        case "bookmark":
            $("#bookmark").show();
            init_book_mark();
            break;
        case "info":
            $("#info").show();

            break;
    }
}
/**
 * ブックマークの初期化
 */
function init_book_mark(){
    //ブックマークの読み込み
    var list=m_map_data_manager.get_bookmark();
    /*
    var tb="<table>";
    $("#bookmark_list").empty();
    for(var i=0;i<list.length;i++){
        tb+="<tr><td>[id:"+list[i].id+"]<br/>[date:"+list[i].add_time+"]<br/>"+list[i].description+"<br/>"+list[i].subject+"<br/>"+list[i].status.name+"<hr/></td></tr>";
    }
    tb+="</table>";
   $("#bookmark_list").html(tb);
    */

    var str="";
    for(var i=0;i<list.length;i++){
        str+="[id:"+list[i].id+"]\n[date:"+list[i].add_time+"]\n"+list[i].description+"\n"+list[i].subject+"\n----------------\n";
    }
    $("#bookmark_list_txte").val(str);
}
/**
 * ブックマークの全消去
 */
function clear_book_mark(){
    if(window.confirm('全て消去しますか？')){
            m_map_data_manager.clear_bookmark();
        $("#bookmark_list_txte").val("");
    }
}
/**
 * 読み込み中画面の表示・非表示
 */
function show_load_lock(){
    var jq_img=$("#load_lock img");
    jq_img.css({"marginTop":(($(window).height() - jq_img.height()) / 2) + "px"});
    $("#load_lock").fadeIn();
}
function hide_load_lock(){
    $("#load_lock").fadeOut();
}


//ブックマーク処理
function book_mark(tar,id){
    var res=m_map_data_manager.tlg_bookmark(id);
}



/**
 * 地図の中心位置から近くの掲示板を取得 todo::実装検討
 */
function debug_get_pos(){
  var latlng=  map.getCenter();
    hide_load_lock();
    m_map_data_manager.map_data_clear();
    m_map_data_manager.set_location([latlng.lat(),latlng.lng()]);
    m_map_data_manager.load_nearby_data();
}
