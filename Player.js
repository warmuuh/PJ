goog.provide("Player");


//get requirements
goog.require('lime.Circle');

goog.require('box2d.BodyDef');
goog.require('box2d.BoxDef');
goog.require('box2d.PolyDef');
goog.require('box2d.Vec2');
goog.require('box2d.World');



Player = function(){
    goog.base(this);

    this.setAnchorPoint(.5,.5);

    this.shapeDef =  new box2d.CircleDef;
    this.shapeDef.radius = 20;
    this.shapeDef.density = .001;
    this.shapeDef.restitution =.2;
    this.shapeDef.friction = 0.0001;
    this.bodyDef = new box2d.BodyDef;
    this.bodyDef.AddShape(this.shapeDef);

    this.bodyDef.angularDamping = .001;



    this.setSize(40,40).setFill(255,150,0).setAnchorPoint(.5,.5).setPosition(150, 570).setFill(
        new lime.fill.LinearGradient().addColorStop(0.49,200,0,0).addColorStop(.5,0,0,250)) ;



}
goog.inherits(Player, lime.Circle);

Player.prototype.Jump = function(){
    this.GetBody().ApplyImpulse(new box2d.Vec2(0,-400), this.GetBody().GetCenterPosition() )
}

Player.prototype.SetVelocity = function(x){
    var vel = this.GetBody().GetLinearVelocity();
    vel.x = x;
    this.GetBody().SetLinearVelocity(vel);
}

//Player.prototype.setSize = function(x,y){
//    Player.superClass_.setSize.call(this, x,y);
//    var x2 = x/2;
//    var y2 = y/2;
//    this.shapeDef && this.shapeDef.SetVertices([[-x2,-y2],[x2,-y2],[x2,y2],[-x2,y2]]); //actually not a box
//    return this;
//}

Player.prototype.setPosition = function(x,y){
    Player.superClass_.setPosition.call(this, x,y);
    this.bodyDef && this.bodyDef.position.Set(x, y);
    return this;
}


//box2d sync functions
Player.prototype.pcreate = function(world){
    this.pbody = world.CreateBody(this.bodyDef);



    if (this.shapeDef.density > 0)
        lime.scheduleManager.schedule(this.psync,this);

    return this;
}


Player.prototype.psync = function(dt) {
    var pos = this.GetBody().GetCenterPosition().clone();
    var rot = this.GetBody().GetRotation();
    this.setRotation(-rot/Math.PI*180);
    Player.superClass_.setPosition.call(this,pos.x, pos.y);
}

Player.prototype.pupdate = function(world){
    lime.scheduleManager.unschedule(this.psync,this);

    world.DestroyBody(this.GetBody());
    this.pcreate(world);
}

Player.prototype.GetBody = function(){
    return this.pbody;
}






