/**
 * 配列の中にあるオブジェクトのプロパティ単位で合算する
 */
function UTL_array_sum(data,prop){
	var rt=0;
	for(var i in data){
		var d=data[i][prop];
		rt+=isNaN(Number(d)) ? 0 :  parseInt(d, 10);
	}
	return rt;
}
/**
 * 度→ラジアンに変換
 */
function UTL_to_radian(deg){
	return deg/180*Math.PI;
}
/**
 * 配列がarrayか判定
 * @param {Object} o
 */
function UTL_is_array(o){
	var b = false;
	switch (true) {
		case (o instanceof Object):
			b = true;
			break;
		case (o instanceof Array):
			b = true;
			break;
		default:
			b = false;
	}
	return (b);
}


/**
 * 数値にキャストする関数 (A)　配列内のstrを数値に変換し再格納
 * UTL_arr_cast_num(&ref_ar)　
 * ref_arは参照で元の配列が変更される
 */
function UTL_arr_cast_num(ref_ar){
	var res = new Array();
	for (var t = 0; t < ref_ar.length; ++t) {
		var val = ref_ar[t];
		ref_ar[t] = parseInt(ref_ar[t], 10);
	}
}

/**
 * 数値にキャストする関数 (B)　
 * str・空欄・Nullを含む数値以外の文字列はconvert_strで指定した値に変換
 * nan_convert(ソースstring:string,空欄・Nullの場合に返す値:string又はNumber)
 */
function UTL_nan_convert(str, convert_str){
	if (convert_str === undefined) {
		//convert_strが省略された場合はデフォルトで0を代入する
		convert_str = 0;
	}
	var a = isNaN(Number(str)) ? convert_str : Number(str);
	return a;
};
/**
 * 表示用整形 3桁カンマ
 * @param {Object} num
 */
function UTL_number_format(num){
	//return num;
	var s=num.toString();
	return s.replace( /([0-9]+?)(?=(?:[0-9]{3})+$)/g,'$1,');
}
/**
 * 表示用整形（文字列の空白を埋める）
 * string_space(判定する文字列, 最大の文字バイト数,空白に当てはめる文字)
 */
function UTL_string_space(str, bytes, spec_character){
	return _getTrimBytes(str, bytes, spec_character);
};

/**
 * 規定のバイト数の文字数にする
 */
function _getTrimBytes(str, bytes, spstr){
	if (!spstr) {
		spstr = " ";
	}
	var put = "";
	var cnt = 0;
	var len = str.length;
	while (len--) {
		var ct;
		var sstr = str.substr(len, 1);
		if (_checkHalf(sstr)) {
			cnt++;
			if (cnt <= bytes) {
				put = sstr + put;
			}
			else {
				break;
			}
		}
		else {
			cnt += 2;
			if (cnt <= bytes) {
				put = sstr + put;
			}
			else {
				if (cnt == (bytes + 1)) {
					put += spstr;
					break;
				}
			}
		}
	}
	if (cnt < bytes) {
		put += _wsp(bytes - cnt);
	}
	return put;
}

// 文字列のバイト数を調べる
function _getStrBytesTotal(str){
	var cnt = 0;
	var len = str.length;
	while (len--) {
		(_checkHalf(str.substr(len, 1))) ? cnt++ : cnt += 2;
	}
	return cnt;
}

function _checkHalf(str){
	return (checkCode(str, 0x00, 0x7f) || checkCode(str, 0xFF61, 0xFF9F)) ? true : false;
}

// コードチェック（文字,範囲小,範囲大）
function checkCode(str, min, max){
	var len = str.length;
	while (len--) {
		var num = str.substr(len, 1).charCodeAt(0);
		if (num < min || num > max) {
			return false;
			break;
		}
	}
	return true;
}

/**
 * 表示用整形（null undefindは空白にして出力）
 */
function UTL_string_val(str){
	return (Boolean(str)) ? str : "";
}

