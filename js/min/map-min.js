var GeoInterface=function e(){function e(e){var t=e.target,n;d===!1?(o(e),d=t.feature.properties.name,n={},n[l]=t.feature.properties.name,network.updateEdge(p[m].id,n)):t.feature.properties.name===d&&(r(e),d=!1,n={},n[l]=void 0,network.updateEdge(p[m].id,n))}function t(){void 0!==p[m][l]?$.each(f._layers,function(e,t){t.feature.properties.name===p[m][l]&&n(t)}):s()}function o(e){var t=e.target;u.fitBounds(e.target.getBounds(),{maxZoom:14}),t.setStyle({fillOpacity:.8}),L.Browser.ie||L.Browser.opera||t.bringToFront()}function n(e){var t=e;u.fitBounds(e.getBounds(),{maxZoom:12}),t.setStyle({fillOpacity:.8}),L.Browser.ie||L.Browser.opera||t.bringToFront()}function r(e){f.resetStyle(e.target)}function a(){$.each(f._layers,function(e,t){f.resetStyle(t)})}function i(t,n){n.on({mouseover:o,mouseout:r,click:e})}function s(){u.setView([41.798395426119534,-87.83967137233888],11)}var c={},u,p,l="res_chicago_location_p_t0",m=0,f,d=!1,g=["#67c2d4","#1ECD97","#B16EFF","#FA920D","#e85657","#20B0CA","#FF2592","#153AFF","#8708FF"];return c.nextPerson=function(){m<p.length-1&&(a(),m++,$(".current-id").html(m+1),$(".map-node-status").html("Tap on the map to indicate the general area where <strong>"+p[m].nname_t0+"</strong> lives."),t())},c.previousPerson=function(){m>0&&(a(),m--,$(".current-id").html(m+1),$(".map-node-status").html("Tap on the map to indicate the general area where <strong>"+p[m].nname_t0+"</strong> lives."),t())},c.init=function(){u=L.map("map",{maxBounds:[[41.4985986599114,-88.49824022406345],[42.1070175291862,-87.07098424716594]],zoomControl:!1}),L.tileLayer("img/Tiles/{z}/{x}/{y}.png",{maxZoom:17,minZoom:11}).addTo(u),$.ajax({dataType:"json",url:"data/census2010.json",success:function(e){f=L.geoJson(e,{onEachFeature:i,style:function(){return{stroke:"#ff0000",fillColor:g[1],weight:0,fillOpacity:.3,strokeWidth:0}}}).addTo(u),p=network.getEdges({from:network.getNodes({type_t0:"Ego"})[0].id,type:"Dyad",res_cat_p_t0:"Chicago"}),$(".map-counter").html('<span class="current-id">1</span>/'+p.length),$(".map-node-status").html("Tap on the map to indicate the general area where <strong>"+p[0].nname_t0+"</strong> lives."),t()}}).error(function(){}),$(".map-back").on("click",c.previousPerson),$(".map-forwards").on("click",c.nextPerson)},c.destroy=function(){$(".map-back").off("click",c.previousPerson),$(".map-forwards").off("click",c.nextPerson)},c.init(),c};