//set main namespace
goog.provide('PJ');


//get requirements
goog.require('lime.Director');
goog.require('lime.Scene');
goog.require('lime.Layer');
goog.require('lime.Circle');
goog.require('lime.RoundedRect');
goog.require('lime.Label');
goog.require('lime.animation.Spawn');
goog.require('lime.animation.FadeTo');
goog.require('lime.animation.ScaleTo');
goog.require('lime.animation.MoveTo');
goog.require('lime.fill.LinearGradient');

goog.require('box2d.BodyDef');
goog.require('box2d.BoxDef');
goog.require('box2d.CircleDef');
goog.require('box2d.CircleShape');
goog.require('box2d.PolyDef');
goog.require('box2d.Vec2');
goog.require('box2d.World');

goog.require('PPoly');
goog.require('PBox');
goog.require('Player');


//must be ccw!
var data = [{"p":[30,397],"d":[[0,0],[87,-37],[190,-38]]},{"p":[165,188],"d":[[0,0],[66,75],[180,-45],[22,-55]]},{"p":[230,266],"d":[[0,0],[23,55],[129,86],[191,43],[271,-75],[155,-121],[127,-123]]},{"p":[350,422],"d":[[0,0],[204,32],[81,55]]},{"p":[578,454],"d":[[0,0],[96,-24],[63,8]]},{"p":[706,429],"d":[[0,0],[81,-10],[117,59]]},{"p":[816,465],"d":[[0,0],[69,30],[36,38]]},{"p":[862,276],"d":[[0,0],[-12,-91],[105,-119],[197,-97],[289,-44],[337,28],[321,95],[201,102],[48,50]]},{"p":[961,493],"d":[[0,0],[85,-13],[203,-12],[98,15]]},{"p":[1269,481],"d":[[0,0],[89,28],[16,38]]},{"p":[1360,512],"d":[[0,0],[115,3],[69,25]]},{"p":[1469,326],"d":[[0,0],[79,-96],[224,-158],[360,-211],[442,-184],[323,-78],[152,-4],[67,27]]},{"p":[1586,500],"d":[[0,0],[46,-21],[47,12]]},{"p":[1631,477],"d":[[0,0],[42,-67],[47,-13]]},{"p":[1676,406],"d":[[0,0],[103,-4],[58,22]]},{"p":[1869,373],"d":[[0,0],[159,6],[323,47]]},{"p":[2198,421],"d":[[0,0],[96,7],[48,25]]},{"p":[2285,58],"d":[[0,0],[128,218],[-14,328]]}]

// entrypoint
PJ.start = function(){

    var WIDTH = 1024;
    var HEIGHT = 768;
    var scrollSpeed = 200;

    box2d.Settings.b2_velocityThreshold = 0.1;
    box2d.Settings.b2_maxPolyVertices = 16;

    var gravity = new box2d.Vec2(0, 300);
    var bounds = new box2d.AABB();
    bounds.minVertex.Set(-WIDTH, -HEIGHT);
    bounds.maxVertex.Set(3*WIDTH,2*HEIGHT);
    var world = new box2d.World(bounds, gravity, false);




	
	var director = new lime.Director(document.body,WIDTH,HEIGHT);
	var scene = new lime.Scene();
   // scene.setRenderer(lime.Renderer.CANVAS);

    var bg = new lime.Sprite().setSize(2500,HEIGHT).setFill("img/lvl1.png").setAnchorPoint(0,0);
    var bglayer = new lime.Layer().setPosition(0,0).setSize(2500,HEIGHT);
    bglayer.appendChild(bg);

    scene.appendChild(bglayer);


    var target = new lime.Layer();

    var player = new Player().setPosition(50, 200).pcreate(world);
    player.SetVelocity(scrollSpeed);
    target.appendChild(player);



    for(var i = 0; i < data.length; ++i){
        var p = data[i];
        var poly = new PPoly(p.d).setFill(0,0,0).setPosition(p.p[0], p.p[1])
            .setRestitution(.0).setDensity(0).setFriction(0.0001).pcreate(world);
      //  target.appendChild(poly);
    }

    scene.appendChild(target);


    goog.events.listen(scene, ['mousedown', 'touchstart'], function(e){
        player.Jump();
    });


    lime.scheduleManager.schedule(function(dt) {
        world.Step(dt / 1000, 3);

        //scroll
        var tp = target.getPosition();
        target.setPosition(tp.x - scrollSpeed* (dt /1000), tp.y);
        bglayer.setPosition(tp.x - scrollSpeed* (dt /1000), tp.y);
        player.SetVelocity(scrollSpeed);
    },this);


	director.makeMobileWebAppCapable();

	// set current scene active
	director.replaceScene(scene);

}


//this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('PJ.start', PJ.start);
