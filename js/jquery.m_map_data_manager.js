/**
 * 地図データ管理
 * ●イベント

*/

(function($) {
//=============================================================================
// 初期化　コンストラクタ
//=============================================================================
$.m_map_data_manager = function(element, options) {
  var plugin = this;
  var defaults ={
        'status_id':'open',//todo::取得モード　未貼付け close 終了 open 引数のリテラル確認
        'category_ids':[],
        'location':[]
   };
  plugin.settings = {};
  var $element = $(element),element = element;
  var _select_comp_list={};
    var _select_comp_list_data={};
  var _map_data={};
  var _del_map_list=[];
  var _add_map_list=[];
  var _overlay = {};
  var _is_show_info=false;
  var _zoomLevel;
  ////////usr constructor//////////////
  plugin.init = function() {
    plugin.settings = $.extend({}, defaults, options);//デフォルト値の上書き
        //地図のズーム時の処理
    if(plugin.settings.map){
      _zoomLevel=plugin.settings.map.getZoom();
      google.maps.event.addListener(plugin.settings.map, 'zoom_changed', function(){
        _zoomLevel = plugin.settings.map.getZoom();
                plugin.set_show_info();//マーカーの表示
      });
    }
        //ブックマークデータをstorageから読み込み
        var ls=_load_storage("bookmark");
        for(var i in ls){
            _select_comp_list_data[i]=ls[i];
            _select_comp_list[i]=true;
        }
    };
//=============================================================================
// public method
//=============================================================================

    /**
     * オーバレイの取得
     */
    plugin.get_overlay=function(){
        return _overlay;
    }
    /**
     * マーカーの表示設定
     */
    plugin.set_show_info=function(flg){
        _is_show_info=(flg==undefined)?_is_show_info:flg;
        //ラベル表示・非表示設定（一定以下の縮尺で表示）
        var info_sw=(_is_show_info&&(_zoomLevel >= 16))?true:false;
        for (var i in _overlay){
            _overlay[i].show_info(info_sw);
        }
    }
    /**
     * ステータスの変更
     */
    plugin.set_status=function(str){
        plugin.settings.status_id=str;
    }
    /**
     * 読み込む行政区のリスト設定
     * @param array
     */
    plugin.set_category_ids=function(array){
        plugin.settings.category_ids=array;
    }

    /**
     * 近くの掲示板の取得用ロケーション設定
     * @param array ([lat,lng])
     */
    plugin.set_location=function(array){
        plugin.settings.location=array;
    }

  /**
   * 行政区に該当する掲示板の問い合わせ
   */
  plugin.load_data = function(){
        if(!plugin.settings.category_ids.length){return;}
        //データ更新前イベント
        $(element).trigger("on_map_data_change_befor");
        for(var i in plugin.settings.category_ids){
            var category_id=plugin.settings.category_ids[i];
            if(DEBUG_PROXY){
                $.getJSON(PROXY_URL,{'url':ISSU_URL+'?key='+API_KEY+'&status_id='+plugin.settings.status_id+'&category_id='+category_id+'&limit=100'},_receive_new_area);
            }else{
                $.getJSON(ISSU_URL,{'key':API_KEY,'status_id':plugin.settings.status_id,'category_id':category_id,'limit':100},_receive_new_area);
            }
        }
  };

  /**
   * 現在地近くの掲示板の問い合わせ
   */
  plugin.load_nearby_data = function(){
        if(!plugin.settings.location.length){return;}
        //データ更新前イベント
        var loc = plugin.settings.location
        $(element).trigger("on_map_data_change_befor");
        if(DEBUG_PROXY){
          $.getJSON(PROXY_URL,{'url':ISSU_URL+'?key='+API_KEY+'&status_id='+plugin.settings.status_id+'&sort=geom:'+loc.join(',')+'&limit=100'},_receive_new_area);
        }else{
          $.getJSON(ISSU_URL,{'key':API_KEY,'status_id':plugin.settings.status_id,'sort':'geom:' + loc.join(','),'limit':100},_receive_new_area);
        }
  };


    /**
     * マーカーデータのclear
     */
    plugin.map_data_clear=function(){
        for(var i in _overlay){
            var ov=_overlay[i];
            if(ov){
                ov.setMap(null);
                delete _overlay[i];
            }
        }
        _map_data={};
    }
    /**
     * マーカー全体を表示出来るサイズにズームする
     */
    plugin.set_current_map_position=function(){
        var bounds = new google.maps.LatLngBounds();
        var map_div_size={height:map.getDiv().offsetHeight,width:map.getDiv().offsetWidth};
        // マーカー全体を囲む矩形を算出
        var obj_len=0;
        for (var i in _overlay){
            bounds.extend(_overlay[i].get_marker_position());
            ++obj_len;
        }
        if(obj_len){
            map.setCenter(bounds.getCenter());
            map.setZoom(ZOOM_LEVEL);
        }else{
            map.setCenter(new google.maps.LatLng(DEFAULT_LAT,DEFAULT_LNG));
            map.setZoom(ZOOM_LEVEL);
        }

    }


    /**
     * ブックマークの追加
     */
    plugin.tlg_bookmark=function(rec_id){
        if(_select_comp_list[rec_id]){
            delete _select_comp_list[rec_id];
            delete _select_comp_list_data[rec_id];
        }else{
            _select_comp_list[rec_id]=true;
            //ブックマークの情報追加
            var rec=_map_data[rec_id];
            _select_comp_list_data[rec_id]=
            {
                'id':rec_id,
                'add_time':comDateFormat(new Date(),'yyyy/MM/dd HH:mm'),
                'description':rec.description,
                'subject':rec.subject,
                'status':{'id':rec.status.id,'name':rec.status.name}
            }
        }
        _save_storage("bookmark",_select_comp_list_data)//storage保存
        _overlay[rec_id].refresh();//再描画
    }
    /**
     * ブックマークの全削除
     */
    plugin.clear_bookmark=function(id){
        _save_storage("bookmark",{});
        for(var i in _select_comp_list){
            delete _select_comp_list[i];
            delete _select_comp_list_data[i];
            if(_overlay[i]){
                _overlay[i].refresh();//再描画
            }
        }
    }
    /**
     * ブックマークのリストを取得
     */
    plugin.get_bookmark=function(){
        var list=[];
        for(var i in _select_comp_list_data){
            list.push(_select_comp_list_data[i]);
        }
        //日付でソートして返す
        list.sort(function(a, b){
            if (a.add_time > b.add_time){
                return -1
            }
            if (a.add_time < b.add_time){
                return 1
            }
            return 0;
        });
        return list;
    }
//=============================================================================
// private method
//=============================================================================
    /**
     * 永続データの保存
     */
    var _save_storage=function(key,obj){
        var storage_json_str="";
        try{
            storage_json_str = JSON.stringify(obj);
        }catch(e){
            storage_json_str="";
        }
        if(!window.localStorage){
            //ieではローカルhtmlで動作しない
            alert("このブラウザではlocalStorageは使えません");
            return;
        }else{
            // new String()でオブジェクトとして明示しないと、代入値がnullの場合、IE8でクラッシュする
            window.localStorage[key] = new String(storage_json_str);
            return true;
        }
    }
    /**
     * 永続データの取得
     */
    var _load_storage=function(key){
        var storage_json_str="";
        if(!window.localStorage){
            alert("このブラウザではlocalStorageは使えません");
            return;
        }else{
            storage_json_str=window.localStorage[key];
        }
        var obj=null;
        try{
            obj=JSON.parse(storage_json_str);
        }catch(e){
            //alert(e);
        }
        return obj;
    }

    /**
     * 永続データの全削除
     */
    var _all_delete_storage=function(){
        if(!window.localStorage){
            return false;
        }else{
            window.localStorage.clear();
            return true;
        }
    }

  /**
   * マーカーデータの受信時
   */
  var _receive_new_area= function(json_d){
    console.log("issues = " + json_d.issues.length);
    _data_substitution(json_d);
    _map_data_draw();//マーカーの描画
        plugin.set_current_map_position();
        //データ更新完了イベント
        $(element).trigger("on_map_data_change_after");
  };

  /**
   * データの差分更新
     * todo::API側で経度緯度で表示している地図の範囲に該当する掲示板を返せるような仕様ならば、ここを改修
   */
  var _data_substitution= function(data){
        if(!data.issues){return;}
        var list={};
        $.each(data.issues,function(i,val){
            list[val.id]=val;
        });

    //新しく追加される差分を検出
        _add_map_list=[];
        for(var i in list){
            if(!_map_data[i]){//{id番号:掲示板データ,id番号2:掲示板データ}
                _add_map_list.push(i);
                _map_data[i]=list[i];
            }

        };

        /*
         //---------------------------//
         //API側で経度緯度で該当する掲示板を返せるような仕様ならば、以下で画面外のマーカーを削除する
         //---------------------------//
    //削除される差分を検出（追加したdata以外の物）
    _del_map_list=[];
    for(var d in _map_data){
      if(!data[d]){
        _del_map_list.push(d);
      }
    }*/

    //_map_data=list;

  };

  /**
   * 追加・削除する掲示板データを元にマーカーを追加・削除
   */
  var _map_data_draw=function(){
    for (var i in _add_map_list){
      var id=_add_map_list[i];

      var data=_map_data[id];
      if(data){
        _overlay[id]=new MapOverlay(map, data,plugin,_select_comp_list);
      }

    }

    /*
         //---------------------------//
         //API側で経度緯度で該当する掲示板を返せるような仕様ならば、以下で画面外のマーカーを削除する
         //---------------------------//
         //エリアの削除
    for (var d in _del_map_list){
      var id=_del_map_list[d];
      var ov=_overlay[id];
      if(ov){
        ov.setMap(null);
        delete _overlay[id];
      }
    }*/
        plugin.set_show_info();
  }
    /**
     * 矩形に収まるようにズームレベルを算出する
     */
    var _getBoundsZoomLevel=function(bounds, mapDim) {
        var WORLD_DIM = { height: 256, width: 256 };
        var ZOOM_MAX = MAXZOOM;

        function latRad(lat) {
            var sin = Math.sin(lat * Math.PI / 180);
            var radX2 = Math.log((1 + sin) / (1 - sin)) / 2;
            return Math.max(Math.min(radX2, Math.PI), -Math.PI) / 2;
        }

        function zoom(mapPx, worldPx, fraction) {
            return Math.floor(Math.log(mapPx / worldPx / fraction) / Math.LN2);
        }

        var ne = bounds.getNorthEast();
        var sw = bounds.getSouthWest();

        var latFraction = (latRad(ne.lat()) - latRad(sw.lat())) / Math.PI;

        var lngDiff = ne.lng() - sw.lng();
        var lngFraction = ((lngDiff < 0) ? (lngDiff + 360) : lngDiff) / 360;

        var latZoom = zoom(mapDim.height, WORLD_DIM.height, latFraction);
        var lngZoom = zoom(mapDim.width, WORLD_DIM.width, lngFraction);
        var r=Math.min(latZoom, lngZoom, ZOOM_MAX);

        return isNaN(r)?MINZOOM:r;
    }
//=============================================================================
// plgin private method
//=============================================================================
  plugin.init();
};
 
 $.fn.m_map_data_manager = function(options) {
  return this.each(function() {
   if (void(0) == $(this).data('m_map_data_manager')) {
    var plugin = new $.m_map_data_manager(this, options);
    $(this).data('m_map_data_manager', plugin);
   };
  });
 
 };
 
})(jQuery);
