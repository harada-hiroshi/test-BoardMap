/**
 * 地図データ管理
 */
//=============================================================================
// カスタムオーバーレイ定義（Google Maps JavaScript API V3）
//=============================================================================
//カスタムオーバーレイ継承（draw と　removeは必ず実装する）
KuwakeOverlay.prototype = new google.maps.OverlayView();

//区分け用カスタムオーバーレイのコンストラクタ
//KuwakeOverlay(地図:obj,地図情報:obj,m_map_data_managerの参照)
function KuwakeOverlay(map,data,manager_ref) {
    this.map_ = map;
    this.data_ = data;
    this.manager_ref=manager_ref;
    this.info= new google.maps.InfoWindow();
    this.info.setOptions({"disableAutoPan":true});

    this.is_info=false;
    this.marker = new google.maps.Marker();
    this.marker_color={1:'FC7790',5:'8BCCF1'}
    this.setMap(map);


}

KuwakeOverlay.prototype.onAdd = function() {
	//KuwakeOverlayがsetMap(map)されたときに呼ばれる
    var self=this;
    var latlng;
    var subject=this.data_.subject;
    var id=this.data_.id;
    var status= this.data_.status.name.substring(0,1);
    var status_id=this.data_.status.id;
    var color= this.marker_color[status_id];
    var description=this.data_.description;
    var geo=eval("a="+this.data_.geometry);
    if(geo.coordinates){
        latlng=geo.coordinates;
    }
    this.marker.setPosition(new google.maps.LatLng(latlng[1],latlng[0]));


    var iurl="http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld="+status+"|"+color+"|000000";
    this.marker.setIcon(iurl);
    this.marker.setMap(this.map_);

    //todo::情報ウインドウコンテンツ 貼り付けチェック
    this.info.setContent( '<br/>ID:'+id+'<br/>'+subject + '<br/>' + description);

    /* マーカーがクリックされた時 */
    google.maps.event.addListener(this.marker, 'click', function() {
        self.info.open(self.map_,self.marker);


    });

}
KuwakeOverlay.prototype.show_info = function(flg) {
    is_info=flg;
    if(flg){
        this.info.open(this.map_,this.marker);
    }else{
        this.info.close();
    }
}

/*//オーバーレイ削除時のデストラクタ
KuwakeOverlay.prototype.onRemove = function() {
}*/

/*OverlayView描画処理 必須*/
KuwakeOverlay.prototype.draw=function(){
    //ズーム、中心位置、マップタイプが変更されたときに呼ばれる
    /*
    if (!this.div_) {
          //
    }
    */

}

/*OverlayView削除処理 必須*/
KuwakeOverlay.prototype.remove = function() {
    this.marker.setMap(null);
    if (this.div_) {
        this.div_.parentNode.removeChild(this.div_);
        this.div_ = null;
    }
}

