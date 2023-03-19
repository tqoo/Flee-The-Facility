enum ActionKind {
    Walking,
    Idle,
    Jumping,
    WlakRight,
    WalkUp,
    WalkDown
}
namespace SpriteKind {
    export const Enemy_Blob = SpriteKind.create()
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
    if (level == 1) {
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
                game.splash("You jumped on the tile.")
                game.splash("...")
                game.splash("...")
                game.splash("...")
                game.splash("It broke!")
                color.FadeToBlack.startScreenEffect(1000)
                color.pauseUntilFadeDone()
                tiles.setCurrentTilemap(tilemap`level2`)
                color.startFadeFromCurrent(color.originalPalette)
            }
        }
    }
})
function changeLevelFunctions () {
    enemies = []
    if (level == 2) {
        for (let index = 0; index < 4; index++) {
            enemies.push(sprites.create(assets.image`Blob`, SpriteKind.Enemy_Blob))
        }
        for (let value of enemies) {
            tiles.placeOnRandomTile(value, assets.tile`officeTile1`)
        }
    }
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy_Blob, function (sprite, otherSprite) {
    game.showLongText("You collide with a... blob?", DialogLayout.Bottom)
    FIGHT(otherSprite)
})
function FIGHT (enemy: Sprite) {
    fighting = true
    scene.setBackgroundImage(assets.image`fightbg`)
    tileUtil.unloadTilemap()
    scene.centerCameraAt(0, 0)
    for (let value of enemies) {
        sprites.destroy(value)
    }
    controller.moveSprite(mySprite, 0, 0)
    myMenu = miniMenu.createMenu(
    miniMenu.createMenuItem("Attack"),
    miniMenu.createMenuItem("Item"),
    miniMenu.createMenuItem("Run"),
    miniMenu.createMenuItem("4th Option")
    )
    myMenu.setPosition(-78, 35)
    myMenu.setDimensions(158, 25)
    myMenu.setMenuStyleProperty(miniMenu.MenuStyleProperty.Columns, 2)
    myMenu.setMenuStyleProperty(miniMenu.MenuStyleProperty.Rows, 2)
    myMenu.setMenuStyleProperty(miniMenu.MenuStyleProperty.UseAsTemplate, 1)
    myMenu.onButtonPressed(controller.A, function (selection, selectedIndex) {
        if (selection == "Attack") {
            myMenu.close()
            AttackMenu = miniMenu.createMenu(
            miniMenu.createMenuItem("Attack1"),
            miniMenu.createMenuItem("Attack2"),
            miniMenu.createMenuItem("Attack3"),
            miniMenu.createMenuItem("Attack4")
            )
            AttackMenu.setPosition(-78, 35)
        }
    })
}
let AttackMenu: miniMenu.MenuSprite = null
let myMenu: miniMenu.MenuSprite = null
let enemies: Sprite[] = []
let walkDownAnim: animation.Animation = null
let walkUpAnim: animation.Animation = null
let walkrightanim: animation.Animation = null
let imgwalkleft: Image = null
let imgstilleft: Image = null
let walkleftanim: animation.Animation = null
let mySprite: Sprite = null
let goingRight = false
let fighting = false
let level = 0
tiles.setCurrentTilemap(tilemap`level2`)
level = 2
let levels = [tilemap`level`, tilemap`level2`]
fighting = false
goingRight = false
mySprite = sprites.create(assets.image`PlayerIdle`, SpriteKind.Player)
controller.moveSprite(mySprite, 100, 100)
scene.cameraFollowSprite(mySprite)
InitwalkLeft()
initVertAnim()
changeLevelFunctions()
forever(function () {
    animatePlayer()
})
game.onUpdateInterval(500, function () {
    if (!(fighting)) {
        for (let value of enemies) {
            if (Math.percentChance(50) || value.tileKindAt(TileDirection.Center, assets.tile`officeWallTile`)) {
                if (Math.percentChance(50)) {
                    value.vx = 50
                } else {
                    value.vx = -50
                }
                if (Math.percentChance(50)) {
                    value.vy = 50
                } else {
                    value.vy = -50
                }
            }
        }
    }
})
