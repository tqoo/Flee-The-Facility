enum ActionKind {
    Walking,
    Idle,
    Jumping,
    WlakRight,
    WalkUp,
    WalkDown
}
function InitwalkLeft () {
    walkleftanim = animation.createAnimation(ActionKind.Walking, 100)
    imgstilleft = assets.image`PlayerIdle`
    imgwalkleft = assets.image`PlayerWalk`
    imgstilleft.flipX()
    imgwalkleft.flipX()
    walkleftanim.addAnimationFrame(imgstilleft)
    walkleftanim.addAnimationFrame(imgwalkleft)
    animation.attachAnimation(mySprite, walkleftanim)
    walkrightanim = animation.createAnimation(ActionKind.WlakRight, 100)
    walkrightanim.addAnimationFrame(assets.image`PlayerIdle`)
    walkrightanim.addAnimationFrame(assets.image`PlayerWalk`)
    animation.attachAnimation(mySprite, walkrightanim)
}
function animatePlayer () {
    if (mySprite.vx < 0) {
        animation.setAction(mySprite, ActionKind.Walking)
        goingRight = false
    }
    if (mySprite.vx == 0 && mySprite.vy == 0) {
        animation.stopAnimation(animation.AnimationTypes.All, mySprite)
    }
    if (mySprite.vx > 0) {
        animation.setAction(mySprite, ActionKind.WlakRight)
        goingRight = true
    }
    if (mySprite.vy < 0) {
        animation.setAction(mySprite, ActionKind.WalkUp)
    }
    if (mySprite.vy > 0) {
        animation.setAction(mySprite, ActionKind.WalkDown)
    }
}
function initVertAnim () {
    walkUpAnim = animation.createAnimation(ActionKind.WalkUp, 100)
    walkUpAnim.addAnimationFrame(assets.image`playerbackwalk0`)
    walkUpAnim.addAnimationFrame(assets.image`playerbackwalk1`)
    animation.attachAnimation(mySprite, walkUpAnim)
    walkDownAnim = animation.createAnimation(ActionKind.WalkDown, 100)
    walkDownAnim.addAnimationFrame(assets.image`playerfrontwalk0`)
    walkDownAnim.addAnimationFrame(assets.image`playerfrontwalk1`)
    animation.attachAnimation(mySprite, walkDownAnim)
}
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (mySprite.tileKindAt(TileDirection.Top, assets.tile`dungeonBook`)) {
        game.showLongText("It's a book. \\n Or is it a journal?", DialogLayout.Bottom)
        game.showLongText("Either way, the pages are illegible anyways.", DialogLayout.Bottom)
    }
    if (mySprite.tileKindAt(TileDirection.Top, assets.tile`TrapMemo`)) {
        game.showLongText("It's a memo to \"Adam Kittle\" Would you like to read it?", DialogLayout.Bottom)
        if (game.ask("Read the memo?")) {
            game.showLongText(`"Adam, we just finished putting in those tiles you ordered, and they SUCK. They're so fragile that that... thing could easily just slip through and escape. We're gonna put in the flooring anyways, but when that thing ecapes, dont say I didn't warn you. 
 Kind regards, Joe Hills."`, DialogLayout.Bottom)
        }
    }
    if (mySprite.tileKindAt(TileDirection.Center, assets.tile`trapCracked`)) {
        game.showLongText("There's a cracked tile underneath you. \\n If you jump on it, it could break?", DialogLayout.Bottom)
        if (game.ask("Step on the tile?")) {
            for (let index = 0; index < 3; index++) {
                mySprite.vy += -12.5
                mySprite.ay = 25
                pauseUntil(() => mySprite.tileKindAt(TileDirection.Center, assets.tile`trapCracked`))
                mySprite.ay = 0
            }
        }
    }
})
let walkDownAnim: animation.Animation = null
let walkUpAnim: animation.Animation = null
let walkrightanim: animation.Animation = null
let imgwalkleft: Image = null
let imgstilleft: Image = null
let walkleftanim: animation.Animation = null
let mySprite: Sprite = null
let goingRight = false
goingRight = false
tiles.setCurrentTilemap(tilemap`level`)
mySprite = sprites.create(assets.image`PlayerIdle`, SpriteKind.Player)
controller.moveSprite(mySprite, 100, 100)
scene.cameraFollowSprite(mySprite)
InitwalkLeft()
initVertAnim()
forever(function () {
    animatePlayer()
})
