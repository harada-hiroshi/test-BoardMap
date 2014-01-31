//=============================================================================
// エントリーポイント
//=============================================================================
DEBUG_PROXY=true;
PROXY_URL="ba-simple-proxy.php";

API_KEY="2a78b1a65702832d27b817a908b42f227f8dc377";//todo::APIキー 最終はキーなしで取得出来る必要あり

CAT_URL="http://beta.shirasete.jp/projects/ieiri-poster/issue_categories.json";
ISSU_URL="http://beta.shirasete.jp/projects/ieiri-poster/issues.json";




$(function() {
	initialize(35.69623329057935,139.70226834829097,13);
});
//google.maps.event.addDomListener(window, 'load', initialize);//ロード時に初期化実行

//=============================================================================
// 初期化　コンストラクタ
//=============================================================================
var map;
var m_map_data_manager;
var geocoder;
/**
 * コンストラクタ
 */
function initialize(plat,plng,zoom) {
	/////マップの初期化////
	var myOptions = {
		zoom: zoom,
		center: new google.maps.LatLng(plat,plng),
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		disableDoubleClickZoom:true,//ダブルクリックによるズームと中央揃えを無効
		maxZoom:19,
		minZoom:9
	};

	map = new google.maps.Map(document.getElementById('map_canvas'), myOptions);
	geocoder = new google.maps.Geocoder();//ジオコーダー
	$(document).m_map_data_manager({map:map});//データ管理OBJ
	m_map_data_manager=$(document).data('m_map_data_manager');

	//大行政区選択プルダウン
    var op=$('<select/>');
    //todo::行政区ロード先
    if(DEBUG_PROXY){
        $.getJSON(PROXY_URL,{'url':CAT_URL+'?key='+API_KEY},cb);
    }else{
        $.getJSON(CAT_URL,{'key':API_KEY},cb);
    }

    function cb(d){
        if(!d.issue_categories){return;}
        var g=d.issue_categories;
        op.append('<option value="">選択して下さい</option>');

        $.each(g,function(i,val){
            op.append('<option value="'+val['id']+'">'+val['name']+'</option>');
        });
    }
	$('#move_area_distince').empty().append(op);

	////イベントバインド///////////////////////////////////////////
    //行政区プルダウン変更
    op.change(function(){
        t=$('option:selected',op);
        move_area_distince(t.val(),t.text());
    });
    //ステータス変更
    $("#move_area_status").change(function(){
        move_area_status($("#move_area_status").val());
    });
	//ウインドウリサイズ完了
	var timer = null;
	$(window).bind("resize",function(){
		if (timer){clearTimeout(timer);}; 	
		timer = setTimeout(re_size_window_comp, 500);
	});
	//地図データ変更
	$(document).bind("on_map_data_change",map_data_change);
	
	//ズーム変更
	google.maps.event.addListener(map, 'zoom_changed', map_zoom_changed);
	//ドラッグ移動終了　
	google.maps.event.addListener(map, 'dragend',function(){
		//ドラッグ移動終了＞画面停止イベント ドラッグ終了後の「idle」にバインド
		google.maps.event.addListenerOnce(map, 'idle', function(){
			map_dragend();
		});	
	});
	//初期化完了時に1度だけエリアデータロード
	google.maps.event.addListener(map, 'projection_changed', function(){
		google.maps.event.addListenerOnce(map, 'tilesloaded', function(){
			//m_map_data_manager.get_new_area();
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

/**
 * 地図ズームイベント
 */
function map_zoom_changed() {
}

/**
 * 地図ドラッグ完了イベント
 */
function map_dragend(){
}


/**
 * 地図データ変更
 */
function map_data_change(){
}


//=============================================================================
// ボタン操作用
//=============================================================================
/**
 * エリアの移動（行政区ID）
*/
function move_area_distince(category_id,name){
    //todo::現状はエリアの移動先をプルダウンの名称からジオコーディングで取得している為、精度が悪い。
	if(!category_id){return;}
    m_map_data_manager.get_new_area(category_id);

    //地図を強制的に移動
    $("#move_area_address").val(name);
    move_area_address();
}
/**
 * ステータスの変更
 */
function move_area_status(status){
    m_map_data_manager.set_status(status);
}

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
    navigator.geolocation.watchPosition(function(pos) {
        map.panTo(new google.maps.LatLng(pos.coords.latitude,pos.coords.longitude));
        hide_load_lock();
    }, function(e) {
        alert("error: " + e.message  );
        hide_load_lock();
    },
        {enableHighAccuracy:true,timeout:15000}
    );
}
/**
 * 詳細の表示
 */
var tlg_show_info=false;
function show_info(){
    tlg_show_info=!tlg_show_info;
    m_map_data_manager.set_show_info(tlg_show_info);
}
/**
 * フロートパネルの表示・非表示
 */
function hide_float_panel(){
    $("#float_panel").hide();

}
function show_float_panel(type){
    $("#float_panel").show();
}

/**
 * 読み込み中画面の表示
 */
function show_load_lock(){
    var jq_img=$("#load_lock img");
    jq_img.css({"marginTop":(($(window).height() - jq_img.height()) / 2) + "px"});
    $("#load_lock").fadeIn();
}
function hide_load_lock(){
    $("#load_lock").fadeOut();
}