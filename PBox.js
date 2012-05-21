goog.provide("PBox");


//get requirements
goog.require('lime.RoundedRect');

goog.require('box2d.BodyDef');
goog.require('box2d.BoxDef');
goog.require('box2d.PolyDef');
goog.require('box2d.Vec2');
goog.require('box2d.World');



PBox = function(x,y){
    goog.base(this);

    this.setAnchorPoint(.5,.5);

    this.shapeDef = new box2d.PolyDef;
    this.setSize(x,y);
    this.bodyDef = new box2d.BodyDef;
    this.bodyDef.AddShape(this.shapeDef);


}
goog.inherits(PBox, lime.RoundedRect);


PBox.prototype.setRestitution = function(val){
    this.shapeDef.restitution = val;
    return this;
}


PBox.prototype.setDensity = function(val){
    this.shapeDef.density = val;
    return this;
}

PBox.prototype.setFriction = function(val){
    this.shapeDef.friction = val;
    return this;
}

PBox.prototype.setSize = function(x,y){
    PBox.superClass_.setSize.call(this, x,y);
    var x2 = x/2;
    var y2 = y/2;
    this.shapeDef && this.shapeDef.SetVertices([[-x2,-y2],[x2,-y2],[x2,y2],[-x2,y2]]); //actually not a box
    return this;
}

PBox.prototype.setPosition = function(x,y){
    PBox.superClass_.setPosition.call(this, x,y);
    this.bodyDef && this.bodyDef.position.Set(x, y);
    return this;
}


//box2d sync functions
PBox.prototype.pcreate = function(world){
    this.pbody = world.CreateBody(this.bodyDef);



    if (this.shapeDef.density > 0)
        lime.scheduleManager.schedule(this.psync,this);

    return this;
}


PBox.prototype.psync = function(dt) {
    var pos = this.GetBody().GetCenterPosition().clone();
    PBox.superClass_.setPosition.call(this,pos.x, pos.y);
}

PBox.prototype.pupdate = function(world){
    lime.scheduleManager.unschedule(this.psync,this);

    world.DestroyBody(this.GetBody());
    this.pcreate(world);
}

PBox.prototype.GetBody = function(){
    return this.pbody;
}






