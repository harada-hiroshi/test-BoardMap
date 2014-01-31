/**
 * 地図データ管理
 * ●イベント
 * on_map_data_change:{add,del} 地図のデータ更新時　add:object 追加データのID　del:object 削除したデータのID
 *　on_kuwake_select:object　区分けの選択時　　object 区分けのデータ
*/

(function($) {
//=============================================================================
// 初期化　コンストラクタ
//=============================================================================
$.m_map_data_manager = function(element, options) {
	var plugin = this;
	var defaults ={
        'status_id':'open'//todo::取得モード　未貼付け close 終了 open 引数のリテラル確認
 	};
	plugin.settings = {};
	var $element = $(element),element = element;
	
	var _map_data={};
	var _del_map_list=[];
	var _add_map_list=[];
	var _overlay = {};
	var _is_show_info=false;
	var _zoomLevel;
    var _cat_ids={};
	////////usr constructor//////////////
	plugin.init = function() {
		plugin.settings = $.extend({}, defaults, options);//デフォルト値の上書き
		
		//地図のzoomイベント
		if(plugin.settings.map){
			_zoomLevel=plugin.settings.map.getZoom();
			google.maps.event.addListener(plugin.settings.map, 'zoom_changed', function(){
				_zoomLevel = plugin.settings.map.getZoom();
                _maker_draw();
			});
		}	
	};
//=============================================================================
// public method
//=============================================================================

	/**
	 * エリアの問い合わせ
	 */
	plugin.get_new_area = function(category_id){
        _cat_ids[category_id]=true;
		var opt = {};
		 //センターとズーム情報取得
		opt['zoom'] = map.getZoom();
        if(DEBUG_PROXY){
            $.getJSON(PROXY_URL,{'url':ISSU_URL+'?key='+API_KEY+'&status_id='+plugin.settings.status_id+'&category_id='+category_id},_receive_new_area);
        }else{
            $.getJSON(ISSU_URL,{'key':API_KEY,'status_id':plugin.settings.status_id,'category_id':category_id},_receive_new_area);
        }
	};
	////////プロパティ/////////////
	/**
	 * オーバレイの取得
	 */
	plugin.get_overlay=function(){
		return _overlay;
	}
    /**
     * ラベルの表示設定
     */
    plugin.set_show_info=function(flg){
        _is_show_info=flg;
        _maker_draw();
    }
    /**
     * ステータスの変更
     */
    plugin.set_status=function(str){
        _map_data_clear();
        plugin.settings.status_id=str;
        for(var i in _cat_ids){
            plugin.get_new_area(i);
        }

    }

//=============================================================================
// private method
//=============================================================================	

	/**
	 * エリアの受信時
	 * @param {Object} id
	 */
	var _receive_new_area= function(json_d){
		_data_substitution(json_d);//データの更新
		_map_data_draw();//描画
		//$(element).trigger('on_map_data_change');
	};
    /**
     * データのclear
     */
    var _map_data_clear=function(){
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
	 * データの差し替え
	 * @param {Object} id
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
            }
        };

        /*
		//削除される差分を検出（追加したdata以外の物）
		_del_map_list=[];
		for(var d in _map_data){
			if(!data[d]){
				_del_map_list.push(d);
			}
		}*/

		_map_data=list;
	};

	/**
	 * データのからエリアを描画
	 */
	var _map_data_draw=function(){
		//エリアの追加
		for (var i in _add_map_list){
			var id=_add_map_list[i];
			var data=_map_data[id];
			if(data){
				_overlay[id]=new KuwakeOverlay(map, data,plugin);
			}		
		}

		/*//エリアの削除
		for (var d in _del_map_list){
			var id=_del_map_list[d];
			var ov=_overlay[id];
			if(ov){
				ov.setMap(null);
				delete _overlay[id];
			}		
		}*/

        _maker_draw();
	}

    /**
     * markerの描画
     */
    var _cash_md;
    var _maker_draw=function(){
        var info_sw=false;
        console.log(_zoomLevel);
        //ラベル表示・非表示設定（一定以下の縮尺で表示）
        if(_is_show_info){
            if(_zoomLevel >= 16){
                info_sw=_is_show_info;
            }
        }
        //if(_cash_md!=info_sw){
            _cash_md=info_sw;
            for (var i in _overlay){
                _overlay[i].show_info(info_sw);
            }
        //}

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