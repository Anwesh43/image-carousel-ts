const w : number = window.innerWidth 
const h : number = window.innerHeight
const delay : number = 30 
const sizeFactor : number = 1.3
const indicatorSizeFactor : number = 60.9

const getSize : Function = () : number => Math.min(w, h) / sizeFactor 

const getIndicatorSize : Function = () : number => Math.min(w, h) / indicatorSizeFactor

class Stage {

    div : HTMLDivElement = document.createElement('div')
    imageContainer : ImageContainer = new ImageContainer()
    animator : Animator = new Animator()

    initStyle() {
        const size : number = getSize()
        this.div.style.width = `${size}px` 
        this.div.style.height = `${size}px`
        this.div.style.position = 'absolute'
        this.div.style.left = `${w / 2 - size / 2}px`
        this.div.style.top = `${h / 2 - size / 2}px`
        this.div.style.border = '1px dotted black'
        this.div.style.overflow = 'clip'
        this.imageContainer.initStyle()
        this.imageContainer.appendToParent(this.div)
        document.body.appendChild(this.div)
    }

    handleKey() {
        const codeActionMap : Record<string, Function> = {
            "ArrowRight": () => {
                this.imageContainer.start(() => {
                   this.animator.stop() 
                }, 1)
            },
            "ArrowLeft": () => {
                this.imageContainer.start(() => {
                    this.animator.stop() 
                 }, -1)
            }
        }
        window.onkeydown = (e : KeyboardEvent) => {
            console.log("CODE", e.code)
            if (e.code in codeActionMap) {
                this.animator.start(() => {
                    codeActionMap[e.code]()
                })
                
            }           
        }
    }

    addImage(src : string) {
        const img : HTMLImageElement = document.createElement('img')
        img.src = src 
        this.imageContainer.addImage(img)
    }

    static init() : Stage {
        const stage : Stage = new Stage()
        stage.initStyle()
        stage.handleKey()
        return stage 
    }

}

class Animator {

    animated : boolean = false 
    interval : number 

    start(cb : Function) {
        if (!this.animated) {
            this.animated = true 
            this.interval = setInterval(cb, delay)
        }
    }

    stop() {
        if (this.animated) {
            this.animated = false 
            clearInterval(this.interval)
        }
    }
}

class State {

    scale : number = 0 

    update(cb : Function) {
        this.scale += 0.1
        if (Math.abs(this.scale) > 1) {
            this.scale = 0 
            cb()
        }
    }
}

class ImageContainer {
    screen : HTMLDivElement = document.createElement('div')
    index : number = 0 
    dw : number = 0
    state : State = new State()
    indicatorContainer : IndicatorContainer = new IndicatorContainer()

    initStyle() {
        const size : number = getSize()
        this.screen.style.height = `${size}px`
        this.screen.style.width = `${size}px`
        this.screen.style.position = 'absolute'
        this.screen.style.float = 'left'
        this.indicatorContainer.initStyle()
    }

    addImage(img : HTMLImageElement) {
        const size : number = getSize()
        img.style.width = `${size}px`
        img.style.height = `${size}px`
        this.screen.style.width = `${parseFloat(this.screen.style.width) + size}px`
        this.screen.appendChild(img)
        this.indicatorContainer.addItem()
    }

    next() {
        if (this.index === this.screen.children.length - 1) {
            return 
        }
        const size : number = getSize()
        const x = size * (-this.index) - size * this.state.scale 
        this.screen.style.left = `${x}px`
    }

    prev() {
        
        if (this.index === 0) {
            return 
        }
        const size : number = getSize()
        const x = size * (-this.index) + size * this.state.scale
        this.screen.style.left = `${x}px`
    }

    shouldUpdate(dir : number) {
        if (dir == 1 && this.index === this.screen.children.length - 1) {
            return false 
        }
        if (dir == -1 && this.index === 0) {
            return false 
        }
        return true
    }

    start(cb : Function, dir : number = 1) {
        if (!this.shouldUpdate(dir)) {
            cb()
            return 
        }
        if (dir == 1) {
            this.next()
        } else {
            this.prev()
        }
        this.indicatorContainer.update(this.index, dir, this.state.scale)
        this.state.update(() => {
            this.index += dir  
            cb()
        })
    }

    appendToParent(div : HTMLDivElement) {
        div.appendChild(this.screen)
        this.indicatorContainer.appendToParent(div)
    }
}

class IndicatorItem {

    div : HTMLDivElement = document.createElement('div')
    filledDiv : HTMLDivElement = document.createElement('div')
    
    constructor(private i : number) {

    }

    initStyle() {
        const size : number = getSize()
        const indicatorSize = getIndicatorSize()
        this.div.style.width = `${indicatorSize}px` 
        this.div.style.height = `${indicatorSize}px`
        this.div.style.border = '1px solid white'
        this.div.style.position = 'absolute'
        this.div.style.left = `${this.i * 2 * indicatorSize}px`
        this.div.style.borderRadius = '50%'
        this.filledDiv.style.width = `0px` 
        this.filledDiv.style.height = `0px`
        this.filledDiv.style.position = 'absolute'
        this.filledDiv.style.background = 'white'
        this.filledDiv.style.borderRadius = '50%'
        this.div.appendChild(this.filledDiv)
    }

    appendToParent(div : HTMLDivElement) {
        div.appendChild(this.div)
    }

    updateIndex(scale : number) {
        const indicatorSize : number = getIndicatorSize()
        this.filledDiv.style.width = `${indicatorSize * scale}px`
        this.filledDiv.style.height = `${indicatorSize * scale}px`
        this.filledDiv.style.left = `${indicatorSize / 2 - indicatorSize * 0.5 * scale}px`
        this.filledDiv.style.top = `${indicatorSize / 2 - indicatorSize * 0.5 * scale}px`
    }
}

class IndicatorContainer {
    
    div : HTMLDivElement = document.createElement('div')
    indicatorElements : Array<IndicatorItem> = []

    initStyle() {
        const size : number = getSize()
        const indicatorSize : number = getIndicatorSize()
        this.div.style.position = 'absolute'
        this.div.style.top = `${size - 4 * indicatorSize}px`
    }

    addItem() {
        const size : number = getSize()
        const indicatorSize : number = getIndicatorSize()
        const item : IndicatorItem = new IndicatorItem(this.indicatorElements.length)
        this.indicatorElements.push(item)
        item.initStyle()
        item.appendToParent(this.div)
        this.div.style.left = `${size / 2 - indicatorSize * this.indicatorElements.length}px`
        if (this.indicatorElements.length == 1) {
            item.updateIndex(1)           
        }
    }

    update(index : number, dir : number,  scale : number) {
        this.indicatorElements[index + dir].updateIndex(scale)
        this.indicatorElements[index].updateIndex(1 - scale)
    }

    appendToParent(div : HTMLDivElement) {
        div.appendChild(this.div)
    }
}