/**
 * 表示用整形 金額表記変換(3桁カンマ)
 */
function UTL_string_price(num){
	//マイナス表記の場合はマイナスを削除
	var mainasu_flg = ""
	if (Number(num) < 0) {
		mainasu_flg = "-"
	}
	 return mainasu_flg+(num.toString().replace( /([0-9]+?)(?=(?:[0-9]{3})+$)/g,'$1,'));
	
}
/**
 *文字の置換
 *replace(対象文字,検索文字（配列）,置換文字（配列）){
 */
function UTL_replace(txtMoji, serch_txt, change_txt){
	for (var intLoop = 0; intLoop < serch_txt.length; intLoop++) {
		txtMoji = txtMoji.split(serch_txt[intLoop]).join(change_txt[intLoop]);
	}
	return txtMoji;
};

/**
 *URLパラメータをOBJで返す
 */
function UTL_get_prm_obj(){
	var pm = location.href.split("?")[1];
	if (!pm) {
		return;
	};
	var ss = pm.split("&");
	var obj = {};
	for (i = 0; i < ss.length; i++) {
		it = ss[i].split("=");
		obj[it[0]] = it[1];
	};
	return obj;
};
/**
 *端末の判定
 */
function UTL_userAgent(){
	var mobile;
	var agent = navigator.userAgent;
	if (agent.search(/iPad/) != -1) {
		mobile = "ipad";
	}
	else 
		if (agent.search(/Android/) != -1) {
			mobile = "android";
		}
		else {
			mobile = "pc";
		};
	return mobile;
};


/**
 * PCブラウザ　IE9以下のチェック
 */
function UTL_has_ie(){
	//attachEventの有無で検出
	return !(window.addEventListener);
};
/**
 * ユニーク値の生成
 */
function UTL_create_uuid(){
	return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
};

/**
 * 指定したプロパティのみを含めてオブジェクトをコピーする
 */
function UTL_copy_objct_prop(obj, prop_name_ar){
	var r_obj;
	if (obj instanceof Array && (obj.length)) {
		r_obj = new Array();
		for (var i = 0; i < obj.length; ++i) {
			var res = copy_objct_prop(obj[i], prop_name_ar);
			if (res != undefined) {
				r_obj.push(res);
			}
		}
	}
	else 
		if (obj instanceof Object) {
			r_obj = new Object();
			for (var idx in obj) {
				var val = obj[idx];
				for (var lp in prop_name_ar) {
					//同じプロパティのみ処理
					if (idx == prop_name_ar[lp]) {
						r_obj[idx] = copy_objct_prop(val, prop_name_ar);
					}
				}
				
			}
			
		}
		else {
			r_obj = obj;
		}
	
	//逆順で配列される為、順番を入れ替える
	if (r_obj instanceof Array && (r_obj.length)) {
		r_obj = r_obj.reverse()
	}
	return r_obj;
}



//-------------------------------//
//デバッグ用
//-------------------------------//
var _debug_mode = false;
/**
 * デバッグモード
 */
function UTL_set_debug_mode(bool){
	_debug_mode = bool;
	if (_debug_mode) {
		$('#debug_view').show();
	}
	else {
		$('#debug_view').hide();
	}
}

function UTL_get_debug_mode(){
	return _debug_mode;
}
/**
 * デバッグメッセージ出力 (msg,出力先0〜,出力反転:true 上から)
 */
function UTL_debug_msg(msg, disp_pos, reverse){
	if (!_debug_mode) {
		return;
	}
	var disp = disp_pos ? disp_pos : 0
	if (reverse) {
		$('#debug_' + disp).html($('#debug_' + disp).html() + "<br/>" + msg);
	}
	else {
		$('#debug_' + disp).html(msg + "<br/>" + $('#debug_' + disp).html());
	}
}

function UTL_debug_msg_clear(disp_pos){
	var disp = disp_pos ? disp_pos : 0
	$('#debug_' + disp).html("");
}

//