goog.provide("PPoly");


//get requirements
goog.require('lime.Polygon');

goog.require('box2d.BodyDef');
goog.require('box2d.BoxDef');
goog.require('box2d.PolyDef');
goog.require('box2d.Vec2');
goog.require('box2d.World');



PPoly = function(vertices){
    goog.base(this);

    this.setAnchorPoint(.5,.5);

    this.shapeDef = new box2d.PolyDef;
    this.bodyDef = new box2d.BodyDef;
    this.bodyDef.AddShape(this.shapeDef);

    this.setVertices(vertices);

}
goog.inherits(PPoly, lime.Polygon);


PPoly.prototype.setRestitution = function(val){
    this.shapeDef.restitution = val;
    return this;
}

PPoly.prototype.setVertices = function(vertices){
    this.shapeDef.SetVertices(vertices);
    this.setPoints([]);
    for(var v in vertices){
        this.addPoint(new goog.math.Coordinate(vertices[v][0], vertices[v][1]));
    }

}

PPoly.prototype.setDensity = function(val){
    this.shapeDef.density = val;
    return this;
}

PPoly.prototype.setFriction = function(val){
    this.shapeDef.friction = val;
    return this;
}

//PPoly.prototype.setSize = function(x,y){
//    PPoly.superClass_.setSize.call(this, x,y);
//    var x2 = x/2;
//    var y2 = y/2;
//    this.shapeDef && this.shapeDef.SetVertices([[-x2,-y2],[x2,-y2],[x2,y2],[-x2,y2]]); //actually not a box
//    return this;
//}

PPoly.prototype.setPosition = function(x,y){
    PPoly.superClass_.setPosition.call(this, x,y);
    this.bodyDef && this.bodyDef.position.Set(x, y);
    return this;
}


//box2d sync functions
PPoly.prototype.pcreate = function(world){
    this.pbody = world.CreateBody(this.bodyDef);



    if (this.shapeDef.density > 0)
        lime.scheduleManager.schedule(this.psync,this);

    return this;
}


PPoly.prototype.psync = function(dt) {
    var pos = this.GetBody().GetCenterPosition().clone();
    PPoly.superClass_.setPosition.call(this,pos.x, pos.y);
}

PPoly.prototype.pupdate = function(world){
    lime.scheduleManager.unschedule(this.psync,this);

    world.DestroyBody(this.GetBody());
    this.pcreate(world);
}

PPoly.prototype.GetBody = function(){
    return this.pbody;
}






