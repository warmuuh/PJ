//set main namespace
goog.provide('Editor');


//get requirements
goog.require('lime.Director');
goog.require('lime.Scene');
goog.require('lime.Layer');
goog.require('lime.Circle');
goog.require('lime.Polygon');
goog.require('lime.Label');

goog.require('goog.events.KeyCodes');



// entrypoint
Editor.start = function(){

    var WIDTH = 1024;
    var HEIGHT = 768;




	var director = new lime.Director(document.getElementById("content"),WIDTH,HEIGHT);
	var scene = new lime.Scene();
   // scene.setRenderer(lime.Renderer.CANVAS);
	var target = new lime.Layer();





    var bg = new lime.Sprite().setSize(2500,HEIGHT).setFill("img/lvl1.png").setAnchorPoint(0,0);
    var bglayer = new lime.Layer().setPosition(0,0).setSize(2500,HEIGHT);
    bglayer.appendChild(bg);
    scene.appendChild(bglayer);

    scene.appendChild(target);


    var stack = [];

    var cur = {};

    goog.events.listen(document, ['keydown'], function(e) {
        //scroll
        var tp = target.getPosition();

        if (e.keyCode == goog.events.KeyCodes.RIGHT) {
           tp.x -= 10;
        }

        if (e.keyCode == goog.events.KeyCodes.LEFT) {
            tp.x += 10;
        }


        if (e.keyCode == goog.events.KeyCodes.ENTER) {
            stack[stack.length] = cur;
            cur = {};
            updateCode(stack);

        }
        target.setPosition(tp.x , tp.y);
        bglayer.setPosition(tp.x , tp.y);
    });


    goog.events.listen(scene, ['mousedown', 'touchstart'], function(e){
        var pos = target.parentToLocal(e.position);
        if (cur.p == undefined)
        {
            cur.p = [pos.x, pos.y];
            cur.d = [[0,0]]
        }
        else
        {
            cur.d[cur.d.length] = [pos.x - cur.p[0], pos.y - cur.p[1]]
        }

        target.removeAllChildren();
        drawAll(stack, target);
        drawEntity(cur, target);

    });




	director.makeMobileWebAppCapable();

	// set current scene active
	director.replaceScene(scene);

}


function drawAll(elements, layer){

    for(var i = 0; i < elements.length; i++){
        var o = elements[i];
        drawEntity(o, layer);
    }
}


function drawEntity(curElement, layer){



    var poly = new lime.Polygon().setFill(0,0,0).setPosition(curElement.p[0], curElement.p[1]);
    for(var i = 0; i < curElement.d.length; i++){
        var d = curElement.d[i];
        poly.addPoint(new goog.math.Coordinate(d[0], d[1]));
    }
    layer.appendChild(poly);

}


function updateCode(elements){
   var ele = document.getElementById("code");
   ele.value = JSON.stringify(elements);

}




//this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('Editor.start', Editor.start);
