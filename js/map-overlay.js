//=============================================================================
// カスタムオーバーレイ定義（Google Maps JavaScript API V3）
//=============================================================================

//区分け用カスタムオーバーレイのコンストラクタ
//MapOverlay(地図:obj,地図情報:obj,m_map_data_managerの参照)
function MapOverlay(map,data,manager_ref,select_comp_list) {
    this.setMap(map);//必須
    this.select_comp_list=select_comp_list;
    this.map_ = map;
    this.data_ = data;
    this.id=data.id;
    this.info= new google.maps.InfoWindow();
    this.info.setOptions({"disableAutoPan":true});//吹き出しを地図の中心に持ってくるか
    this.marker = new google.maps.Marker();
    this.marker_color={1:'FC7790',5:'32ceff',99:'44f186'};//1:未完了 5:完了　99:ブックマーク時のアイコン色

    //座標の生成（取得用に生成　marker.getPosition()ではMapOverlay.prototype.onAddが実行後でないと取得出来ないがonAddは非同期実行で取得順が保証出来ない為）
    this.latlng=null;
    var geo=eval("a="+this.data_.geometry);
    if(geo.coordinates){
        this.latlng=new google.maps.LatLng(geo.coordinates[1],geo.coordinates[0]);
    }


}
//カスタムオーバーレイ継承（draw と　removeは必ず実装する）
MapOverlay.prototype = new google.maps.OverlayView();

MapOverlay.prototype.createIco_img = function(is_select) {
    var status_id=this.data_.status.id;
    var color=is_select?this.marker_color[99]:this.marker_color[status_id];
    var status= this.data_.status.name.substring(0,1);

   return "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld="+status+"|"+color+"|000000";

}

MapOverlay.prototype.onAdd = function() {
	//KuwakeOverlayがsetMap(map)されたときに呼ばれる
    var self=this;
    this.marker.setPosition(this.latlng);
    this.marker.setIcon(this.createIco_img());
    this.marker.setMap(this.map_);

    /* マーカーがクリックされた時 */
    google.maps.event.addListener(this.marker, 'click', function() {
        self.show_info(true);
    });
    this.refresh();
}

MapOverlay.prototype.show_info = function(flg) {
    if(flg){
        if(currentInfoWindow){
            currentInfoWindow.close();
        }
        this.info.open(this.map_,this.marker);
        currentInfoWindow=this.info;
    }else{
        this.info.close();
        currentInfoWindow=undefined;
    }
}

MapOverlay.prototype.refresh=function(){
    var id=this.id;
    var description=this.data_.description;
    var subject=this.data_.subject;
    var is_select=this.select_comp_list[id];

    this.info.setContent( 'ID:'+id+'<br/>'+subject + '<br/>' + description+'<br/><a onclick="book_mark(this,'+id+')" class="btn comp'+(is_select?" selected":"")+'" >Mark</a>');
    this.marker.setIcon(this.createIco_img(is_select));
}


MapOverlay.prototype.get_marker_position=function(){
    return this.latlng;
}

//=============================================================================
//   プロトコル的な物（インターフェイスとでも言うのだろうか。。）
//=============================================================================
/*OverlayView描画処理 必須*/
MapOverlay.prototype.draw=function(){
    //ズーム、中心位置、マップタイプが変更されたときに呼ばれる
    /*
    if (!this.div_) {
          //
    }
    */
}

/*OverlayView削除処理 必須*/
MapOverlay.prototype.remove = function() {
    this.marker.setMap(null);
    if (this.div_) {
        this.div_.parentNode.removeChild(this.div_);
        this.div_ = null;
    }
}


